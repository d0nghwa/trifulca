import { Trifulca } from "../src/trifulca.js"

function isMoveableEqual(a, b) {
    if (a.length != b.length) return false;

    for (let i = 0; i < a.length; i++) {
        if (a[i].status != b[i].status) return false;
        if (a[i].pos.r != b[i].pos.r || a[i].pos.c != b[i].pos.c) return false;
    }
    return true;
}

function isPosEqual(a, b) {
    return a.r === b.r && a.c === b.c;
}

// test('placePieces', () => {
//     let game = new Trifulca();
//     game.placePieces([
//         { type : 'CONQ', position : {r: 0, c: 4}, faction : 'WHITE' },
//         { type : 'DAME', position : {r: 0, c: 2}, faction : 'WHITE' },
//         { type : 'NITE', position : {r: 0, c: 1}, faction : 'WHITE' },
//         { type : 'CONQ', position : {r: 6, c: 2}, faction : 'RED' },
//         { type : 'DAME', position : {r: 6, c: 1}, faction : 'RED' },
//         { type : 'NITE', position : {r: 6, c: 0}, faction : 'RED' }
//     ]);

//     let board = game.toString();
//     let comp = 
//     '----------------\n' + 
//     '|  |Wk|Wd|  |Wc|\n' + 
//     '----------------\n' + 
//     '|  |  |  |  |  |\n' +
//     '----------------\n' + 
//     '|  |  |  |  |  |\n' +
//     '----------------\n' + 
//     '|  |  |  |  |  |\n' +
//     '----------------\n' + 
//     '|  |  |  |  |  |\n' +
//     '----------------\n' + 
//     '|  |  |  |  |  |\n' +
//     '----------------\n' + 
//     '|Rk|Rd|Rc|  |  |\n' +
//     '----------------\n';

//     expect(board == comp).toBeTruthy();
// })

test('getMoveable simple', () => {
    let game = new Trifulca();
    game.placePieces([
        { type : 'CONQ', position : {r: 0, c: 4}, faction : 'WHITE' },
        { type : 'DAME', position : {r: 1, c: 4}, faction : 'WHITE' },
        { type : 'NITE', position : {r: 0, c: 3}, faction : 'WHITE' },
        { type : 'CONQ', position : {r: 6, c: 2}, faction : 'RED' },
        { type : 'DAME', position : {r: 6, c: 1}, faction : 'RED' },
        { type : 'NITE', position : {r: 6, c: 4}, faction : 'RED' }
    ]);

    // let board = game.toString();
    // let board_comp = 
    // '----------------\n' + 
    // '|  |  |  |Wk|Wc|\n' + 
    // '----------------\n' + 
    // '|  |  |  |  |Wd|\n' +
    // '----------------\n' + 
    // '|  |  |  |  |  |\n' +
    // '----------------\n' + 
    // '|  |  |  |  |  |\n' +
    // '----------------\n' + 
    // '|  |  |  |  |  |\n' +
    // '----------------\n' + 
    // '|  |  |  |  |  |\n' +
    // '----------------\n' + 
    // '|  |Rd|Rc|  |Rk|\n' +
    // '----------------\n';
    // expect(board == board_comp).toBeTruthy();

    let moveable = game.getMoves({r: 0, c: 4});
    let comp = [
        { status : 'BLOCKED', pos : {r: 2, c: 4}},
        { status : 'BLOCKED', pos : {r: 0, c: 2}}
    ];
    expect(isMoveableEqual(moveable, comp)).toBeTruthy();

    moveable = game.getMoves({r: 1, c: 4});
    comp = [
        { status : 'EMPTY', pos : {r: 2, c: 4}},
        { status : 'EMPTY', pos : {r: 1, c: 3}}
    ];
    expect(isMoveableEqual(moveable, comp)).toBeTruthy();

    moveable = game.getMoves({r: 0, c: 3});
    comp = [
        { status : 'ALLY', pos : {r: 1, c: 4}},
        { status : 'EMPTY', pos : {r: 1, c: 2}}
    ];
    expect(isMoveableEqual(moveable, comp)).toBeTruthy();

    moveable = game.getMoves({r: 6, c: 4});
    comp = [
        { status : 'EMPTY', pos : {r: 5, c: 3}}
    ];
    expect(isMoveableEqual(moveable, comp)).toBeTruthy();

    moveable = game.getMoves({r: 6, c: 2});
    comp = [
        { status : 'EMPTY', pos : {r: 4, c: 2}},
        { status : 'BLOCKED', pos : {r: 6, c: 0}},
        { status : 'ALLY', pos : {r: 6, c: 4}}
    ];
    expect(isMoveableEqual(moveable, comp)).toBeTruthy();

    moveable = game.getMoves({r: 6, c: 1});
    comp = [
        { status : 'EMPTY', pos : {r: 5, c: 1}},
        { status : 'EMPTY', pos : {r: 6, c: 0}},
        { status : 'ALLY', pos : {r: 6, c: 2}}
    ];
    expect(isMoveableEqual(moveable, comp)).toBeTruthy();
})

