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

        this.rows = 7;
        this.cols = 5;

        /**
         * An array of all faction pieces, along with their status
         */
        this.redPieces = [];
        this.whitePieces = [];

        this.turn = 'WHITE';

        this.battle = {
            state       : 'INACTIVE',
            duels       : 0,
            offWins     : 0,
            defWins     : 0,
            defencePos  : null,
            offencePos  : null
        }
    }

    // toString() {
    //     let str = '';
    //     for (let i = 0; i < 5; i++) {
    //         str += '---';
    //     }
    //     str += '-\n';
    //     for (const row of this.board) {
    //         for (const cell of row) {
    //             str += '|';
    //             if (cell == null) {
    //                 str += '  ';
    //             } else {
    //                 str += cell.faction == 'red' ? 'R' : 'W';
    //                 switch (cell.type) {
    //                     case 'conq' :
    //                         str += 'c';
    //                         break;
    //                     case 'dame' :
    //                         str += 'd';
    //                         break;
    //                     default :
    //                         str += 'k';
    //                 }
    //             }
    //         }
    //         str += '|\n';
    //         for (let i = 0; i < 5; i++) {
    //             str += '---';
    //         }
    //         str += '-\n';
    //     }
    //     return str;
    // }

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
        const movingPiece = this.board[pos.r][pos.c];

        const moveableTiles = movingPiece.getMoveableTiles(this.board);

        let validTiles = [];
        for (const moveable of moveableTiles) {
            let valid = {
                status : '',
                pos : moveable
            };

            const targetPiece = this.board[moveable.r][moveable.c];
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
            
            if (r >= this.rows || r < 0 || c >= this.cols || c < 0) 
                continue;

            let adjacent = this.board[r][c];
            if (adjacent == null || 
                adjacent.faction != faction ||
                adjacent.status == 'STUNNED')
                continue;

            support += adjacent.support;
        }
        return support;
    }

    movePiece(oldPos, newPos) {
        let temp = this.board[oldPos.r][oldPos.c];
        this.board[oldPos.r][oldPos.c] = this.board[newPos.r][newPos.c];
        this.board[newPos.r][newPos.c] = temp;
    }

    /**
     * Initialises the current battle conditions
     * @param {{r : number, c : number}} defTile    the grid position where the 
     *                                              battle occurs
     * @param {{r : number, c : number}} offTile    the grid position where
     *                                              'pos' is being attacked from
     */
    initBattle(defTile, offTile) {
        this.battle.state = 'ACTIVE';
        this.battle.defencePos = defTile;
        this.battle.offencePos = offTile;
    }

    /**
     * Compares two cards and determines the winner, and updates the current 
     * battle state
     * @param {{suit : string, value : int}} off    the red faction's card
     * @param {{suit : string, value : int}} def    the white faction's card
     * @returns 'OFF' or 'DEF' depending on the which player has a higher
     *           card, or 'DRAW' if card values are equal
     */
    compareCard(off, def) {
        let diff = off.value - def.value;
        this.battle.duels++;
        
        if (diff > 0) {
            this.battle.offWins++;
            return 'OFF';
        } else if (diff < 0) {
            this.battle.defWins++;
            return 'DEF'
        }

        return 'DRAW';
    }

    /**
     * Checks the state of the current battle to determine the winner
     * @returns {'INCOMPLETE' | 'OFFVICTORY' | 'DEFVICTORY'}    meaning: 
     * - 'INCOMPLETE' denotes the battle has not yet concluded
     */
    checkBattle() {
        if (this.battle.duels < 3) {
            return 'INCOMPLETE';
        }

        let winDiff = this.battle.offWins - this.battle.defWins;
        if (winDiff > 0) {
            let defPos = this.battle.defencePos;
            this.board[defPos.r][defPos.c].status = 'STUNNED';
            return 'OFFVICTORY';
        }
        if (winDiff < 0) {
            // defensive piece can be attacked while stunned and win, resulting
            // in being unstunned
            let defPos = this.battle.defencePos;
            this.board[defPos.r][defPos.c].status = 'ACTIVE';

            let offPos = this.battle.offencePos;
            this.board[offPos.r][offPos.c].status = 'STUNNED';
            return 'DEFVICTORY';
        }
        return 'INCOMPLETE';
    }

    /**
     * Resets the battle state
     */
    finishBattle() {
        this.battle = {
            state      : 'INACTIVE',
            duels      : 0,
            offWins    : 0,
            defWins    : 0,
            defencePos : null,
            offencePos : null
        }
    }
}



