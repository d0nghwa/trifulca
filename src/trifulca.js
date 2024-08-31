import { Piece } from "./trifulcaPiece.js";
import { getCards } from "./deck.js";

/**
 * An instance of a game of Trifulca
 * 
 * Methods describe game behaviour
 */
export class Trifulca {
    constructor() {
        this.board = [];
        let row;
        while (this.board.length < 7) {
            this.board.push(row = []);
            while (row.push(null) < 5); 
        }

        /**
         * An array of all faction pieces
         */
        this.redPieces = [];
        this.whitePieces = [];

        this.turn = 'WHITE';
    }

    /**
     * Places the given pieces in the board
     * @param {
     *  {
     *      type     : string, 
     *      position : { r : number, c : number }, 
     *      faction  : string
     *  }[]
     * } chosenTiles    is an array of pieces to be placed:
     * - 'type' is 'CONQ | DAME | NITE,' corresponding to Conquistador, Dame, 
     *    or Knight pieces respectively
     * - 'position' is the coordinates of the pieces on the grid
     * - 'faction' is the piece's faction, either 'RED' or 'WHITE'
     */
    placePieces(chosenTiles) {
        for (const tile of chosenTiles) {
            let piece  = new Piece(tile.position, tile.faction, tile.type);
            this.board[tile.position.r][tile.position.c] = piece;
            
            piece.faction == 'RED' 
                ? this.redPieces.push(piece)
                : this.whitePieces.push(piece);
        }
    }

    /**
     * Obtains the tiles (and their status) to move to from a given tile
     * @param {
     *  {
     *      r : number,
     *      c : number
     *  }
     * } pos  the position of the given piece
     * 
     * @returns {
     *  {
     *      status : string, 
     *      pos : { r : number, c : number }
     *  }[]
     * }    an array containing an object literal with two fields:
     *  - 'status' is denotes the status of the tile that could be moved to:
     *      - 'EMPTY'   the tile contains no other pieces, and can
     *                  be moved to
     *      - 'BLOCKED' there is another piece in between the
     *                  moving piece and the new tile (only for Conquistador)
     *      - 'ALLY'    there is an ally piece on the new tile
     *      - 'ENEMY'   there is an enemy piece on the new tile to attack
     *  - 'position' is the coordinates of the tile, must contain a valid piece
     */
    getMoves(pos) {
        const movingPiece = this.getPiece(pos);

        const moveableTiles = movingPiece.getMoveableTiles();

        let validTiles = [];
        for (const moveable of moveableTiles) {
            let valid = {
                status : '',
                pos : moveable
            };

            const targetPiece = this.getPiece(moveable);
            if (targetPiece == null) 
                valid.status = 'EMPTY';
            else if (targetPiece.faction == movingPiece.faction)
                valid.status = 'ALLY';
            else 
                valid.status = 'ENEMY';

            // conq cannot 'jump' over other tiles
            let r = (moveable.r + pos.r) >> 1;
            let c = (moveable.c + pos.c) >> 1;
            if (movingPiece.type == 'CONQ' && this.board[r][c] != null) {
                valid.status = 'BLOCKED';
            }
            
            validTiles.push(valid);
        }
        return validTiles;
    }

    getPushes(pos) {
        const pushingPiece = this.getPiece(pos);
        const pushableTiles = pushingPiece.getPushableTiles();

        let tiles = [];
        for (const pushable of pushableTiles) {
            let push = {
                status: '',
                pos : pushable
            }

            if (
                pushable.r >= 7 || pushable.r < 0 || 
                pushable.c >= 5 || pushable.c < 0
            ) {
                push.status = 'OUT';
            } else {
                const targetPiece = this.getPiece(pushable);
                if (targetPiece === null)
                    push.status = 'EMPTY';
                else if (targetPiece.faction == pushingPiece.faction) {
                    push.status = 'ALLY';
                } else {
                    push.status = 'ENEMY';
                }
            }

            // CONQ can only be pushed row-wise, hence it can only be blocked 
            // row-wise
            if (pushingPiece.type == 'CONQ' && 
                (pos.r > 0 && pos.r < 6) &&
                this.board[(pushable.r + pos.r) >> 1][pushable.c] !== null
            ) {
                push.status = 'BLOCKED';
            }

            tiles.push(push);
        }
        return tiles;
    }

    /**
     * Gets the number of supporting cards for a given position and faction
     * on the grid
     * @param {{r : number, c : number}} pos  the position of the piece being 
     *                                        supported
     * @param {string} faction  either 'RED' or 'WHITE,' dependent on which 
     *                          faction's supporters are being found
     * @returns the number of support cards to deal to the given faction's 
     *          player during battle
     */
    getSupport(pos, faction) {
        const dr = [-1, -1, -1, 0, 0, 1, 1, 1];
        const dc = [-1, 0, 1, -1, 1, -1, 0, 1];

        let support = 0;
        for (let i = 0; i < 8; i++) {
            let r = pos.r + dr[i];
            let c = pos.c + dc[i];
            
            if (r >= 7 || r < 0 || c >= 5 || c < 0) 
                continue;

            let adjacent = this.board[r][c];
            if (
                adjacent == null || 
                adjacent.faction != faction ||
                adjacent.status == 'STUNNED'
            ) {
                continue;
            }

            support += adjacent.support;
        }
        return support;
    }

    /**
     * Requires that newPos is the position of an empty tile on the board
     * @param {*} piece 
     * @param {*} newPos 
     */
    movePiece(piece, newPos) {
        let oldPos = piece.position;

        this.board[oldPos.r][oldPos.c] = null;
        this.board[newPos.r][newPos.c] = piece;

        piece.position = newPos;
    }

    nextTurn() {
        this.turn = this.turn == 'RED' 
            ? 'WHITE'
            : 'RED';
    }

    getPiece(tile) {
        return tile.r < 0 || tile.r >= 7 || tile.c < 0 || tile.c >= 5
            ? null
            : this.board[tile.r][tile.c];
    }
}