test('getMoveable complex', () => {
    let game = new Trifulca();
    game.placePieces([
        { type : 'CONQ', position : {r: 4, c: 2}, faction : 'WHITE' },
        { type : 'DAME', position : {r: 6, c: 1}, faction : 'WHITE' },
        { type : 'NITE', position : {r: 0, c: 3}, faction : 'WHITE' },
        { type : 'CONQ', position : {r: 6, c: 2}, faction : 'RED' },
        { type : 'DAME', position : {r: 6, c: 3}, faction : 'RED' },
        { type : 'NITE', position : {r: 6, c: 4}, faction : 'RED' }
    ]);
    
    // let board = game.toString();
    // let board_comp = 
    // '----------------\n' + 
    // '|  |  |  |Wk|  |\n' + 
    // '----------------\n' + 
    // '|  |  |  |  |  |\n' +
    // '----------------\n' + 
    // '|  |  |  |  |  |\n' +
    // '----------------\n' + 
    // '|  |  |  |  |  |\n' +
    // '----------------\n' + 
    // '|  |  |Wc|  |  |\n' +
    // '----------------\n' + 
    // '|  |  |  |  |  |\n' +
    // '----------------\n' + 
    // '|  |Wd|Rc|Rd|Rk|\n' +
    // '----------------\n';
    // expect(board == board_comp).toBeTruthy();

    let moveable = game.getMoves({r: 4, c: 2});
    let comp = [
        { status : 'ENEMY', pos : {r: 6, c: 2}},
        { status : 'EMPTY', pos : {r: 4, c: 4}},
        { status : 'EMPTY', pos : {r: 4, c: 0}}
    ];
    expect(isMoveableEqual(moveable, comp)).toBeTruthy();

    moveable = game.getMoves({r: 6, c: 2});
    comp = [
        { status : 'ENEMY', pos : {r: 4, c: 2}},
        { status : 'BLOCKED', pos : {r: 6, c: 0}},
        { status : 'BLOCKED', pos : {r: 6, c: 4}}
    ];
    expect(isMoveableEqual(moveable, comp)).toBeTruthy();
})

test('getSupport', () => {
    let game = new Trifulca();
    game.placePieces([
        { type : 'CONQ', position : {r: 1, c: 2}, faction : 'WHITE' },
        { type : 'DAME', position : {r: 6, c: 1}, faction : 'WHITE' },
        { type : 'NITE', position : {r: 0, c: 3}, faction : 'WHITE' },
        { type : 'CONQ', position : {r: 6, c: 2}, faction : 'RED' },
        { type : 'DAME', position : {r: 6, c: 3}, faction : 'RED' },
        { type : 'NITE', position : {r: 6, c: 4}, faction : 'RED' }
    ]);

    expect(game.getSupport({r: 1, c: 2}, 'WHITE') == 2).toBeTruthy();
    expect(game.getSupport({r: 0, c: 3}, 'WHITE') == 4).toBeTruthy();
    expect(game.getSupport({r: 0, c: 3}, 'RED') == 4).toBeFalsy();
    expect(game.getSupport({r: 6, c: 1}, 'WHITE') == 0).toBeTruthy();
    expect(game.getSupport({r: 6, c: 1}, 'RED') == 4).toBeTruthy();
    expect(game.getSupport({r: 6, c: 2}, 'RED') == 3).toBeTruthy();
    expect(game.getSupport({r: 6, c: 3}, 'RED') == 6).toBeTruthy();
    expect(game.getSupport({r: 6, c: 4}, 'RED') == 3).toBeTruthy();
    expect(game.getSupport({r: 3, c: 0}, 'RED') == 0).toBeTruthy();
    expect(game.getSupport({r: 3, c: 4}, 'WHITE') == 0).toBeTruthy();

    game.board[0][3].status = 'STUNNED';

    expect(game.getSupport({r: 1, c: 2}, 'WHITE') == 0).toBeTruthy();
})

