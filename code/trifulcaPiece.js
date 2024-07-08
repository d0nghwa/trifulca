class Piece {
    constructor(position, faction, movement) {
        this.position = position;
        this.faction = faction;
        this.movement = movement;
    }

    getFaction() {
        return this.faction;
    }

    getPosition() {
        return this.position;
    }

    setPosition(newPosition) {
        this.position = newPosition;
    }

    getMoveableTiles(board) {
        let moves = [];
        for (const move of this.movement) {
            let dr = this.faction == 'white' ? move[0] : -move[0];
            let dc = this.faction == 'white' ? move[1] : -move[1];
            let new_pos = [this.position[0] + dr, this.position[1] + dc];
            
            if (new_pos[0] >= board.length || new_pos[0] < 0) continue;
            if (new_pos[1] >= board[0].length || new_pos[1] < 0) continue;

            moves.push(new_pos);
        }
        return moves;
    }
}

export class Conquistador extends Piece {
    constructor(position, faction) {
        super(position, faction, [[2, 0], [0, 2], [0, -2]]);
    }

    getName() {
        return 'conq';
    }
}

export class Dame extends Piece {
    constructor(position, faction) {
        super(position, faction, [[1, 0], [0, 1], [0, -1]]);
    }

    getName() {
        return 'dame';
    }
}

export class Knight extends Piece {
    constructor(position, faction) {
        super(position, faction, [[1, 1],[1, -1]]);
    }

    getName() {
        return 'nite';
    }
}
