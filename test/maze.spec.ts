import { Maze, Cell, BoundingBox, CellType, CellDimensions, MazeExtents } from "../src/maze";
import { assert } from 'chai';
import 'mocha';

describe('maze', () => {
    const testMazeObj = {
        width: 5,
        height: 5,
        cellDimensions: { "width": 32, "height": 32 },
        cells: ["start", "path", "path", "path", "path", "wall", "wall", "path", "path", "path", "wall", "wall", "path", "path", "path", "wall", "wall", "path", "path", "path", "wall", "wall", "wall", "wall", "end"]
    };

    describe('getCellType', () => {
        it('should get the type of the specified cell', () => {
            const testCellType: CellType = {
                type: 'path',
                value: 1,
                label: 'Path',
                class: 'mazePath',
                bgColor: 'white',
                isPath: true
            };

            const testMaze = Maze.fromJSON(testMazeObj);
            const cellType = testMaze.getCellType(1, 2);

            assert.deepEqual(cellType, testCellType);
        });

        it('should return null if row is less than 0', () => {
            const testMaze = Maze.fromJSON(testMazeObj);
            const cellType = testMaze.getCellType(-1, 0);

            assert.isNull(cellType);
        });

        it('should return null if row is more than the number of rows', () => {
            const testMaze = Maze.fromJSON(testMazeObj);
            const cellType = testMaze.getCellType(5, 2);

            assert.isNull(cellType);
        });
    });
});