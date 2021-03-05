import { Maze } from '../maze'

export function loadMaze(): Maze | null {
    let tmpMaze = null;
    const mazeJSON = localStorage.getItem('maze');
    if (mazeJSON) {
        tmpMaze = Maze.fromJSON(mazeJSON);
    }

    return tmpMaze;
}

export function loadDefaultMaze(): Maze | null {
    let tmpMaze = null;

    const defaultMaze = {"width":"20","height":"15","cellDimensions":{"width":32,"height":32},"cells":["Wall","Path","Path","Path","Wall","Wall","Path","Path","Wall","Wall","Wall","Wall","Wall","Wall","Wall","Path","Path","Path","Path","Wall","Wall","Path","Path","Path","Path","Path","Path","Path","Wall","Wall","Path","Path","Path","Wall","Path","Path","Path","Path","Path","Path","Wall","Wall","Wall","Wall","Path","Path","Path","Wall","Wall","Path","Path","Path","Path","Path","Path","Path","Path","Path","Path","Path","Wall","Wall","Wall","Wall","Path","Path","Path","Wall","Wall","Path","Path","Path","Path","Path","Path","Wall","Wall","Wall","Path","Path","Wall","Wall","Wall","Path","Path","Wall","Path","Wall","Wall","Path","Path","Wall","Path","Path","Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall","Path","Path","Path","Path","Wall","Path","Path","Path","Wall","Path","Path","Wall","Path","Path","Path","Wall","Wall","Wall","Wall","Path","Path","Path","Path","Wall","Wall","Path","Path","Wall","Wall","Path","Wall","Path","Path","Path","Path","Path","Path","Start","Path","Path","Path","Path","Path","Wall","Path","Path","Wall","Wall","Path","Path","Wall","Path","Path","Wall","Path","Path","End","Wall","Wall","Wall","Path","Path","Path","Wall","Path","Path","Wall","Wall","Path","Path","Wall","Path","Path","Wall","Wall","Path","Wall","Wall","Wall","Wall","Wall","Path","Path","Wall","Wall","Path","Path","Wall","Path","Path","Path","Wall","Path","Path","Wall","Wall","Wall","Wall","Wall","Wall","Wall","Path","Path","Wall","Wall","Path","Path","Wall","Wall","Path","Path","Wall","Path","Path","Path","Wall","Wall","Wall","Path","Path","Path","Path","Path","Path","Wall","Path","Path","Path","Wall","Path","Path","Wall","Path","Path","Path","Wall","Wall","Wall","Path","Path","Path","Path","Wall","Path","Path","Path","Path","Path","Wall","Path","Path","Path","Path","Path","Wall","Wall","Wall","Path","Path","Path","Path","Path","Wall","Wall","Path","Path","Path","Path","Wall","Wall","Path","Path","Path","Wall","Wall","Wall","Wall","Path","Path","Path","Path","Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall"]};
    tmpMaze = Maze.fromJSON(defaultMaze);

    return tmpMaze;
}

export function saveMaze(maze: Maze) {
    try {
        const mazeJSON = maze.toJSON();
        localStorage.setItem('maze', mazeJSON);
        alert('Maze saved.');
    } catch (exception) {
        if (exception instanceof TypeError) {
            alert('Could not convert Maze to JSON.');
        } else {
            alert('Could not save maze to local storage.');
        }

        console.log(exception);
    }
}
