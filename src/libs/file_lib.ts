import { Maze } from '../maze'

export function loadMaze(): Maze | null {
    let tmpMaze = null;
    const mazeJSON = localStorage.getItem('maze');
    if (mazeJSON) {
        tmpMaze = Maze.fromJSON(mazeJSON);
    }

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
