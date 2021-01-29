import * as TimerUpdater from '../../src/updaters/timer_updater';
import { GameState, PlayState } from '../../src/game_state';
import { Maze } from "../../src/maze";
import { assert } from 'chai';
import 'mocha';

describe('timer_updater', () => {
    const testMazeJSON = '{"width":"5","height":"5","cellDimensions":{"width":32,"height":32},"cells":["Start","Path","Path","Path","Path","Wall","Wall","Path","Path","Path","Wall","Wall","Path","Path","Path","Wall","Wall","Path","Path","Path","Wall","Wall","Wall","Wall","End"]}';
    const testMaze = Maze.fromJSON(testMazeJSON);

    describe('updateTimer', () => {
        it('should set the start time when moving from START to PLAYING state', () => {
            const gameState = new GameState(testMaze);
            assert.isNull(gameState.startTime);
            assert.equal(gameState.elapsedTime, 0);

            gameState.playState = PlayState.PLAYING;
            TimerUpdater.updateTimer(gameState);
            assert.isNotNull(gameState.startTime);
        });

        it('shoujld calculate the elapsed time', () => {
            // Create a start time that is 500ms in the past
            const testStartTime = new Date(new Date().valueOf() - 500);

            const gameState = new GameState(testMaze);
            gameState.playState = PlayState.PLAYING;
            gameState.startTime = testStartTime;

            assert.equal(gameState.elapsedTime, 0);
            TimerUpdater.updateTimer(gameState);
            assert.isTrue(gameState.elapsedTime > 0);
        });
    });
});