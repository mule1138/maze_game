import * as MathLib from './math_lib';
import { Maze } from '../maze';
import { BoundingBox, Point } from '../common';

export function traverseLine(x0: number, y0: number, heading: number, maze: Maze, maxDist?: number): Point {
    let x = x0;
    let y = y0;
    let nextY = y;
    let nextX = x;
    let curLength = 0;
    let nextLength = curLength;
    let keepGoing = true;
    const headingRad = MathLib.degToRad(heading);
    const dx = Math.sin(headingRad);
    const dy = -(Math.cos(headingRad));

    // Get the current cell and cell bounding box
    let curCell = maze.getCellFromXYUnits(x0, y0);
    if (!curCell || !curCell.cellType.isPath) {
        // Not starting in a valid cell.
        return { x: x, y: y };
    }
    let curCellBBox = maze.getCellBoundingBox(curCell.row, curCell.col) as BoundingBox;

    while (keepGoing) {
        // Move one unit length along the line
        nextLength += 1;
        nextX = x + dx;
        nextY = y + dy;

        if (maxDist && nextLength > maxDist) {
            // We've reached the maximum distance;
            keepGoing = false;
        } else if (!MathLib.isPointInBoundingBox(nextX, nextY, curCellBBox)) {
            // New point is not in current cell. Get the next cell
            curCell = maze.getCellFromXYUnits(nextX, nextY);
            if (!curCell || !curCell.cellType.isPath) {
                // If the next cell is not a path, or is beyond the maze, quit.
                keepGoing = false;
            } else {
                curCellBBox = maze.getCellBoundingBox(curCell.row, curCell.col) as BoundingBox;
            }
        }

        if (keepGoing) {
            x = nextX;
            y = nextY;
            curLength = nextLength;
        }
    }

    const endpoint = { x: x, y: y };
    return endpoint;
}
