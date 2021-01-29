import { Maze } from './maze';
import { Point, Size } from './common';

export enum PlayState {
    START = 'start',
    PLAYING = 'playing',
    DONE = 'done'
};

export interface ButtonsState {
    up: boolean,
    down: boolean,
    left: boolean,
    right: boolean
};

export interface PlayerState {
    position: Point,
    heading: number,
    size: Size;
};

export class GameState {
    buttons: ButtonsState;
    player: PlayerState;
    maze: Maze;
    startTime: Date | null;
    elapsedTime: number;
    playState: PlayState;
    gameLoopInterval: number;

    constructor (maze: Maze) {
        this.buttons = {
            up: false,
            down: false,
            left: false,
            right: false
        };

        this.player = {
            position: { x: 0, y: 0 },
            heading: 0,
            size: { width: 1, height: 1 }
        }

        this.maze = maze;
        this.startTime = null;
        this.elapsedTime = 0;
        this.playState = PlayState.START;
        this.gameLoopInterval = -1;
    }
};