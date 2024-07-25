import { Trifulca } from "./trifulca.js"

export const cells = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null]
];

export const overlays = [
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null]
]

export const turnIndicator = document.getElementById('turn_indicator');

function initMatrices() {
    let table = document.getElementById('table');

    let row;
    for (let r = 0; row = table.rows[r]; r++) {
        let cell;
        for (let c = 0; cell = row.cells[c]; c++) {
            overlays[r][c] = cell.firstElementChild;
            
            if (r == 0 || r == 8 || c == 0 || c == 6)
                continue;

            cells[r - 1][c - 1] = cell;
        }
    }
}

initMatrices();

