const grid_matrix = [
    [1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1]
];

function init_grid(matrix) {
    let grid = document.createElement('table');
    grid.className = 'grid';
    for (let r = 0; r < matrix.length; r++) {
        let grid_row = grid.appendChild(document.createElement('tr'));
        for (let c = 0; c < matrix[r].length; c++) {
            let tile = grid_row.appendChild(document.createElement('td'));
            tile.className = matrix[r][c] ? 'dark tile' : 'light tile';
            tile.id = [r, c];
        }
    }
    return grid;
}

function start_game() {
    const game = new Trifulca();
}

let grid = init_grid(grid_matrix);
document.getElementById('content').appendChild(grid);

start_game();
