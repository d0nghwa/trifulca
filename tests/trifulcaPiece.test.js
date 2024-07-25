import { Piece } from "./../src/trifulcaPiece.js";

function isEqual(a, b) {
    if (a === b) return true;
    if (a.length !==  b.length) return false;
    
    for (let i = 0; i < a.length; i++) {
        if (a[i].r !== b[i].r || a[i].c !== b[i].c)
            return false;
    }
    return true;
}

test('test moveable tiles basic', () => {
    let board = [];

    let row;
    while (board.length < 7) {
        board.push(row = []);
        while (row.push(null) < 5); 
    }
    
    const conq = new Piece(
        {r: 0, c: 0}, 
        'WHITE', 
        'CONQ'
    );
    const conq_moves = conq.getMoveableTiles(board);
    expect(isEqual(conq_moves, [
        {r: 2, c: 0},
        {r: 0, c: 2}
    ])).toBeTruthy();
    expect(isEqual(conq_moves, [
        {r: 0, c: 2}
    ])).toBeFalsy();

    const nite = new Piece(
        {r: 0, c: 4}, 
        'WHITE', 
        'NITE'
    );
    const nite_moves = nite.getMoveableTiles(board);
    expect(isEqual(nite_moves, [
        {r: 1, c: 3}
    ])).toBeTruthy();
    expect(isEqual(nite_moves, [])).toBeFalsy();

    const dame = new Piece(
        {r: 6, c: 2},
        'RED', 
        'DAME'
    );
    const dame_moves = dame.getMoveableTiles(board);
    expect(isEqual(dame_moves, [
        {r: 5, c: 2},
        {r: 6, c: 1},
        {r: 6, c: 3}
    ])).toBeTruthy();
})