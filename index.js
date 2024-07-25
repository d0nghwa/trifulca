import { Trifulca } from "./src/trifulca.js"
import { cells, overlays, turnIndicator } from "./src/trifulcaUIElements.js"
import { table, state, game, newGame, getTile, clickedTile, render } from "./src/trifulcaUI.js"

newGame();

game.placePieces([
    { type : 'CONQ', position : {r: 0, c: 4}, faction : 'WHITE' },
    { type : 'DAME', position : {r: 0, c: 2}, faction : 'WHITE' },
    { type : 'NITE', position : {r: 0, c: 1}, faction : 'WHITE' },
    { type : 'CONQ', position : {r: 6, c: 2}, faction : 'RED' },
    { type : 'DAME', position : {r: 6, c: 1}, faction : 'RED' },
    { type : 'NITE', position : {r: 6, c: 0}, faction : 'RED' }
]);

render();
table.addEventListener("click", clickedTile);

function printMousePos(event) {
    let x = event.clientX;
    let y = event.clientY;

    clicked.innerHTML = "CLICKED: (" + x + ", " + y + ')';

    let tile = getTile(x, y);
    clicked_tile.innerHTML = "TILE: (" + tile.r + ", " + tile.c + ')';
}
  
document.getElementById('table').addEventListener("click", printMousePos);

let pos = table.getBoundingClientRect();
document.getElementById('coords').innerHTML += ' (' + pos.x + ', ' + pos.y + ')';