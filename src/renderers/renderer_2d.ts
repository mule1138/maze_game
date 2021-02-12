import { GameState } from "../game_state";
import * as MathLib from '../libs/math_lib';
import * as LineLib from '../libs/line_lib';
import Renderer from './renderer_base';

const HORIZONTAL_AOV = 60;
const GAME_WIDTH = 640;
const PIXELS_PER_RAY = 1;

const playerSprite = {
    sizeScale: {
        height: 1.0,
        width: 1.0
    },
    color: 'royalblue'
}

export default class Renderer2d extends Renderer {
    private ctx: CanvasRenderingContext2D;

    public constructor(canvasElement: HTMLCanvasElement) {
        super(canvasElement);
        const tempCtx = this.canvas.getContext('2d');
        if (tempCtx) {
            this.ctx = tempCtx
        } else {
            throw Error('2D rendering context could not be created');
        }
    }

    public render(gameState: GameState): void {
        // Clear the canvas
        this.clearCanvas();

        // Save the current context state prior to drawing
        this.ctx.save();

        // Draw Background
        this.drawBackground();

        // Draw the maze
        this.drawMaze(gameState);

        // Draw the player
        this.drawPlayer(gameState);

        this.drawRayFan(gameState);

        this.drawDebugText(gameState);

        // Restore the context state
        this.ctx.restore();
    }

    private clearCanvas(): void {
        // Wipe out everything in the entire canvas rect
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private drawBackground(): void {
        const canvasCenter = {
            x: Math.floor(this.canvas.clientWidth / 2),
            y: Math.floor(this.canvas.clientHeight / 2)
        }

        const r1 = Math.max(canvasCenter.x, canvasCenter.y)
        const r0 = 0.1 * r1;
        const bgRadialGradient = this.ctx.createRadialGradient(
            canvasCenter.x, canvasCenter.y, r0,
            canvasCenter.x, canvasCenter.y, r1);
        bgRadialGradient.addColorStop(0.0, 'royalblue');
        bgRadialGradient.addColorStop(1.0, 'lightblue');
        this.ctx.fillStyle = bgRadialGradient;
        this.ctx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
    }

    private drawMaze(gameState: GameState): void {
        // Draw a 2px border around the maze
        const cellDims = gameState.maze.getCellDimensions();
        const mazeWidthInUnits = cellDims.width * gameState.maze.width;
        const mazeHeightInUnits = cellDims.height * gameState.maze.height;
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, mazeWidthInUnits + 8, mazeHeightInUnits + 8);
        this.ctx.fillStyle = 'gray';
        this.ctx.fillRect(2, 2, mazeWidthInUnits + 4, mazeHeightInUnits + 4);
        // Offset the context so the maze and all contents draws within the border
        this.ctx.translate(4, 4);

        // Initialze loop variables
        let cellType = null;
        let row = 0
        let col = 0;
        let bbox = {
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
        };

        // Loop through all of the maze cells and draw them
        for (row = 0; row < gameState.maze.height; ++row) {
            bbox.top = row * cellDims.height;
            bbox.bottom = bbox.top + cellDims.height;

            for (col = 0; col < gameState.maze.width; ++col) {
                cellType = gameState.maze.getCellType(row, col);
                if (cellType) {
                    bbox.left = col * cellDims.width;
                    bbox.right = bbox.left + cellDims.width;
                    this.ctx.fillStyle = cellType.bgColor;
                    this.ctx.fillRect(bbox.left, bbox.top, bbox.right - bbox.left, bbox.bottom - bbox.top);
                }
            }
        }
    }

