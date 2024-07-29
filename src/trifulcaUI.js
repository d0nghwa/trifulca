import { Trifulca } from "./trifulca.js"

let borderSize = 10;

const board         = document.getElementById('board');
const piecesCanvas  = board.getContext('2d');

const overlays      = document.getElementById('overlays');
const overlayCanvas = overlays.getContext('2d');

const turnIndicator = document.getElementById('turn_indicator');

const MOVEABLETILE   = 'rgb(0 128 0 / 50%)';
const BLOCKEDTILE    = 'rgb(0 0 0 / 50%)';
const ATTACKABLETILE = 'rgb(255 0 0 / 50%)';

let game;

const state = {
    currPiece   : null,
    shownMoves  : null,
    clickedPos  : null
}

export { board, overlays, game, state };

export function newGame() {
    game = new Trifulca();
}

/**
 * Returns the position of the tile that is clicked
 * @param {number} mx   is the client event's window relative x-coord
 * @param {number} my   is the client event's window relative y-coord
 * @returns {{r: number, c: number}}    the position of the clicked tile in
 *  [row, column] format
 */
export function getTile(mx, my) {
    let t = board.getBoundingClientRect();
    let border = t.width / 32;
    let tileSize = t.width * (6 / 32);

    // position relative to top-left corner of grid
    let rx = mx - t.left - border;
    let ry = my - t.top - border;
    
    let gridWidth = t.width - 2 * border;
    let gridHeight =  t.height - 2 * border;

    return (rx < 0 || rx >= gridWidth || 
            ry < 0 || ry >= gridHeight) 
        ? {
            r : -1,
            c : -1
        } : {
            r : Math.floor(ry / tileSize),
            c : Math.floor(rx / tileSize)
        }
}

export function getRelativePos(tile) {
    let t = board.getBoundingClientRect();
    let border = t.width / 32;
    let tileSize = t.width * (6 / 32);
    
    return {
        x : tile.c * tileSize + border,
        y : tile.r * tileSize + border
    };
}

export function clickedTile(event) {
    const tile = getTile(event.clientX, event.clientY);

    // game not initialised (SHOULD NOT OCCUR)
    if (game == null) return;
    // clicked out of bounds
    if (tile.r === -1 || tile.c === -1) return;

    const piece = game.board[tile.r][tile.c];

    if (movesHidden()) {
        switch (isInvalidPiece(piece)) {
            case 'UNMOVEABLE' : /* indicate invalid */
            case 'NULL' : return;
            default :
        }

        setMove(tile);

        return;
    }
    const status = getSelectedMoveStatus(tile);

    const clickedPos = state.clickedPos;
    const currPiece = state.currPiece;
    
    clearMove();

    if (status == 'UNREACHABLE') {
        if (piece == null || piece === currPiece)
            return

        if (isAlly(piece, currPiece))
            setMove(tile);

        return;
    }

    attemptMove(status, currPiece, tile);
}

function movesHidden() {
    return state.clickedPos == null;
}

function isInvalidPiece(piece) {
    if (piece == null)
        return 'NULL';

    if (piece.faction != game.turn ||
        piece.status == 'FINISHED' ||
        piece.status == 'STUNNED'
    ) {
        return 'UNMOVEABLE';
    }

    return 'VALID';
}

function isAlly(a, b) {
    return a.faction === b.faction;
}

function getSelectedMoveStatus(clicked) {
    for (const move of state.shownMoves) {
        if (clicked.r === move.pos.r && clicked.c === move.pos.c)
            return move.status;
    }
    return 'UNREACHABLE';
}

function attemptMove(status, piece, newPos) {
    switch(status) {
        case 'EMPTY': {
            movePiece(piece, newPos);
            break;
        }
        case 'BLOCKED': {
            break;
        }
        case 'ALLY': {
            setMove(newPos);
            break;
        }
        case 'ENEMY': {
            /** begin battle round */
        }
    }
}

function setMove(tile) {
    state.clickedPos = tile;
    state.shownMoves = game.getMoves(tile);
    state.currPiece  = game.board[tile.r][tile.c];
}

function clearMove() {
    state.clickedPos = null;
    state.shownMoves = null;
    state.currPiece  = null;
}

/**
 * @see Trifulca.movePiece
 */
function movePiece(piece, newPos) {
    game.movePiece(piece, newPos);
}

function beginBattle() {
    // add functionality
}

/*
 RENDERING FUNCTIONS  
 */

export function renderMoves() {
    overlayCanvas.reset();

    if (movesHidden())
        return;

    for (const move of state.shownMoves)
        renderMove(move);
}

function renderMove(move) {
    const pos = getRelativePos(move.pos);

    let t = board.getBoundingClientRect();
    let tileSize = t.width * (6 / 32);

    switch (move.status) {
        case 'EMPTY': {
            overlayCanvas.fillStyle = MOVEABLETILE;
            break;
        }
        case 'BLOCKED': /* blocked and ally are functionally equal */
        case 'ALLY': {
            overlayCanvas.fillStyle = BLOCKEDTILE;
            break;
        }
        case 'ENEMY': {
            overlayCanvas.fillStyle = ATTACKABLETILE;
        }
    }
    overlayCanvas.fillRect(pos.x, pos.y, tileSize, tileSize);
}

export function renderBoard() {
    piecesCanvas.reset();

    renderPieces(game.redPieces);
    renderPieces(game.whitePieces);

    turnIndicator.innerHTML = game.turn;
}

function renderPieces(pieces) {
    for (const piece of pieces) {
        const pos = getRelativePos(piece.position);

        let t = board.getBoundingClientRect();
        let tileSize = t.width * (6 / 32);

        const img = new Image();
        img.src = 
            './../backgrounds/' + piece.faction + ' ' + piece.type + '.png'
        img.onload = () => {
            piecesCanvas.drawImage(img, pos.x, pos.y, tileSize, tileSize);
        }
    }
}

export function resizeCanvas() {
    let t = board.getBoundingClientRect();

    board.width = t.width;
    board.height = t.height;

    overlays.width = t.width;
    overlays.height = t.height;
}