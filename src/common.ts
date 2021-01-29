export interface Point {
    x: number,
    y: number,
    z?: number
}

export interface Size {
    width: number,
    height: number
}

export interface BoundingBox {
    top: number,
    left: number,
    bottom: number,
    right: number
}