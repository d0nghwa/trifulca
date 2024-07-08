import { Conquistador, Dame, Knight } from "./../code/trifulcaPiece.js";
import { coordEquals } from "./utils.js";

test('test moveable tiles basic', () => {
    let board = [];

    let row;
    while (board.length < 7) {
        board.push(row = []);
        while (row.push(null) < 5); 
    }
    
    const conq = new Conquistador([0,0], 'white');
    const conq_moves = conq.getMoveableTiles(board);
    expect(coordEquals(conq_moves, [[0,2],[2,0]])).toBeTruthy();
    expect(coordEquals(conq_moves, [[2,0],[0,2]])).toBeTruthy();
    expect(coordEquals(conq_moves, [[0,2]])).toBeFalsy();

    const nite = new Knight([0,4], 'white');
    const nite_moves = nite.getMoveableTiles(board);
    expect(coordEquals(nite_moves, [[1,3]])).toBeTruthy();
    expect(coordEquals(nite_moves, [])).toBeFalsy();

    const dame = new Dame([6,2], 'red');
    const dame_moves = dame.getMoveableTiles(board);
    expect(coordEquals(dame_moves, [[6,1],[6,3],[5,2]])).toBeTruthy();
})