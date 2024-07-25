import { Trifulca } from "./trifulca.js";

const grid_matrix = [
    [1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1]
];

function initGrid(matrix) {
    let grid = document.createElement('table');
    grid.className = 'grid';
    for (let r = 0; r < matrix.length; r++) {
        let grid_row = grid.appendChild(document.createElement('tr'));
        for (let c = 0; c < matrix[r].length; c++) {
            let tile = grid_row.appendChild(document.createElement('td'));
            tile.className = matrix[r][c] ? 'dark tile' : 'light tile';
            tile.id = [r, c];

            let overlay = tile.appendChild(document.createElement('div'));
            overlay.className = 'overlay';
            overlay.id = [r, c] + ' overlay';
        }
    }
    return grid;
} 

function startGame() {
    const game = new Trifulca();
}

let grid = initGrid(grid_matrix);
document.getElementById('content').appendChild(grid);

let button = document.getElementById('startButton');
button.addEventListener("click", startGame, { once: true });


