class Trifulca {
    constructor() {
        this.board = [];

        let row;
        while (this.board.length < 7) {
            this.board.push(row = []);
            while (row.push(null) < 5); 
        }

        this.start_placement();
    }

    start_placement() {
        this.place_piece(new Conquistador([6, 0]), [6, 0]);
        this.place_piece(new Dame([6, 2]), [6, 2]);
        this.place_piece(new Knight([6, 3]), [6, 3]);
    }

    place_piece(piece, position) {
        let r = position[0];
        let c = position[1];
        this.board[r][c] = piece;

        let tile = document.getElementById(position);
        tile.classList.add(piece.get_name());
        tile.innerHTML = piece.get_name();
    }
}
