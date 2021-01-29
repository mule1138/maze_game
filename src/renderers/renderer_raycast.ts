import Renderer from './renderer_base';
import * as MathLib from '../libs/math_lib';
import * as LineLib from '../libs/line_lib';
import { GameState } from '../game_state';

const HORIZONTAL_AOV = 60;
const VERTICAL_AOV = (HORIZONTAL_AOV / 4) * 3;
const GAME_WIDTH = 640;
const GAME_HEIGHT = (GAME_WIDTH / 4) * 3;
const PIXELS_PER_RAY = 1;
const EYE_LEVEL = 64;

const WALL_HEIGHT = 96;
const WALL_COLOR = {r: 0, g: 0, b: 0};

const FOG_COLOR = { r: 255, g: 255, b: 255 };
const FULL_FOG_DIST = 750;

export default class Renderer_Raycast extends Renderer {
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

    public render(gameState: GameState) {
        // Clear the canvas
        this.clearCanvas();

        // Save the current context state prior to drawing
        this.ctx.save();

        // Draw Background
        this.drawBackground();

        // Draw the raycast maze
        this.drawMaze(gameState);

        this.drawDebugText(gameState);

        // Restore the context state
        this.ctx.restore();
    }

    private clearCanvas(): void {
        // Wipe out everything in the entire canvas rect
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Clear out the path
        this.ctx.beginPath();
    }

    private drawBackground(): void {
        // Draw frame border
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = 'black';
        this.ctx.strokeRect(1, 1, GAME_WIDTH + 2, GAME_HEIGHT + 2);

        // Offset the context to fit within frame border
        this.ctx.translate(1, 1);

        // Draw background gradients
        const bgGradient = this.ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT + 1);
        bgGradient.addColorStop(0, 'deepskyblue');
        bgGradient.addColorStop(0.5, 'white');
        bgGradient.addColorStop(0.5, 'white');
        bgGradient.addColorStop(1.0, 'forestgreen');
        this.ctx.fillStyle = bgGradient;
        this.ctx.fillRect(1, 1, GAME_WIDTH, GAME_HEIGHT);
    }

    private drawMaze(gameState: GameState): void {
        const rayCount = Math.floor(GAME_WIDTH / PIXELS_PER_RAY);
        const rayOffset = PIXELS_PER_RAY / 2;
        const degPerPixel = VERTICAL_AOV / GAME_WIDTH;
        const uppConst = (Math.tan(MathLib.degToRad(VERTICAL_AOV / 2))) / (GAME_HEIGHT / 2);
        const cameraPos = {
            x: gameState.player.position.x,
            y: gameState.player.position.y,
            z: EYE_LEVEL,
            heading: gameState.player.heading,
        }

        let rayHeading, rayEndPt, rayLength, vertUnitsPerPixel, wallBottomPixel, wallTopPixel;
        let pixel = -PIXELS_PER_RAY;
        this.ctx.lineWidth = PIXELS_PER_RAY;
        for (let i = 0; i < rayCount; ++i) {
            pixel += PIXELS_PER_RAY;
            rayHeading = this.calculateRayHeading(pixel, cameraPos.heading);
            rayEndPt = LineLib.traverseLine(cameraPos.x, cameraPos.y, rayHeading, gameState.maze);
            rayLength = MathLib.calcDistance(cameraPos.x, cameraPos.y, rayEndPt.x, rayEndPt.y);
            vertUnitsPerPixel = uppConst * rayLength;
            wallBottomPixel = (GAME_HEIGHT / 2) + (EYE_LEVEL / vertUnitsPerPixel);
            wallTopPixel = wallBottomPixel - (WALL_HEIGHT / vertUnitsPerPixel);

            // Keep walls in the game window
            wallBottomPixel = wallBottomPixel > GAME_HEIGHT ? GAME_HEIGHT : wallBottomPixel;
            wallTopPixel = wallTopPixel < 0 ? 0 : wallTopPixel;

            // Draw the wall sliver for this column
            this.ctx.beginPath();
            this.ctx.strokeStyle = this.calculateWallColor(rayLength);
            this.ctx.moveTo(pixel, wallBottomPixel);
            this.ctx.lineTo(pixel, wallTopPixel);
            this.ctx.stroke();
        }
    }

    private drawDebugText(gameState: GameState): void {
        const fps = this.calculateFPS();

        const infoLines = [
            `fps: ${fps}`,
            'Player info:',
            `    pos: (${gameState.player.position.x.toFixed(4)}, ${gameState.player.position.y.toFixed(4)})`,
            `    heading: ${gameState.player.heading}`
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

    private calculateWallColor(distance: number): string {
        const fogFraction = distance / FULL_FOG_DIST;

        const newRed = WALL_COLOR.r + ((FOG_COLOR.r - WALL_COLOR.r) * fogFraction);
        const newGreen = WALL_COLOR.g + ((FOG_COLOR.g - WALL_COLOR.g) * fogFraction);
        const newBlue = WALL_COLOR.b + ((FOG_COLOR.b - WALL_COLOR.b) * fogFraction);

        return `rgb(${Math.floor(newRed)}, ${Math.floor(newGreen)}, ${Math.floor(newBlue)})`;
    }
}