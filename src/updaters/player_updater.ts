import * as LineLib from '../libs/line_lib';
import { GameState } from '../game_state';
import { Point } from '../common.js';

const PLAYER_SPEED = 5; // units the player can move per frame
const PLAYER_ROTATION_SPEED = 5 // degrees the player can turn per frame

export function updatePlayer(gameState: GameState) {
    // Calculate new player heading based on left/right arrows
    const newHeading = calcPlayerHeading(gameState);
    gameState.player.heading = newHeading;

    // Move player based on new heading
    const playerNewPos = calcPlayerPosition(gameState);
    gameState.player.position = playerNewPos;
}

function calcPlayerHeading(gameState: GameState): number {
    let heading = gameState.player.heading;

    if (gameState.buttons.left) {
        heading -= PLAYER_ROTATION_SPEED;
        if (heading < 0) {
            // Heading is negative. Adding it to 360 will subtract the value
            heading = 360 + heading;
        }
    }

    if (gameState.buttons.right) {
        heading += PLAYER_ROTATION_SPEED;
        if (heading > 359) {
            heading = heading - 360;
        }
    }

    return heading;
}

function calcPlayerPosition(gameState: GameState): Point {
    let newPos = gameState.player.position;

    if (gameState.buttons.up || gameState.buttons.down) {
        let heading = gameState.player.heading;
        if (gameState.buttons.down) {
            // Going backwards. Flip heading 180 deg.
            if (gameState.player.heading > 180) {
                heading = gameState.player.heading - 180;
            } else {
                heading = gameState.player.heading + 180;
            }
        }

        newPos = LineLib.traverseLine(
            gameState.player.position.x,
            gameState.player.position.y,
            heading,
            gameState.maze,
            PLAYER_SPEED);
    }

    return newPos;
}
