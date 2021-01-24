/**
 * The default dimensions of each cell in non-descript units.
 */
const DEFAULT_CELL_WIDTH_UNITS = 32;
const DEFAULT_CELL_HEIGHT_UNITS = 32;

export enum CellTypes {

}

export interface Cell {
    row: number;
    col: number;
}

export interface BoundingBox {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

/**
 * Interface describing the Cell Type object
 */
export interface CellType {
    type: string,
    value: number,
    label: string,
    class: string,
    bgColor: string,
    isPath: boolean
}

/**
 * Interface describing the CellDimensions object
 */
export interface CellDimensions {
    width: number;
    height: number;
}

export interface MazeExtents {
    rows: number;
    cols: number;
    xMax: number;
    yMax: number;
}

/**
 * This object defines the types of cells the maze can be composed of.
 */
export const mazeCellTypes: any = {
    wall: {
        type: 'wall',
        value: 0,
        label: 'Wall',
        class: 'mazeWall',
        bgColor: 'black',
        isPath: false
    },
    path: {
        type: 'path',
        value: 1,
        label: 'Path',
        class: 'mazePath',
        bgColor: 'white',
        isPath: true
    },
    start: {
        type: 'start',
        value: 2,
        label: 'Start',
        class: 'mazeStart',
        bgColor: 'lightgreen',
        isPath: true
    },
    end: {
        type: 'end',
        value: 3,
        label: 'End',
        class: 'mazeEnd',
        bgColor: 'red',
        isPath: true
    }
}

export class Maze {
    width: number;
    height: number;
    cells: Array<string>;
    cellDimensions: CellDimensions;

    constructor(width: number, height: number, cells: Array<string>, cellWidth: number, cellHeight: number) {
        if (!width || !height) {
            throw new Error(`width and height must have values`);
        }

        this.width = width;
        this.height = height;
        this.cells = cells;

        // Cell dimensions in units. Can be used for player position, and as
        // pixel count durning rendering.
        this.cellDimensions = {
            width: cellWidth || DEFAULT_CELL_WIDTH_UNITS,
            height: cellHeight || DEFAULT_CELL_HEIGHT_UNITS
        }

        if (!this.cells) {
            this.cells = new Array();
            const arrayLength = this.width * this.height;
            for (let i = 0; i < arrayLength; ++i) {
                this.cells.push('wall');
            }
        }
    }

    static fromJSON(mazeJSON: any): Maze {
        let mazeObj = null;
        if (typeof (mazeJSON) === 'string') {
            mazeObj = JSON.parse(mazeJSON);
        } else {
            mazeObj = mazeJSON;
        }

        return new Maze(
            mazeObj.width,
            mazeObj.height,
            mazeObj.cells,
            mazeObj.cellDimensions.width,
            mazeObj.cellDimensions.height);
    }

    toJSON(): string {
        let mazeObj = {
            width: this.width,
            height: this.height,
            cellDimensions: this.cellDimensions,
            cells: this.cells
        }

        return JSON.stringify(mazeObj);
    }

    getMazeExtents(): MazeExtents {
        const extents = {
            rows: this.width,
            cols: this.height,
            xMax: this.width * this.cellDimensions.width,
            yMax: this.height * this.cellDimensions.height
        };

        return extents;
    }

    getCellType(row: number, col: number): CellType {
        const cellIdx = this.calcCellIndex(row, col);

        let cellTypeStr;
        let cellType = null;
        if (cellIdx >= 0 && cellIdx < this.cells.length) {
            cellTypeStr = this.cells[cellIdx];
            cellType = mazeCellTypes[cellTypeStr];
        }

        return cellType;
    }

    setCellType(row: number, col: number, cellType: string) {
        if (cellType === 'start') {
            this.setStartCell(row, col);
        } else if (cellType === 'end') {
            this.setEndCell(row, col);
        } else {
            const cellIdx = this.calcCellIndex(row, col);
            this.cells[cellIdx] = cellType;
        }
    }

    getStartCell(): Cell | null {
        let startCell = null;
        this.cells.some((cell, idx) => {
            if (cell === 'start') {
                const row = Math.floor(idx / this.width);
                const col = idx - (row * this.width);
                startCell = { row: row, col: col };
                return true;
            }

            return false;
        });

        return startCell;
    }

    setStartCell(row: number, col: number) {
        // First find and clear the exising start cell
        this.cells.some((cell, idx) => {
            if (cell === 'start') {
                this.cells[idx] = 'path';
                return true;
            }

            return false;
        });

        // Then set the start cell to the new cell
        const cellIdx = this.calcCellIndex(row, col);
        this.cells[cellIdx] = 'start';
    }

    getEndCell(): Cell | null {
        let endCell = null;
        this.cells.some((cell, idx) => {
            if (cell === 'end') {
                const row = Math.floor(idx / this.width);
                const col = idx - (row * this.width);
                endCell = { row: row, col: col };
                return true;
            }

            return false;
        });

        return endCell;
    }

    setEndCell(row: number, col: number) {
        // First find and clear the exising end cell
        this.cells.some((cell, idx) => {
            if (cell === 'end') {
                this.cells[idx] = 'path';
                return true;
            }

            return false;
        });

        // Then set the end cell to the new cell
        const cellIdx = this.calcCellIndex(row, col);
        this.cells[cellIdx] = 'end';
    }

    getCellDimensions(): CellDimensions {
        return this.cellDimensions;
    }

    setCellDimensions(width: number, height: number) {
        this.cellDimensions.width = width;
        this.cellDimensions.height = height;
    }

    getCellBoundingBox(row: number, col: number): BoundingBox | null {
        let bbox = null;
        if (row > -1 && row < this.height && col > -1 && col < this.width) {
            const left = col * this.cellDimensions.width;
            const top = row * this.cellDimensions.height;
            const right = left + this.cellDimensions.width - 1;
            const bottom = top + this.cellDimensions.height - 1;

            bbox = {
                left: left,
                top: top,
                right: right,
                bottom: bottom
            };
        }

        return bbox;
    }

    getCellFromXYUnits(x: number, y: number): Cell | null {
        let cell = null;

        if (x < 0 || x >= this.width * this.cellDimensions.width ||
            y < 0 || y >= this.height * this.cellDimensions.height) {
            // These coordinates are outside the maze boundaries
            cell = null;
        } else {
            cell = {
                row: Math.floor(y / this.cellDimensions.height),
                col: Math.floor(x / this.cellDimensions.width)
            }
        }

        return cell;
    }

    private calcCellIndex(row: number, col: number): number {
        let cellIdx = -1;
        if (row > -1 && row < this.height && col > -1 && col < this.width) {
            const rowStartIdx = row * this.width;
            cellIdx = rowStartIdx + col;
        }

        return cellIdx;
    }
}