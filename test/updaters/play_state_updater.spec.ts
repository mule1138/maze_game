import * as PlayStateUpdater from '../../src/updaters/play_state_updater';
import { GameState, PlayState } from '../../src/game_state';
import { Maze } from "../../src/maze";
import { assert } from 'chai';
import 'mocha';

describe.('play_state_updater', () => {
    const testMazeJSON = '{"width":"5","height":"5","cellDimensions":{"width":32,"height":32},"cells":["Start","Path","Path","Path","Path","Wall","Wall","Path","Path","Path","Wall","Wall","Path","Path","Path","Wall","Wall","Path","Path","Path","Wall","Wall","Wall","Wall","End"]}';
    const testMaze = Maze.fromJSON(testMazeJSON);

    describe('updatePlayState', () => {
        it('should update the play state from START to PLAYING', () => {
            const gameState = new GameState(testMaze);

            // Move out of the start cell
            gameState.player.position.x = 35;
            gameState.player.position.y = 15;

            PlayStateUpdater.updatePlayState(gameState);
            assert.equal(gameState.playState, PlayState.PLAYING);
        });

        it('should update the play state to DONE', () => {
            const gameState = new GameState(testMaze);

            // Move out of the start cell to switch state to PLAYING
            gameState.player.position.x = 35;
            gameState.player.position.y = 15;
            PlayStateUpdater.updatePlayState(gameState);

            // Move player to the end cell
            gameState.player.position.x = 130;
            gameState.player.position.y = 130;

            PlayStateUpdater.updatePlayState(gameState);
            assert.equal(gameState.playState, PlayState.DONE);
        });
    });
});