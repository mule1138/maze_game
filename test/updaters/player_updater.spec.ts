import * as PlayerUpdater from '../../src/updaters/player_updater';
import { GameState } from '../../src/game_state';
import { Maze } from "../../src/maze";
import { assert } from 'chai';
import 'mocha';

describe('player_updater', () => {
    const testMazeJSON = '{"width":"5","height":"5","cellDimensions":{"width":32,"height":32},"cells":["Start","Path","Path","Path","Path","Wall","Wall","Path","Path","Path","Wall","Wall","Path","Path","Path","Wall","Wall","Path","Path","Path","Wall","Wall","Wall","Wall","End"]}';
    const testMaze = Maze.fromJSON(testMazeJSON);

    describe('updatePlayer', () => {
        it('should update the heading clockwise', () => {
            const gameState = new GameState(testMaze);
            gameState.buttons.right = true;
            gameState.player.heading = 30;

            PlayerUpdater.updatePlayer(gameState);
            assert.equal(gameState.player.heading, 35);
        });

        it('should update the heading clockwise across 360deg', () => {
            const gameState = new GameState(testMaze);
            gameState.buttons.right = true;
            gameState.player.heading = 358;

            PlayerUpdater.updatePlayer(gameState);
            assert.equal(gameState.player.heading, 3);
        });

        it('should update the heading counter-clockwise', () => {
            const gameState = new GameState(testMaze);
            gameState.buttons.left = true;
            gameState.player.heading = 30;

            PlayerUpdater.updatePlayer(gameState);
            assert.equal(gameState.player.heading, 25);
        });

        it('should update the heading counter-clockwise across 0deg', () => {
            const gameState = new GameState(testMaze);
            gameState.buttons.left = true;
            gameState.player.heading = 2

            PlayerUpdater.updatePlayer(gameState);
            assert.equal(gameState.player.heading, 357);
        });

        it('should move the player forward', () => {
            const gameState = new GameState(testMaze);
            gameState.buttons.up = true;
            gameState.player.heading = 90;
            gameState.player.position.y = 15;
            gameState.player.position.x = 15;

            const testPos = {x: gameState.player.position.x + 5, y: gameState.player.position.y};
            PlayerUpdater.updatePlayer(gameState);
            assert.deepEqual(gameState.player.position, testPos);
        });

        it('should move the player backwards', () => {
            const gameState = new GameState(testMaze);
            gameState.buttons.down = true;
            gameState.player.heading = 90;
            gameState.player.position.x = 50;
            gameState.player.position.y = 15;

            const testPos = {x: gameState.player.position.x - 5, y: gameState.player.position.y};
            PlayerUpdater.updatePlayer(gameState);
            assert.deepEqual(gameState.player.position, testPos);
        });
    });
});