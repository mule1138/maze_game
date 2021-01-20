import { Maze, Cell, BoundingBox, CellType, CellDimensions, MazeExtents } from "../src/maze";
import { assert } from 'chai';
import 'mocha';

describe('maze', () => {
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


        });
    });
});