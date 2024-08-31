import { Trifulca } from "./trifulca.js"
import { battling } from "./trifulcaBattle.js"

const wrapper       = document.getElementById('board_wrapper');

const board         = document.getElementById('board');
const piecesCanvas  = board.getContext('2d');

const overlays      = document.getElementById('overlays');
const overlayCanvas = overlays.getContext('2d');

const turnIndicator = document.getElementById('turn_indicator');

const MOVEABLETILE   = 'rgb(0 128 0 / 50%)';
const BLOCKEDTILE    = 'rgb(0 0 0 / 50%)';
const ATTACKABLETILE = 'rgb(255 0 0 / 50%)';

const sprites = {
    RED : {
        CONQ : null,
        DAME : null,
        NITE : null
    },
    WHITE : {
        CONQ : null,
        DAME : null,
        NITE : null
    }
}

let game;

const selected = {
    piece   : null,
    moves   : null,
    pos     : null
}

let width, height;

export { board, overlays, overlayCanvas, game, wrapper, width, height };

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
function getTile(mx, my) {
    let border = width / 32;
    let tileSize = width * (6 / 32);
    
    // position relative to top-left corner of grid
    let t = board.getBoundingClientRect();
    // relative positions
    let rx = mx - t.left - border;
    let ry = my - t.top - border;
    // grid dimensions
    let gw = width - 2 * border;
    let gh = height - 2 * border;

    return {
        r: ry < 0 ? -1 : ry >= gh ? 7 : Math.floor(ry / tileSize),
        c: rx < 0 ? -1 : rx >= gw ? 5 : Math.floor(rx / tileSize)
    }
}

function getRelativePos(tile) {
    let t = board.getBoundingClientRect();
    let border = t.width / 32;
    let tileSize = t.width * (6 / 32);
    
    return {
        x : tile.c * tileSize + border,
        y : tile.r * tileSize + border
    };
}

function outOfBounds(tile) {
    return (tile.r < 0 || tile.r > 6 || tile.c < 0 || tile.c > 4);
}

function isAlly(piece, ally) {
    return (
        piece !== null && 
        piece.faction === ally.faction &&
        piece !== ally
    )
}

export async function playing() {
    while (true) {
        renderTurn();

        let move = selectMove();

        overlays.addEventListener('click', renderMoves);

        await moving(await move);

        renderBoard();
        renderMoves();

        overlays.removeEventListener('click', renderMoves);

        game.nextTurn();
    }
}

async function moving(move) {
    if (move.status === 'ENEMY') {
        let offPos = move.piece.position;
        let defPos = move.pos;
        let result = await battling(defPos, offPos);
        
        console.log(result);

        if (result === 'OFFVICTORY') {
            // defender pushed back
            // move offensive piece
            // defensive piece stunned
            // check pushed off
        } else {
            // offender pushed back
            // offensive piece stunned
            // check pushed off
        }
    } else {
        movePiece(move.piece, move.pos);
        // check if finished/won
    }
}

async function pushing(tile) {
    // render possible pushes
    // get click
    // 
}

function selectMove() {
    return new Promise((resolve, reject) => {
        // need to keep a reference to both selectMoveEvent and resolve
        overlays.addEventListener('click', function selectMoveEvent(event) {
            const tile = getTile(event.clientX, event.clientY);

            if (outOfBounds(tile)) 
                return;

            const piece = game.getPiece(tile);

            if (movesHidden()) {
                if (!isInvalidPiece(piece))
                    setMove(tile);

                return;
            }
            
            const move = {
                status  : getSelectedMoveStatus(tile),
                piece   : selected.piece,
                pos     : tile
            }

            clearMove();

            switch (move.status) {
                case 'UNREACHABLE' :
                    if (isAlly(piece, move.piece))
                        setMove(move.pos);
                    break;
                case 'ALLY' : 
                    setMove(move.pos);
                    break;
                case 'BLOCKED' :
                    break;
                case 'ENEMY' :
                case 'EMPTY' :
                    resolve(move);
                    overlays.removeEventListener('click', selectMoveEvent);
            }
        });
    });
}

function movesHidden() {
    return selected.piece == null;
}

function isInvalidPiece(piece) {
    return (
        piece == null ||
        piece.faction != game.turn ||
        piece.status == 'FINISHED' ||
        piece.status == 'STUNNED'
    ) 
}

function getSelectedMoveStatus(clicked) {
    for (const move of selected.moves) {
        if (clicked.r === move.pos.r && clicked.c === move.pos.c)
            return move.status;
    }
    return 'UNREACHABLE';
}

function setMove(tile) {
    selected.pos = tile;
    selected.moves = game.getMoves(tile);
    selected.piece = game.getPiece(tile);
}

function clearMove() {
    selected.pos = null;
    selected.moves = null;
    selected.piece = null;
}

/**
 * @see Trifulca.movePiece
 */
function movePiece(piece, newPos) {
    game.movePiece(piece, newPos);
}

/*
 RENDERING FUNCTIONS  
 */

export function initSprites() {
    const factions = ['RED', 'WHITE'];
    const types = ['CONQ', 'DAME', 'NITE'];

    const promises = [];
    for (const faction of factions) {
        for (const type of types) {
            const img = new Image();
            img.src = './../backgrounds/' + faction + ' ' + type + '.png';

            const promise = new Promise((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = (err) => reject(err);
            })
            promises.push(promise);

            sprites[faction][type] = img;
        }
    }
    return Promise.all(promises);
}

function renderTurn() {
    turnIndicator.innerHTML = game.turn;
}

function renderMoves() {
    overlayCanvas.reset();

    if (movesHidden())
        return;

    for (const move of selected.moves)
        renderMove(move);
}

function renderMove(move) {
    const pos = getRelativePos(move.pos);

    let tileSize = width * (6 / 32);

    switch (move.status) {
        case 'EMPTY':
            overlayCanvas.fillStyle = MOVEABLETILE;
            break;
        case 'BLOCKED': /* blocked and ally are functionally equal */
        case 'ALLY':
            overlayCanvas.fillStyle = BLOCKEDTILE;
            break;
        case 'ENEMY':
            overlayCanvas.fillStyle = ATTACKABLETILE;
    }
    overlayCanvas.fillRect(pos.x, pos.y, tileSize, tileSize);
}

export function renderBoard() {
    piecesCanvas.clearRect(0, 0, width, height);

    renderPieces(game.redPieces);
    renderPieces(game.whitePieces);
}

function renderPieces(pieces) {
    for (const piece of pieces) {
        const pos = getRelativePos(piece.position);

        let tileSize = width * (6 / 32);

        let img = sprites[piece.faction][piece.type];
        piecesCanvas.drawImage(img, pos.x, pos.y, tileSize, tileSize);
    }
}

export function resizeCanvas() {
    let t = wrapper.getBoundingClientRect();

    width = t.width;
    height = t.height;

    const canvases = document.querySelectorAll('canvas');
    for (const canvas of canvases) {
        canvas.width = t.width;
        canvas.height = t.height;
    }
}