test('battle rounds simple', () => {
    let game = new Trifulca();
    game.placePieces([
        { type : 'CONQ', position : {r: 2, c: 2}, faction : 'WHITE' },
        { type : 'DAME', position : {r: 4, c: 2}, faction : 'RED' }
    ]);
    
    // let board = game.toString();
    // let board_comp = 
    // '----------------\n' + 
    // '|  |  |  |  |  |\n' + 
    // '----------------\n' + 
    // '|  |  |  |  |  |\n' +
    // '----------------\n' + 
    // '|  |  |Wc|  |  |\n' +
    // '----------------\n' + 
    // '|  |  |  |  |  |\n' +
    // '----------------\n' + 
    // '|  |  |Rd|  |  |\n' +
    // '----------------\n' + 
    // '|  |  |  |  |  |\n' +
    // '----------------\n' + 
    // '|  |  |  |  |  |\n' +
    // '----------------\n';
    // expect(board == board_comp).toBeTruthy();

    let moveable = game.getMoves({r: 2, c: 2});
    let comp = [
        { status : 'ENEMY', pos : {r: 4, c: 2}},
        { status : 'EMPTY', pos : {r: 2, c: 4}},
        { status : 'EMPTY', pos : {r: 2, c: 0}}
    ];
    expect(isMoveableEqual(moveable, comp)).toBeTruthy();

    game.initBattle({r: 4, c: 2}, {r: 2, c: 2});

    expect(
        game.battle.state       == 'ACTIVE' &&
        game.battle.duels       == 0 &&
        game.battle.offWins     == 0 &&
        game.battle.defWins     == 0 &&
        isPosEqual(game.battle.defencePos, {r: 4, c: 2}) &&
        isPosEqual(game.battle.offencePos, {r: 2, c: 2})
    ).toBeTruthy();
    
    let result = game.compareCard(
        { suit : 'hearts', value : 3 },
        { suit : 'diamonds', value : 9 }
    );
    expect(result == 'DEF').toBeTruthy();

    expect(
        game.battle.duels       == 1 &&
        game.battle.offWins     == 0 &&
        game.battle.defWins     == 1
    ).toBeTruthy();

    expect(game.checkBattle() == 'INCOMPLETE').toBeTruthy();

    result = game.compareCard(
        { suit : 'clubs', value : 8 },
        { suit : 'diamonds', value : 8 }
    );
    expect(result == 'DRAW').toBeTruthy();

    expect(
        game.battle.duels       == 2 &&
        game.battle.offWins     == 0 &&
        game.battle.defWins     == 1
    ).toBeTruthy();

    expect(game.checkBattle() == 'INCOMPLETE').toBeTruthy();

    result = game.compareCard(
        { suit : 'spades', value : 10 },
        { suit : 'spades', value : 2 }
    );
    expect(result == 'OFF').toBeTruthy();

    expect(
        game.battle.duels       == 3 &&
        game.battle.offWins     == 1 &&
        game.battle.defWins     == 1
    ).toBeTruthy();

    expect(game.checkBattle() == 'INCOMPLETE').toBeTruthy();

    result = game.compareCard(
        { suit : 'clubs', value : 1 },
        { suit : 'hearts', value : 1 }
    );
    expect(result == 'DRAW').toBeTruthy();

    expect(
        game.battle.duels       == 4 &&
        game.battle.offWins     == 1 &&
        game.battle.defWins     == 1
    ).toBeTruthy();

    expect(game.checkBattle() == 'INCOMPLETE').toBeTruthy();

    result = game.compareCard(
        { suit : 'diamonds', value : 6 },
        { suit : 'clubs', value : 5 }
    );
    expect(result == 'OFF').toBeTruthy();

    expect(
        game.battle.state       == 'ACTIVE' &&
        game.battle.duels       == 5 &&
        game.battle.offWins     == 2 &&
        game.battle.defWins     == 1 &&
        isPosEqual(game.battle.defencePos, {r: 4, c: 2}) &&
        isPosEqual(game.battle.offencePos, {r: 2, c: 2})
    ).toBeTruthy();

    expect(game.checkBattle() == 'OFFVICTORY').toBeTruthy();

    game.finishBattle();

    expect(
        game.battle.state       == 'INACTIVE' &&
        game.battle.duels       == 0 &&
        game.battle.offWins     == 0 &&
        game.battle.defWins     == 0 &&
        game.battle.defencePos  == null &&
        game.battle.offencePos  == null
    ).toBeTruthy();
})

