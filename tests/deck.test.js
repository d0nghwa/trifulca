import { getCards } from "./../src/deck.js";

const suits = ['diamonds', 'clubs', 'hearts', 'spades'];
function cardSort(x, y) {
    return x.suit == y.suit ? x.value - y.value : suits.indexOf(x.suit) - suits.indexOf(y.suit);
}

test('getCards basic', () => {
    let red = [];
    let white = [];

    getCards(red, 5, white, 4);

    expect(red.length == 5).toBeTruthy();
    expect(white.length == 4).toBeTruthy();

    // visual inspection:
    
    // red.sort(cardSort);
    // white.sort(cardSort);

    // let str = 'Red:\n';
    // red.forEach((elem) => {
    //     str += elem.suit + ' ' + elem.value + '\n';
    // })
    // str += 'White:\n'
    // white.forEach((elem) => {
    //     str += elem.suit + ' ' + elem.value + '\n';
    // })
    // console.log(str);
})

test('getCards check preservation of deck', () => {
    let red = [];
    let white = [];

    getCards(red, 40, white, 0);

    expect(red.length == 40).toBeTruthy();
    expect(white.length == 0).toBeTruthy();

    // red.sort(cardSort);
    // white.sort(cardSort);

    // let str = 'Red:\n';
    // red.forEach((elem) => {
    //     str += elem.suit + ' ' + elem.value + '\n';
    // })
    // str += 'White:\n'
    // white.forEach((elem) => {
    //     str += elem.suit + ' ' + elem.value + '\n';
    // })
    // console.log(str);
})