import * as LineLib from '../../src/libs/line_lib';
import { Maze } from '../../src/maze';
import { assert } from 'chai';
import 'mocha';

describe.only('line_lib', () => {
    const testMazeJSON = '{"width":"5","height":"5","cellDimensions":{"width":32,"height":32},"cells":["start","path","path","path","path","wall","wall","path","path","path","wall","wall","path","path","path","wall","wall","path","path","path","wall","wall","wall","wall","end"]}';
    const testMaze = Maze.fromJSON(testMazeJSON);

    describe('traverseLine', () => {
        it('should traverse a steep, first quadrant line', () => {
            const testIntersection = { x: 114.1130, y: 0.0 };
            const intersection = LineLib.traverseLine(70.0, 63.0, 35, testMaze);
            intersection.x = trimDecimalNumber(intersection.x, 4);
            intersection.y = trimDecimalNumber(intersection.y, 4);
            assert.deepEqual(intersection, testIntersection);
        });

        it('should traverse a steep line in first quadrant with a given length', () => {
            const testEndPt = { x: 73.2139, y: 59.1697 };
            const endPt = LineLib.traverseLine(70.0, 63.0, 40, testMaze, 5);
            endPt.x = trimDecimalNumber(endPt.x, 4);
            endPt.y = trimDecimalNumber(endPt.y, 4);
            assert.deepEqual(endPt, testEndPt);
        });

        it('should traverse a shallow, first quadrant line', () => {
            const testIntersection = { x: 160.0, y: 30.2426 };
            const intersection = LineLib.traverseLine(70.0, 63.0, 70, testMaze);
            intersection.x = trimDecimalNumber(intersection.x, 4);
            intersection.y = trimDecimalNumber(intersection.y, 4);
            assert.deepEqual(intersection, testIntersection);
        });

        it('should traverse a shallow line in first quadrant with a given length', () => {
            const testEndPt = { x: 74.6984, y: 61.2898 };
            const endPt = LineLib.traverseLine(70.0, 63.0, 70, testMaze, 5);
            endPt.x = trimDecimalNumber(endPt.x, 4);
            endPt.y = trimDecimalNumber(endPt.y, 4);
            assert.deepEqual(endPt, testEndPt);
        });

        it('should traverse a steep, second quadrant line', () => {
            const testIntersection = { x: 160.4151, y: 138.0 };
            const intersection = LineLib.traverseLine(100.0, 66.0, 140, testMaze);
            intersection.x = trimDecimalNumber(intersection.x, 4);
            intersection.y = trimDecimalNumber(intersection.y, 4);
            assert.deepEqual(intersection, testIntersection);
        });

        it('should traverse a steep line in second quadrant with a given length', () => {
            const testEndPt = { x: 73.2139, y: 66.8302 };
            const endPt = LineLib.traverseLine(70.0, 63.0, 140, testMaze, 5);
            endPt.x = trimDecimalNumber(endPt.x, 4);
            endPt.y = trimDecimalNumber(endPt.y, 4);
            assert.deepEqual(endPt, testEndPt);
        });

        it('should traverse a shallow, second quadrant line', () => {
            const testIntersection = { x: 160.0, y: 87.8382 };
            const intersection = LineLib.traverseLine(100.0, 66.0, 110, testMaze);
            intersection.x = trimDecimalNumber(intersection.x, 4);
            intersection.y = trimDecimalNumber(intersection.y, 4);
            assert.deepEqual(intersection, testIntersection);
        });

        it('should traverse a shallow line in second quadrant with a given length', () => {
            const testEndPt = { x: 74.6984, y: 64.7101 };
            const endPt = LineLib.traverseLine(70.0, 63.0, 110, testMaze, 5);
            endPt.x = trimDecimalNumber(endPt.x, 4);
            endPt.y = trimDecimalNumber(endPt.y, 4);
            assert.deepEqual(endPt, testEndPt);
        });

        it('should traverse a steep, third quadrant line', () => {
            const testIntersection = { x: 63.9187, y: 109.0 };
            const intersection = LineLib.traverseLine(100.0, 66.0, 220, testMaze);
            intersection.x = trimDecimalNumber(intersection.x, 4);
            intersection.y = trimDecimalNumber(intersection.y, 4);
            assert.deepEqual(intersection, testIntersection);
        });

        it('should traverse a steep line in third quadrant with a given length', () => {
            const testEndPt = { x: 66.7860, y: 66.8302 };
            const endPt = LineLib.traverseLine(70.0, 63.0, 220, testMaze, 5);
            endPt.x = trimDecimalNumber(endPt.x, 4);
            endPt.y = trimDecimalNumber(endPt.y, 4);
            assert.deepEqual(endPt, testEndPt);
        });

        it('should traverse a shallow, third quadrant line', () => {
            const testIntersection = { x: 64.0, y: 79.1029 };
            const intersection = LineLib.traverseLine(100.0, 66.0, 250, testMaze);
            intersection.x = trimDecimalNumber(intersection.x, 4);
            intersection.y = trimDecimalNumber(intersection.y, 4);
            assert.deepEqual(intersection, testIntersection);
        });

        it('should traverse a shallow line in third quadrant with a given length', () => {
            const testEndPt = { x: 65.3015, y: 64.7101 };
            const endPt = LineLib.traverseLine(70.0, 63.0, 250, testMaze, 5);
            endPt.x = trimDecimalNumber(endPt.x, 4);
            endPt.y = trimDecimalNumber(endPt.y, 4);
            assert.deepEqual(endPt, testEndPt);
        });

        it('should traverse a steep, fourth quadrant line', () => {
            const testIntersection = { x: 44.6194, y: 0.0 };
            const intersection = LineLib.traverseLine(100.0, 66.0, 320, testMaze);
            intersection.x = trimDecimalNumber(intersection.x, 4);
            intersection.y = trimDecimalNumber(intersection.y, 4);
            assert.deepEqual(intersection, testIntersection);
        });

        it('should traverse a steep line in fourth quadrant with a given length', () => {
            const testEndPt = { x: 66.7860, y: 59.1697 };
            const endPt = LineLib.traverseLine(70.0, 63.0, 320, testMaze, 5);
            endPt.x = trimDecimalNumber(endPt.x, 4);
            endPt.y = trimDecimalNumber(endPt.y, 4);
            assert.deepEqual(endPt, testEndPt);
        });

        it('should traverse a shallow, third quadrant line', () => {
            const testIntersection = { x: 64.0, y: 52.8970 };
            const intersection = LineLib.traverseLine(100.0, 66.0, 290, testMaze);
            intersection.x = trimDecimalNumber(intersection.x, 4);
            intersection.y = trimDecimalNumber(intersection.y, 4);
            assert.deepEqual(intersection, testIntersection);
        });

        it('should traverse a shallow line in fourth quadrant with a given length', () => {
            const testEndPt = { x: 65.3015, y: 61.2898 };
            const endPt = LineLib.traverseLine(70.0, 63.0, 290, testMaze, 5);
            endPt.x = trimDecimalNumber(endPt.x, 4);
            endPt.y = trimDecimalNumber(endPt.y, 4);
            assert.deepEqual(endPt, testEndPt);
        });
    });
});

function trimDecimalNumber(rawValue: number, significantDigits: number): number {
    const modifier = Math.pow(10, significantDigits);
    let tmpVal = rawValue * modifier;
    tmpVal = Math.floor(tmpVal);
    return tmpVal / modifier;
}