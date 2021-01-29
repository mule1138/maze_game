import { GameState, PlayState } from '../game_state'
import {CellTypes} from '../maze'

/**
 * Does an in-place update of the play state property of the game state
 *
 * @param gameState
 *
 */
export function updatePlayState(gameState: GameState) {
    const currentCell = gameState.maze.getCellFromXYUnits(gameState.player.position.x, gameState.player.position.y);

    if (currentCell) {
        const cellType = gameState.maze.getCellType(currentCell.row, currentCell.col);

        switch (gameState.playState) {
            case PlayState.START:
                // If the player has left the start cell, the game is afoot
                if (cellType.type !== CellTypes.START) {
                    gameState.playState = PlayState.PLAYING;
                }
                break;
            case PlayState.PLAYING:
                // If the player has entered the end cell, the game is done
                if (cellType.type === CellTypes.END) {
                    gameState.playState = PlayState.DONE;
                }
                break;
            case PlayState.DONE:
                clearInterval(gameState.gameLoopInterval);
                break;
            default:
                break;
        }
    }
}
