export class Piece {
    /**
     * @property {string} status is:
     * - 'ACTIVE' denotes that the piece is on the board and unrestricted
     * - 'STUNNED' denotes that the piece was defeated/cannot be used this turn
     * - 'DEFEATED' denotes that the piece was pushed off the board, or unable
     *    to be moved, and needs to be replaced
     * - 'FINISHED' denotes that the piece is at the endzone, and 
     *    can no longer be used
     */
    constructor(position, faction, type) {
        this.position = position;
        this.faction = faction;
        this.type = type;
        this.movement;
        this.battle;
        this.support;
        this.status = 'ACTIVE';
        
        switch (type) {
            case 'CONQ' :
                this.movement = [
                    {r: 2, c: 0}, 
                    {r: 0, c: 2},
                    {r: 0, c: -2}
                ];
                this.battle = 5;
                this.support = 4;
                break;
            case 'DAME' :
                this.movement = [
                    {r: 1, c: 0}, 
                    {r: 0, c: 1},
                    {r: 0, c: -1}
                ];
                this.battle = 4;
                this.support = 3;
                break;
            default :
                this.movement = [
                    {r: 1, c: 1}, 
                    {r: 1, c: -1}
                ];
                this.battle = 3;
                this.support = 2;
        }
    }

    getMoveableTiles() {
        let moves = [];
        for (const move of this.movement) {
            let dr = this.faction == 'WHITE' ? move.r : -move.r;
            let dc = this.faction == 'WHITE' ? move.c : -move.c;
            let new_pos = {
                r: this.position.r + dr, 
                c: this.position.c + dc
            };
            
            if (new_pos.r >= 7 || new_pos.r < 0) continue;
            if (new_pos.c >= 5 || new_pos.c < 0) continue;

            moves.push(new_pos);
        }
        return moves;
    }

    // getPushableTiles(board) {
    //     let moves = [];
    //     for (const move of this.movement) {
    //         let dr = (this.faction == 'white') ? -move[0] : move[0];
    //         let dc = (this.faction == 'white') ? -move[1] : move[1];
    //         let new_pos = [this.position[0] + dr, this.position[1] + dc];

    //         moves.push(new_pos);

    //         // conq can only be pushed row-wise, row movement is first in moves
    //         if (this.type == 'conq') 
    //             break;
    //     }
    //     return moves;
    // }
}