import { BoundingBox } from "../common";

export function degToRad(degrees: number): number {
    return (Math.PI / 180) * degrees;
}

export function radToDeg(radians: number): number {
    return (180 / Math.PI) * radians;
}

export function calcDistance(x0: number, y0: number, x1: number, y1: number): number {
    return Math.hypot((x1 - x0), (y1 - y0));
}

export function calcSlopeFromHeading(heading: number): number {
    let slope = 0;
    switch (heading) {
        case 0:
        case 180:
            slope = NaN;
            break;
        case 90:
        case 270:
            slope = 0;
            break;
        case 315:
        case 225:
            slope = 1;
            break;
        case 45:
        case 135:
            slope = -1;
            break;
        default:
            const headingRad = degToRad(heading);
            slope = -(1 / Math.tan(headingRad));
            break;
    }

    return slope;
}

export function isPointInBoundingBox(x: number, y: number, boundingBox: BoundingBox): boolean {
    const xInt = Math.floor(x);
    const yInt = Math.floor(y);

    const isInBBox = !(xInt < boundingBox.left || xInt > boundingBox.right || yInt < boundingBox.top || yInt > boundingBox.bottom);
    return isInBBox;
}