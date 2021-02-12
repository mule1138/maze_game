import { Maze, CellTypes } from "../src/maze";
import { assert } from 'chai';
import 'mocha';

describe('maze', () => {
    const testMazeJSON = '{"width":"5","height":"5","cellDimensions":{"width":32,"height":32},"cells":["Start","Path","Path","Path","Path","Wall","Wall","Path","Path","Path","Wall","Wall","Path","Path","Path","Wall","Wall","Path","Path","Path","Wall","Wall","Wall","Wall","End"]}';

    const pathCellType = {
        type: CellTypes.PATH,
        value: 1,
        class: 'mazePath',
        bgColor: 'white',
        isPath: true
    };

    const wallCellType = {
        type: CellTypes.WALL,
        value: 0,
        class: 'mazeWall',
        bgColor: 'black',
        isPath: false
    };

    const startCellType = {
        type: CellTypes.START,
        value: 2,
        class: 'mazeStart',
        bgColor: 'lightgreen',
        isPath: true
    };

    const endCellType = {
        type: CellTypes.END,
        value: 3,
        class: 'mazeEnd',
        bgColor: 'red',
        isPath: true
    };

    describe('getCellType', () => {
        it('should get the type of the specified cell', () => {
            const testMaze = Maze.fromJSON(testMazeJSON);
            const cellType = testMaze.getCellType(1, 2);

            assert.deepEqual(cellType, pathCellType);
        });

        it('should return null if row is less than 0', () => {
            const testMaze = Maze.fromJSON(testMazeJSON);
            const cellType = testMaze.getCellType(-1, 0);

            assert.isNull(cellType);
        });

        it('should return null if row is more than the number of rows', () => {
            const testMaze = Maze.fromJSON(testMazeJSON);
            const cellType = testMaze.getCellType(5, 2);

            assert.isNull(cellType);
        });
    });

    describe('setCellType', () => {
        it('should set a new type for a cell', () => {
            const testMaze = Maze.fromJSON(testMazeJSON);
            let cellType = testMaze.getCellType(1, 1);
            assert.deepEqual(cellType, wallCellType);
            testMaze.setCellType(1, 1, CellTypes.PATH);

            cellType = testMaze.getCellType(1, 1);
            assert.deepEqual(cellType, pathCellType);
        });
    });

    describe('get and set StartCell', () => {
        it('should get the start cell', () => {
            const testMaze = Maze.fromJSON(testMazeJSON);

            const cell = testMaze.getStartCell();
            assert.deepEqual(cell, { row: 0, col: 0, cellType: startCellType });
        });

        it('should set the startCell', () => {
            const testMaze = Maze.fromJSON(testMazeJSON);

            testMaze.setStartCell(1, 4);
            let cell = testMaze.getStartCell();
            assert.deepEqual(cell, { row: 1, col: 4, cellType: startCellType });

            // Make sure the old start cell was cleared
            const cellType = testMaze.getCellType(0, 0);
            assert.deepEqual(cellType, pathCellType);
        });

        it('should return null when no startCell is set', () => {
            const testMaze = Maze.fromJSON(testMazeJSON);

            testMaze.setCellType(0, 0, CellTypes.PATH);
            const cell = testMaze.getStartCell();
            assert.isNull(cell);
        });
    });

    describe('get and set EndCell', () => {
        it('should get the end cell', () => {
            const testMaze = Maze.fromJSON(testMazeJSON);

            const cell = testMaze.getEndCell();
            assert.deepEqual(cell, { row: 4, col: 4, cellType: endCellType });
        });

        it('should set the end cell', () => {
            const testMaze = Maze.fromJSON(testMazeJSON);

            testMaze.setEndCell(1, 4);
            let cell = testMaze.getEndCell();
            assert.deepEqual(cell, { row: 1, col: 4, cellType: endCellType });

            // Make sure the old end cell was cleared
            const cellType = testMaze.getCellType(4, 4);
            assert.deepEqual(cellType, pathCellType);
        });

        it('should return null when no end cell is set', () => {
            const testMaze = Maze.fromJSON(testMazeJSON);

            testMaze.setCellType(4, 4, CellTypes.PATH);
            const cell = testMaze.getEndCell();
            assert.isNull(cell);
        });
    });

    describe('getCellBoundingBox', () => {
        const testMaze = Maze.fromJSON(testMazeJSON);

        it('should get the bounding box for the first cell.', () => {
            const testBBox = {
                left: 0,
                top: 0,
                right: 31,
                bottom: 31
            };

            const bbox = testMaze.getCellBoundingBox(0, 0);
            assert.deepEqual(bbox, testBBox);
        });

        it('should get the bounding box for the last cell.', () => {
            const testBBox = {
                left: 128,
                top: 128,
                right: 159,
                bottom: 159
            };

            const bbox = testMaze.getCellBoundingBox(4, 4);
            assert.deepEqual(bbox, testBBox);
        });

        it('should get the bounding box for a middle cell.', () => {
            const testBBox = {
                left: 64,
                top: 64,
                right: 95,
                bottom: 95
            };

            const bbox = testMaze.getCellBoundingBox(2, 2);
            assert.deepEqual(bbox, testBBox);
        });

        it('should get null for out-of-bounds cell.', () => {
            let bbox = testMaze.getCellBoundingBox(-1, -1);
            assert.isNull(bbox);

            bbox = testMaze.getCellBoundingBox(-1, 4);
            assert.isNull(bbox);

            bbox = testMaze.getCellBoundingBox(4, -1);
            assert.isNull(bbox);

            bbox = testMaze.getCellBoundingBox(5, 5);
            assert.isNull(bbox);

            bbox = testMaze.getCellBoundingBox(5, 2);
            assert.isNull(bbox);

            bbox = testMaze.getCellBoundingBox(3, 5);
            assert.isNull(bbox);
        });
    });

    describe('getCellFromXYUnits', () => {
        const testMaze = Maze.fromJSON(testMazeJSON);

        it('should get the cell from an X, Y coordinate', () => {
            const cell = testMaze.getCellFromXYUnits(2, 2);
            assert.deepEqual(cell, { row: 0, col: 0, cellType: startCellType });
        });

        it('should get the cell from an X, Y on cell edge', () => {
            let cell = testMaze.getCellFromXYUnits(0, 0);
            assert.deepEqual(cell, { row: 0, col: 0, cellType: startCellType });

            cell = testMaze.getCellFromXYUnits(31, 31);
            assert.deepEqual(cell, { row: 0, col: 0, cellType: startCellType });

            cell = testMaze.getCellFromXYUnits(32, 32);
            assert.deepEqual(cell, { row: 1, col: 1, cellType: wallCellType });

            cell = testMaze.getCellFromXYUnits(159, 159);
            assert.deepEqual(cell, { row: 4, col: 4, cellType: endCellType });
        });

        it('should return null when cell is out-of-bounds', () => {
            let cell = testMaze.getCellFromXYUnits(-1, 0);
            assert.isNull(cell);

            cell = testMaze.getCellFromXYUnits(0, -1);
            assert.isNull(cell);

            cell = testMaze.getCellFromXYUnits(0, 160);
            assert.isNull(cell);

            cell = testMaze.getCellFromXYUnits(160, 0);
            assert.isNull(cell);
        });
    });
});