import { GameState } from './game_state';
import * as FileLib from './libs/file_lib';
import * as PlayerUpdater from './updaters/player_updater';
import * as TimerUpdater from './updaters/timer_updater';
import * as PlayStateUpdater from './updaters/play_state_updater';
import Renderer from './renderers/renderer_base';
import Renderer2d from './renderers/renderer_2d';
import RendererRaycast from './renderers/renderer_raycast';

// The target number of game iterations per second
const FRAMES_PER_SECOND = 30;

// The renderer objects
let renderer: Renderer, renderer2d: Renderer, rendererRaycast: Renderer;

// The GameState
let gameState: GameState;

// Initialze the game!
init();

/**
 * Function that initializes the game state and kicks off the game loop.
 */
function init() {
    const maze = FileLib.loadMaze();
    if (!maze) {
        alert('No maze to play. Go to the editor and create a maze.');
    } else {
        gameState = new GameState(maze);
        const canvas = _getElementById('maze-canvas') as HTMLCanvasElement;

        // Resize the canvas to properly fit in the space available
        canvas.height = canvas.clientHeight;
        canvas.width = canvas.clientWidth;

        // create the renderer
        renderer2d = new Renderer2d(canvas);
        rendererRaycast = new RendererRaycast(canvas);
        renderer = renderer2d;

        // Set up button state recording events
        initEvents();

        // Set up the initial player state
        initPlayerState();

        // Start the game loop
        gameState.gameLoopInterval = setInterval(() => {
            drawFrame(gameState);
        }, 1000 / FRAMES_PER_SECOND);
    }

    console.log("Maze game initialized");
}

/**
 * Function that sets the player's initial state
 */
function initPlayerState() {
    const startCell = gameState.maze.getStartCell();
    if (!startCell) {
        throw new Error('The maze has no Start cell');
    }

    const startCellBBox = gameState.maze.getCellBoundingBox(startCell.row, startCell.col);
    if (!startCellBBox) {
        throw new Error(`Start cell bounding box could not be determined at { row: ${startCell.row}, col: ${startCell.col} }`);
    }

    gameState.player.position.x = startCellBBox.left + Math.floor((startCellBBox.right - startCellBBox.left) / 2);
    gameState.player.position.y = startCellBBox.top + Math.floor((startCellBBox.bottom - startCellBBox.top) / 2);
    gameState.player.heading = 0;

    const cellDims = gameState.maze.getCellDimensions();
    gameState.player.size.width = Math.floor(cellDims.width * 0.8);
    gameState.player.size.height = Math.floor(cellDims.height * 0.8);
}

/**
 * Funciton that sets up all the event handlers
 */
function initEvents() {
    const canvas = _getElementById('maze-canvas') as HTMLCanvasElement;
    window.onresize = () => {
        canvas.height = canvas.clientHeight;
        canvas.width = canvas.clientWidth;
    };

    document.addEventListener('keydown', (evt) => {
        handleButtonEvent(evt.key, true);
    });

    document.addEventListener('keyup', (evt) => {
        handleButtonEvent(evt.key, false);
    });

    _getElementById('2d_radio').addEventListener('change', (evt) => {
        const radioElement = evt.target as HTMLInputElement;
        if (radioElement.checked === true) {
            renderer = renderer2d;
        }
    });

    _getElementById('3d_radio').addEventListener('change', (evt) => {
        const radioElement = evt.target as HTMLInputElement;
        if (radioElement.checked === true) {
            renderer = rendererRaycast;
        }
    });
}

/**
 * This function handles a keydown or keyup event. This will update the key
 * states of the keys that affect the game
 *
 * @param {string} key
 * @param {boolean} isDown
 */
function handleButtonEvent(key: string, isDown: boolean) {
    // console.log(`${key} is ${isDown ? 'down' : 'up'}`);

    // Different browsers call the arrow keys by different names (of course)
    switch (key) {
        case 'Up':
        case 'ArrowUp':
            gameState.buttons.up = isDown;
            break;
        case 'Down':
        case 'ArrowDown':
            gameState.buttons.down = isDown;
            break;
        case 'Left':
        case 'ArrowLeft':
            gameState.buttons.left = isDown;
            break;
        case 'Right':
        case 'ArrowRight':
            gameState.buttons.right = isDown;
            break;
        default:
            break;
    }
}

/**
 * This is the heart of the game. This function is called every iteration to
 * calculate the current state of the game and re-render the screen.
 */
function drawFrame(gameState: GameState) {
    // Update the state of the game (start, playing, done);
    PlayStateUpdater.updatePlayState(gameState);

    // Update the Timer
    TimerUpdater.updateTimer(gameState);

    // Update player state
    PlayerUpdater.updatePlayer(gameState);

    // Update the UI and render the scene
    updateTimerDisplay(gameState);
    renderer.render(gameState);
}

function updateTimerDisplay(gameState: GameState) {
    const timeDif = gameState.elapsedTime;
    const minutes = Math.floor(timeDif / 60000);
    const seconds = (timeDif - (minutes * 60000)) / 1000;

    let minStr;
    if (minutes === 0) {
        minStr = '00';
    } else if (minutes < 10) {
        minStr = `0${minutes}`;
    } else {
        minStr = `${minutes}`;
    }

    let secStr;
    if (seconds === 0) {
        secStr = '00';
    } else if (seconds < 10) {
        secStr = `0${seconds}`;
    } else {
        secStr = `${seconds}`;
    }

    const timerString = `${minStr}:${secStr}`;
    _getElementById('timer').innerHTML = timerString;
}

function _getElementById(id: string): HTMLElement {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`An HTML element with id: ${id} could not be found`);
    }

    return element;
}