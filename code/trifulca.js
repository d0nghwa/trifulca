import { Conquistador, Dame, Knight } from "./trifulcaPiece.js";

export class Trifulca {
    constructor() {
        this.board = [];
        let row;
        while (this.board.length < 7) {
            this.board.push(row = []);
            while (row.push(null) < 5); 
        }

        this.state = {
            turn:   null,
            winner: null
        };

        this.beginGame();
    }

    beginGame() {
        // 
        // assign starting player randomly
        this.beginPlacement();
    }

    beginPlacement() {  
        let pos = [0,2];
        this.placePiece(new Conquistador(pos, 'white'), pos);
        pos = [6,1];
        this.placePiece(new Dame(pos, 'red'), pos);

        this.state.turn = 'red';
    }

    beginTurn() {
        
    }

    endTurn() {

    }

    checkGame() {

    }

    nextTurn() {

    }

    finishGame() {

    }

    placePiece(piece, position) {
        let r = position[0];
        let c = position[1];
        this.board[r][c] = piece;

        let tile = document.getElementById(position);
        tile.classList.add(piece.getName(), piece.getFaction());

        let clickedTile = document.getElementById(position + ' overlay');
        clickedTile.addEventListener("click", () => { this.toggleClickedTile(piece, clickedTile) }, false);
    }

    movePiece(piece, newPosition) {
        let oldPosition = piece.getPosition();

        this.board[newPosition[0]][newPosition[1]] = piece;
        let newTile = document.getElementById(newPosition);
        newTile.classList.add(piece.getName(), piece.getFaction());

        let newOverlay = document.getElementById(newPosition + ' overlay');
        if (this.willFinish(piece, newPosition)) {
            newOverlay.classList.add('finished');
        }
        else {
            newOverlay.addEventListener("click", () => { this.toggleClickedTile(piece, newOverlay) }, false);
        }
        piece.setPosition(newPosition);

        this.board[oldPosition[0]][oldPosition[1]] = null;
        let oldTile = document.getElementById(oldPosition);
        oldTile.classList.remove(piece.getName(), piece.getFaction());

        let oldOverlay = document.getElementById(oldPosition + ' overlay');
        oldOverlay.replaceWith(oldOverlay.cloneNode(true));
    }

    willFinish(piece, newPosition) {
        return piece.getFaction() == 'white' && newPosition[0] == this.board.length - 1 || piece.getFaction() == 'red' && newPosition[0] == 0;
    }

    toggleClickedTile(piece, clickedTile) {
        let classes = clickedTile.classList;
        let clicked = classes.contains('clicked');

        this.toggleMoveableTiles(piece, clicked);
        if (clicked) {
            classes.remove('clicked');
        } else {
            classes.add('clicked');
        }
    }

    toggleMoveableTiles(piece, clicked) {
        let tiles = piece.getMoveableTiles(this.board);

        for (const tile of tiles) {
            let gridTile = document.getElementById(tile + ' overlay');
            
            if (clicked) {
                gridTile.classList.remove('moveable');
                // cloneNode + replaceWith is being used because the function reference is lost with anonymous functions
                gridTile.replaceWith(gridTile.cloneNode(true));
            }
            else {
                gridTile.classList.add('moveable');
                gridTile.addEventListener("click", () => { this.moveableEvent(piece, tile) });
            }
        }
    }

    moveableEvent(piece, newTile) {
        let oldTile = document.getElementById(piece.getPosition() + ' overlay');
        this.toggleClickedTile(piece, oldTile);
       
        this.movePiece(piece, newTile);
    }
}
