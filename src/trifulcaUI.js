import { Trifulca } from "./trifulca.js"
import { cells, overlays, turnIndicator } from "./trifulcaUIElements.js"

let borderSize = 10;

const table = document.getElementById('table');

let game;
const state = {
    currPiece   : null,
    shownMoves  : null,
    clickedPos  : null
}

export { table, game, state };

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
    let t = table.getBoundingClientRect();
    // position relative to top-left corner of game board
    let gx = mx - t.x - borderSize;
    let gy = my - t.y - borderSize;
    
    // checks that tile within the game board is clicked
    //
    // NOT RESPONSIVE
    return (gx < 0 || gx >= 300 || gy < 0 || gy >= 420) 
        ? {
            r : -1,
            c : -1
        } : {
            // dependent on ratio of tile size to border size (6:1)
            // 
            // NOT RESPONSIVE
            r : Math.floor(gy / ((6 / 44) * t.height)),
            c : Math.floor(gx / ((6 / 32) * t.width))
        }
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

        showMoves(tile);

        return;
    }
    const status = getSelectedMoveStatus(tile);

    const clickedPos = state.clickedPos;
    
    hideMoves();

    if (status == 'NOTSELECTED') {
        if (piece != null && isAlly(piece)) 
            showMoves(tile);

        return;
    }

    attemptMove(status, clickedPos, tile);
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

function isAlly(piece) {
    return piece.faction == state.currPiece.faction;
}

function getSelectedMoveStatus(clicked) {
    for (const move of state.shownMoves) {
        if (clicked.r === move.pos.r && clicked.c === move.pos.c)
            return move.status;
    }
    return 'NOTSELECTED';
}

function attemptMove(status, oldPos, newPos) {
    switch(status) {
        case 'EMPTY': {
            movePiece(oldPos, newPos);
            break;
        }
        case 'BLOCKED': {
            break;
        }
        case 'ALLY': {
            showMoves(newPos);
            break;
        }
        case 'ENEMY': {
            /** begin battle round */
        }
    }
}

function showMoves(tile) {
    state.clickedPos = tile;
    state.shownMoves = game.getMoves(tile);
    state.currPiece  = game.board[tile.r][tile.c];
    
    for (const move of state.shownMoves) {
        let overlay = overlays[move.pos.r + 1][move.pos.c + 1];
        switch (move.status) {
            case 'EMPTY': {
                setOverlay(overlay, 'moveable');
                break;
            }
            case 'BLOCKED': /* blocked and ally are functionally equal */
            case 'ALLY': {
                setOverlay(overlay, 'unmoveable');
                break;
            }
            case 'ENEMY': {
                setOverlay(overlay, 'attackable');
            }
        }
    }
}

function setOverlay(tile, type) {
    tile.classList.add(type);
}

/**
 * Moves the current piece to the new position
 * @param {{r: number, c: number}} pos 
 * @see Trifulca.movePiece
 */
function movePiece(oldPos, pos) {
    game.movePiece(oldPos, pos);

    render();
}

function beginBattle() {
    // add functionality
}

function hideMoves() {
    for (const move of state.shownMoves) {
        overlays[move.pos.r + 1][move.pos.c + 1].className = '';
    }
    state.shownMoves = null;
    state.clickedPos = null;
}

export function render() {
    for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 5; c++) {
            let piece = game.board[r][c];
            
            if (piece == null)
                continue;
            
            let tile = cells[r][c];
            tile.classList.add(piece.faction);
            tile.classList.add(piece.type);
            tile.classList.add(piece.status);
        }
    }
    turnIndicator.innerHTML = game.turn;
}