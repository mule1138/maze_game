import * as MathLib from './math_lib';
import { Maze } from '../maze';
import { Point } from '../common';

export function traverseLine(x0: number, y0: number, heading: number, maze: Maze, maxDist?: number): Point {
    let intersection = { x: x0, y: y0 };
    if (heading < 45 || heading > 315 || (heading > 135 && heading < 225)) {
        intersection = traverseSteepLine(x0, y0, heading, maze, maxDist);
    } else {
        intersection = traverseShallowLine(x0, y0, heading, maze, maxDist);
    }

    return intersection;
}

function traverseSteepLine(x0: number, y0: number, heading: number, maze: Maze, maxDist?: number): Point {
    let x = x0;
    let y = y0;
    let nextY = y;
    let nextX = x;
    let dx = 0;
    let keepGoing = true;
    const headingRad = MathLib.degToRad(heading);
    let yExtent;

    // Direction of incrementing (up is neg, down is pos)
    const yDir = (heading < 90 || heading > 270) ? -1 : 1;

    // If there is a maxDist provided, find out where we should stop calculating
    if (maxDist) {
        yExtent = y - (maxDist * Math.cos(headingRad));
    }

    // Calculate the x increment for each integer y step
    let invSlope = Math.abs(1 / MathLib.calcSlopeFromHeading(heading));
    if (isNaN(invSlope)) {
        invSlope = 0;
    }
    // const xFraction = (heading < 180) ? invSlope : -invSlope;
    const xFraction = (heading < 180) ? invSlope : -invSlope;

    // Iterate until we reach the end of the line, a wall, or the edge of the maze
    while (keepGoing) {
        nextY = y + yDir;
        dx += xFraction;
        nextX = x0 + dx;

        if (yExtent && ((yDir === 1 && nextY > yExtent) || (yDir === -1 && nextY < yExtent))) {
            // We've reached the max distance
            y = yExtent;
            x = Math.abs(yExtent - y0) * xFraction + x0;
            keepGoing = false;
        } else {
            keepGoing = testNewCoordinates(nextX, nextY, maze);
            if (keepGoing) {
                x = nextX;
                y = nextY;
            } else {
                // Calculate the exact intersection point
                y = (yDir > 0) ? Math.floor(nextY) : Math.floor(y);
                x = Math.abs(y - y0) * xFraction + x0;
            }
        }
    }

    const endpoint = { x: x, y: y };
    return endpoint;
}

function traverseShallowLine(x0: number, y0: number, heading: number, maze: Maze, maxDist?: number): Point {
    let x = x0;
    let y = y0;
    let nextY = y;
    let nextX = x;
    let dy = 0;
    let keepGoing = true;
    const headingRad = MathLib.degToRad(heading);
    let xExtent;

    const xDir = (heading < 180) ? 1 : -1;
    if (maxDist) {
        xExtent = x + maxDist * Math.sin(headingRad);
    }

    const slope = Math.abs(MathLib.calcSlopeFromHeading(heading));
    const yFraction = (heading > 90 && heading < 270) ? slope : -slope;

    while (keepGoing) {
        nextX = x + xDir;
        dy += yFraction;
        nextY = y0 + dy;

        if (xExtent && ((xDir === 1 && nextX > xExtent) || (xDir === -1 && nextX < xExtent))) {
            // We've reached the max distance
            x = xExtent;
            y = Math.abs(xExtent - x0) * yFraction + y0;
            keepGoing = false;
        } else {
            keepGoing = testNewCoordinates(nextX, nextY, maze);
            if (keepGoing) {
                x = nextX;
                y = nextY;
            } else {
                // Calculate the exact intersection point
                x = (xDir > 0) ? Math.floor(nextX) : Math.floor(x);
                y = Math.abs(x - x0) * yFraction + y0;
            }
        }
    }

    const endpoint = { x: x, y: y };
    return endpoint;
}

function testNewCoordinates(nextX: number, nextY: number, maze: Maze): boolean {
    const newCell = maze.getCellFromXYUnits(nextX, nextY);
    let keepGoing = true;
    if (newCell) {
        if (newCell.cellType.isPath === false) {
            keepGoing = false;
        }
    } else {
        // We've gone past the maze extents
        keepGoing = false;
    }

    return keepGoing;
}
