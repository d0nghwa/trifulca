import { renderBoard, renderMoves, resizeCanvas, board, overlays, game, newGame, getTile, clickedTile } from "./src/trifulcaUI.js"

let rect = board.getBoundingClientRect();

function printMousePos(event) {
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    clicked.innerHTML = "CLICKED: (" + x + ", " + y + ')';

    let tile = getTile(event.clientX, event.clientY);
    clicked_tile.innerHTML = "TILE: (" + tile.r + ", " + tile.c + ')';
}
  
overlays.addEventListener("click", printMousePos);

let pos = board.getBoundingClientRect();
document.getElementById('coords').innerHTML += ' (' + (pos.x - rect.left) + ', ' + (pos.y - rect.top) + ')';

newGame();

game.placePieces([
    { type : 'CONQ', position : {r: 0, c: 4}, faction : 'WHITE' },
    { type : 'DAME', position : {r: 0, c: 2}, faction : 'WHITE' },
    { type : 'NITE', position : {r: 0, c: 1}, faction : 'WHITE' },
    { type : 'CONQ', position : {r: 6, c: 2}, faction : 'RED' },
    { type : 'DAME', position : {r: 6, c: 1}, faction : 'RED' },
    { type : 'NITE', position : {r: 6, c: 0}, faction : 'RED' }
]);

resizeCanvas();

renderBoard();

overlays.addEventListener("click", (e) => {
    clickedTile(e);
    renderMoves();
    renderBoard();
});