    private drawPlayer(gameState: GameState): void {
        const centerPt = gameState.player.position;
        const playerSize = { width: 0, height: 0 };
        playerSize.width = playerSprite.sizeScale.width * gameState.player.size.width;
        playerSize.height = playerSprite.sizeScale.width * gameState.player.size.width;

        this.ctx.save();

        // Rotate the context around the center of the player sprite
        this.ctx.translate(centerPt.x, centerPt.y);
        this.ctx.rotate(MathLib.degToRad(gameState.player.heading));
        this.ctx.translate(-centerPt.x, -centerPt.y);

        // Create the sprite path
        this.ctx.beginPath();
        this.ctx.moveTo(centerPt.x, centerPt.y - (playerSize.width / 2));
        this.ctx.arc(centerPt.x, centerPt.y, playerSize.width / 2, MathLib.degToRad(10), MathLib.degToRad(170), false);
        this.ctx.closePath();

        // Fill it and outline it
        this.ctx.fillStyle = playerSprite.color;
        this.ctx.fill();
        this.ctx.strokeStyle = 'black';
        this.ctx.stroke();

        this.ctx.restore();
    }

    private drawRay(gameState: GameState): void {
        const startPt = gameState.player.position;
        const endPt = LineLib.traverseLine(startPt.x, startPt.y, gameState.player.heading, gameState.maze);

        this.ctx.save();

        this.ctx.beginPath();
        this.ctx.moveTo(startPt.x, startPt.y);
        this.ctx.lineTo(endPt.x, endPt.y);
        this.ctx.strokeStyle = 'lightblue';
        this.ctx.stroke();

        this.ctx.restore();
    }

    private drawRayFan(gameState: GameState): void {
        const startPt = gameState.player.position;
        const rayCount = Math.floor(GAME_WIDTH / PIXELS_PER_RAY);

        this.ctx.save();

        let pixel = -PIXELS_PER_RAY;
        let rayHeading, rayEndPt;
        for (let i = 0; i < rayCount; ++i) {
            pixel += PIXELS_PER_RAY;
            rayHeading = this.calculateRayHeading(pixel, gameState.player.heading);
            rayEndPt = LineLib.traverseLine(startPt.x, startPt.y, rayHeading, gameState.maze);

            this.ctx.beginPath();
            this.ctx.moveTo(startPt.x, startPt.y);
            this.ctx.lineTo(rayEndPt.x, rayEndPt.y);
            this.ctx.strokeStyle = 'lightblue';
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    private drawDebugText(gameState: GameState): void {
        const fps = this.calculateFPS();

        let isSteep = false;
        const heading = gameState.player.heading;
        if (heading < 45 || heading > 315 || (heading > 135 && heading < 225)) {
            isSteep = true;
        }

        const rayEndPt = LineLib.traverseLine(gameState.player.position.x, gameState.player.position.y, gameState.player.heading, gameState.maze);

        const infoLines = [
            `fps: ${fps}`,
            'Player info:',
            `    pos: (${gameState.player.position.x.toFixed(4)}, ${gameState.player.position.y.toFixed(4)})`,
            `    heading: ${gameState.player.heading}`,
            `is steep: ${isSteep}`,
            `ray end: (${rayEndPt.x.toFixed(4)}, ${rayEndPt.y.toFixed(4)})`
        ];

        this.ctx.save();

        let txtPos;
        infoLines.forEach((line, i) => {
            txtPos = { x: this.canvas.clientWidth - 200, y: 15 * (i + 1) };

            this.ctx.fillStyle = 'red';
            this.ctx.font = '15px serif';
            this.ctx.fillText(line, txtPos.x, txtPos.y);
        });

        this.ctx.restore();
    }

    private calculateRayHeading(pixel: number, cameraHeading: number): number {
        const midAOV = HORIZONTAL_AOV / 2;
        const minRayAngle = cameraHeading - midAOV;

        const rayAngleInFOV = HORIZONTAL_AOV * (pixel / GAME_WIDTH);
        let rayHeading = minRayAngle + rayAngleInFOV;

        if (rayHeading < 0) {
            rayHeading += 360;
        } else if (rayHeading >= 360) {
            rayHeading -= 360;
        }

        return rayHeading;
    }
};



