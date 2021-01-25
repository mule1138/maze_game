import * as MathLib from '../../src/libs/math_lib';
import { assert } from 'chai';
import 'mocha';

describe('degToRad', () => {
    it('should convert degrees to radians', () => {
        let rad = MathLib.degToRad(0);
        assert.equal(rad, 0);
        rad = MathLib.degToRad(90);
        assert.equal(rad, Math.PI / 2);
        rad = MathLib.degToRad(180);
        assert.equal(rad, Math.PI);
        rad = MathLib.degToRad(270);
        assert.equal(rad, 1.5 * Math.PI);
        rad = MathLib.degToRad(360);
        assert.equal(rad, Math.PI * 2);
    });
});

describe('radToDeg', () => {
    it('should convert radians to degrees', () => {
        let deg = MathLib.radToDeg(0);
        assert.equal(deg, 0);
        deg = MathLib.radToDeg(Math.PI / 2);
        assert.equal(deg, 90);
        deg = MathLib.radToDeg(Math.PI);
        assert.equal(deg, 180);
        deg = MathLib.radToDeg(1.5 * Math.PI);
        assert.equal(deg, 270);
        deg = MathLib.radToDeg(Math.PI * 2);
        assert.equal(deg, 360);
    });
});

describe('calcDistance', () => {
    it('should calculate the distance between two points', () => {
        const testDist = trimDecimalNumber(Math.sqrt(4 + 9), 4);
        const dist = trimDecimalNumber(MathLib.calcDistance(4, 4, 6, 7), 4);
        assert.equal(dist, testDist);
    });
});

describe('calcSlopeFromHeading', () => {
    it('should calculate slope of edge-case headings', () => {
        let slope = MathLib.calcSlopeFromHeading(0);
        assert.isNaN(slope);
        slope = MathLib.calcSlopeFromHeading(180);
        assert.isNaN(slope);
        slope = MathLib.calcSlopeFromHeading(90);
        assert.equal(slope, 0);
        slope = MathLib.calcSlopeFromHeading(270);
        assert.equal(slope, 0);
        slope = MathLib.calcSlopeFromHeading(45);
        assert.equal(slope, 1);
        slope = MathLib.calcSlopeFromHeading(225);
        assert.equal(slope, 1);
        slope = MathLib.calcSlopeFromHeading(135);
        assert.equal(slope, -1);
        slope = MathLib.calcSlopeFromHeading(315);
        assert.equal(slope, -1);
    });

    it('should calculate slope for non-edge-case headings', () => {
        let slope = trimDecimalNumber(MathLib.calcSlopeFromHeading(26.5650), 4);
        assert.equal(slope, 2.0);
        slope = trimDecimalNumber(MathLib.calcSlopeFromHeading(161.5650), 4);
        assert.equal(slope, -3.0);
        slope = trimDecimalNumber(MathLib.calcSlopeFromHeading(333.4349), 4);
        assert.equal(slope, -2.0);
        slope = trimDecimalNumber(MathLib.calcSlopeFromHeading(198.4349), 4);
        assert.equal(slope, 3.0);
    });
});

function trimDecimalNumber(rawValue: number, significantDigits: number): number {
    const modifier = 10 * significantDigits;
    let tmpVal = rawValue * modifier;
    tmpVal = Math.floor(tmpVal);
    return tmpVal / modifier;
}