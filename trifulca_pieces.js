class Piece {
    constructor(position, movement) {
        this.position = position;
        this.movement = movement;
    }

    get_name() {}
}

class Conquistador extends Piece {
    constructor(position) {
        super(position, [2, 1, 2, 0, 2]);
    }

    get_name() {
        return 'conq';
    }
}

class Dame extends Piece {
    constructor(position) {
        super(position, [1, 0, 1, 0, 1]);
    }

    get_name() {
        return 'dame';
    }
}

class Knight extends Piece {
    constructor(position) {
        super(position, [0, 1, 0, 1, 0]);
    }

    get_name() {
        return 'nite';
    }
}