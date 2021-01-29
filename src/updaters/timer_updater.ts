import { GameState, PlayState } from '../game_state';

export function updateTimer(gameState: GameState) {
    let timeDif = gameState.elapsedTime;
    if (gameState.playState === PlayState.PLAYING) {
        if (gameState.startTime) {
            const curTime = new Date();
            timeDif = curTime.valueOf() - gameState.startTime.valueOf();
        } else {
            gameState.startTime = new Date();
        }
    }

    gameState.elapsedTime = timeDif;
}
