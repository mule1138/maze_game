import * as LineLib from '../../src/libs/line_lib';
import { Maze } from '../../src/maze';
import { assert } from 'chai';
import 'mocha';

describe('line_lib', () => {
    const testMazeJSON = '{"width":"5","height":"5","cellDimensions":{"width":32,"height":32},"cells":["Start","Path","Path","Path","Path","Wall","Wall","Path","Path","Path","Wall","Wall","Path","Path","Path","Wall","Wall","Path","Path","Path","Wall","Wall","Wall","Wall","End"]}';
    const testMaze = Maze.fromJSON(testMazeJSON);

    describe('traverseLine', () => {
        it('should traverse a steep, first quadrant line', () => {
            const testIntersection = { x: 113.5918, y: 0.7444 };
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
            const testIntersection = { x: 159.2707, y: 30.508 };
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
            const testIntersection = { x: 159.7792, y: 137.2421 };
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
            const testIntersection = { x: 159.2006, y: 87.5472 };
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
            const testIntersection = { x: 64.0038, y: 108.8984 };
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
            const testIntersection = { x: 64.2916, y: 78.9967 };
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
            const testIntersection = { x: 44.7202, y: 0.1201 };
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
            const testIntersection = { x: 64.2916, y: 53.0032 };
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