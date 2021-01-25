import { Maze } from "../src/maze";
import { assert } from 'chai';
import 'mocha';

describe('maze', () => {
    const testMazeJSON = '{"width":"5","height":"5","cellDimensions":{"width":32,"height":32},"cells":["start","path","path","path","path","wall","wall","path","path","path","wall","wall","path","path","path","wall","wall","path","path","path","wall","wall","wall","wall","end"]}';

    const pathCellType = {
        type: 'path',
        value: 1,
        label: 'Path',
        class: 'mazePath',
        bgColor: 'white',
        isPath: true
    };

    const wallCellType = {
        type: 'wall',
        value: 0,
        label: 'Wall',
        class: 'mazeWall',
        bgColor: 'black',
        isPath: false
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
            testMaze.setCellType(1, 1, "path");

            cellType = testMaze.getCellType(1, 1);
            assert.deepEqual(cellType, pathCellType);
        });
    });

    describe('get and set StartCell', () => {
        it('should get the start cell', () => {
            const testMaze = Maze.fromJSON(testMazeJSON);

            const cell = testMaze.getStartCell();
            assert.deepEqual(cell, { row: 0, col: 0 });
        });

        it('should set the startCell', () => {
            const testMaze = Maze.fromJSON(testMazeJSON);

            testMaze.setStartCell(1, 4);
            let cell = testMaze.getStartCell();
            assert.deepEqual(cell, { row: 1, col: 4 });

            // Make sure the old start cell was cleared
            const cellType = testMaze.getCellType(0, 0);
            assert.deepEqual(cellType, pathCellType);
        });

        it('should return null when no startCell is set', () => {
            const testMaze = Maze.fromJSON(testMazeJSON);

            testMaze.setCellType(0, 0, 'path');
            const cell = testMaze.getStartCell();
            assert.isNull(cell);
        });
    });

    describe('get and set EndCell', () => {
        it('should get the end cell', () => {
            const testMaze = Maze.fromJSON(testMazeJSON);

            const cell = testMaze.getEndCell();
            assert.deepEqual(cell, { row: 4, col: 4 });
        });

        it('should set the end cell', () => {
            const testMaze = Maze.fromJSON(testMazeJSON);

            testMaze.setEndCell(1, 4);
            let cell = testMaze.getEndCell();
            assert.deepEqual(cell, { row: 1, col: 4 });

            // Make sure the old end cell was cleared
            const cellType = testMaze.getCellType(4, 4);
            assert.deepEqual(cellType, pathCellType);
        });

        it('should return null when no end cell is set', () => {
            const testMaze = Maze.fromJSON(testMazeJSON);

            testMaze.setCellType(4, 4, 'path');
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
            assert.deepEqual(cell, { row: 0, col: 0 });
        });

        it('should get the cell from an X, Y on cell edge', () => {
            let cell = testMaze.getCellFromXYUnits(0, 0);
            assert.deepEqual(cell, { row: 0, col: 0 });

            cell = testMaze.getCellFromXYUnits(31, 31);
            assert.deepEqual(cell, { row: 0, col: 0 });

            cell = testMaze.getCellFromXYUnits(32, 32);
            assert.deepEqual(cell, { row: 1, col: 1 });

            cell = testMaze.getCellFromXYUnits(159, 159);
            assert.deepEqual(cell, { row: 4, col: 4 });
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