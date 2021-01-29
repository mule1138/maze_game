import { GameState } from "../game_state";

export default abstract class Renderer {
    protected canvas: HTMLCanvasElement;
    protected lastFrameTime: number;

    constructor(canvasElement: HTMLCanvasElement) {
        this.canvas = canvasElement;
        this.lastFrameTime = new Date().valueOf();
    }

    public abstract render(gameState: GameState): void;

    protected calculateFPS(): number{
        const curTime = new Date().valueOf();
        const frameTime = (curTime - this.lastFrameTime) / 1000;
        const fps = Math.round(1 / frameTime);
        this.lastFrameTime = curTime;

        return fps;
    }
}