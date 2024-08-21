import { 
    renderBoard, renderMoves, resizeCanvas, initSprites,
    overlays, game, newGame, clickedTile, wrapper, width, height
} from "./src/trifulcaMovement.js"
import { 
    battling
} from "./src/trifulcaBattle.js";

newGame();

let p = initSprites();

game.placePieces([
    { type : 'CONQ', position : {r: 0, c: 4}, faction : 'WHITE' },
    { type : 'DAME', position : {r: 0, c: 2}, faction : 'WHITE' },
    { type : 'NITE', position : {r: 0, c: 1}, faction : 'WHITE' },
    { type : 'CONQ', position : {r: 6, c: 2}, faction : 'RED' },
    { type : 'DAME', position : {r: 6, c: 1}, faction : 'RED' },
    { type : 'NITE', position : {r: 6, c: 0}, faction : 'RED' }
]);

resizeCanvas();

window.addEventListener('resize', resizeCanvas);

p.then(() => {
    renderBoard();
    window.addEventListener('resize', renderBoard);
});

overlays.addEventListener("click", (e) => {
    clickedTile(e);
    renderMoves();
    renderBoard();
});

//battling({r: 6, c: 2}, {r: 0, c: 2});


