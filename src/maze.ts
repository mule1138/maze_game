
import { BoundingBox } from './common';

/**
 * The default dimensions of each cell in non-descript units.
 */
const DEFAULT_CELL_WIDTH_UNITS = 32;
const DEFAULT_CELL_HEIGHT_UNITS = 32;

export enum CellTypes {
    START = 'Start',
    END = 'End',
    PATH = 'Path',
    WALL = 'Wall'
}

export interface Cell {
    row: number;
    col: number;
    cellType: CellType;
}

/**
 * Interface describing the Cell Type object
 */
export interface CellType {
    type: CellTypes,
    value: number,
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
    Wall: {
        type: CellTypes.WALL,
        value: 0,
        class: 'mazeWall',
        bgColor: 'black',
        isPath: false
    },
    Path: {
        type: CellTypes.PATH,
        value: 1,
        class: 'mazePath',
        bgColor: 'white',
        isPath: true
    },
    Start: {
        type: CellTypes.START,
        value: 2,
        class: 'mazeStart',
        bgColor: 'lightgreen',
        isPath: true
    },
    End: {
        type: CellTypes.END,
        value: 3,
        class: 'mazeEnd',
        bgColor: 'red',
        isPath: true
    }
}

export class Maze {
    width: number;
    height: number;
    // cells: Array<CellTypes>;
    cells: Array<Cell>;
    cellDimensions: CellDimensions;

    constructor(width: number, height: number, cells: Array<Cell>, cellWidth: number, cellHeight: number) {
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
            for (let row = 0; row < height; ++row) {
                for (let col = 0; col < width; ++col) {
                    this.cells.push({
                        row: row,
                        col: col,
                        cellType: mazeCellTypes.Wall
                    });
                }
            }
        }
    }

    static fromJSON(mazeJSON: any): Maze {
        let mazeObj: any = null;
        if (typeof (mazeJSON) === 'string') {
            mazeObj = JSON.parse(mazeJSON);
        } else {
            mazeObj = mazeJSON;
        }

        const cells: Array<Cell> = [];
        let cell: Cell;
        let row = 0;
        let col = 0;
        mazeObj.cells.forEach((cellType: string) => {
            cell = {
                row: row,
                col: col,
                cellType: mazeCellTypes[cellType]
            }

            cells.push(cell);

            col += 1;
            if (col >= mazeObj.width) {
                row += 1;
                col = 0;
            }
        });

        return new Maze(
            mazeObj.width,
            mazeObj.height,
            cells,
            mazeObj.cellDimensions.width,
            mazeObj.cellDimensions.height);
    }

    toJSON(): string {
        const jsonCells: Array<string> = [];
        this.cells.forEach((cell: Cell) => {
            jsonCells.push(cell.cellType.type);
        });

        let mazeObj = {
            width: this.width,
            height: this.height,
            cellDimensions: this.cellDimensions,
            cells: jsonCells
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

    getCellType(row: number, col: number): CellType | null {
        const cellIdx = this.calcCellIndex(row, col);

        let cellType = null;
        if (cellIdx >= 0 && cellIdx < this.cells.length) {
            cellType = this.cells[cellIdx].cellType;
        }

        return cellType;
    }

    setCellType(row: number, col: number, cellType: CellTypes) {
        if (cellType === CellTypes.START) {
            this.setStartCell(row, col);
        } else if (cellType === CellTypes.END) {
            this.setEndCell(row, col);
        } else {
            const cellIdx = this.calcCellIndex(row, col);
            this.cells[cellIdx].cellType = mazeCellTypes[cellType];
        }
    }

    getStartCell(): Cell | null {
        let startCell = null;
        this.cells.some((cell, idx) => {
            if (cell.cellType.type === CellTypes.START) {
                const row = Math.floor(idx / this.width);
                const col = idx - (row * this.width);
                startCell = { row: row, col: col, cellType: mazeCellTypes.Start };
                return true;
            }

            return false;
        });

        return startCell;
    }

    setStartCell(row: number, col: number) {
        // First find and clear the exising start cell
        this.cells.some((cell, idx) => {
            if (cell.cellType.type === CellTypes.START) {
                this.cells[idx].cellType = mazeCellTypes[CellTypes.PATH];
                return true;
            }

            return false;
        });

        // Then set the start cell to the new cell
        const cellIdx = this.calcCellIndex(row, col);
        this.cells[cellIdx].cellType = mazeCellTypes[CellTypes.START];
    }

    getEndCell(): Cell | null {
        let endCell = null;
        this.cells.some((cell, idx) => {
            if (cell.cellType.type === CellTypes.END) {
                const row = Math.floor(idx / this.width);
                const col = idx - (row * this.width);
                endCell = { row: row, col: col, cellType: mazeCellTypes.End };
                return true;
            }

            return false;
        });

        return endCell;
    }

    setEndCell(row: number, col: number) {
        // First find and clear the exising end cell
        this.cells.some((cell, idx) => {
            if (cell.cellType.type === CellTypes.END) {
                this.cells[idx].cellType = mazeCellTypes[CellTypes.PATH];
                return true;
            }

            return false;
        });

        // Then set the end cell to the new cell
        const cellIdx = this.calcCellIndex(row, col);
        this.cells[cellIdx].cellType = mazeCellTypes[CellTypes.END];
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
            const row = Math.floor(y / this.cellDimensions.height);
            const col = Math.floor(x / this.cellDimensions.width);
            cell = this.cells[this.calcCellIndex(row, col)];
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