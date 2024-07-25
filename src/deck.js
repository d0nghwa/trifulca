export function getCards(redCards, numRed, whiteCards, numWhite) {
    const suits = ['diamonds', 'clubs', 'hearts', 'spades'];
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    let deck = [];
    for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push({
                suit : suits[i],
                value : values[j]
            });
        }
    }

    let i = 0;
    while (i < numRed || i < numWhite) {
        if (i < numRed) {
            dealCard(deck, redCards);
        }
        if (i < numWhite) {
            dealCard(deck, whiteCards);
        }
        i++;
    }
}

function dealCard(deck, hand) {
    let cardIndex = Math.floor(Math.random() * deck.length);
    
    let card = deck[cardIndex];
    deck[cardIndex] = deck[deck.length - 1];
    deck[deck.length - 1] = card;

    hand.push(deck.pop());
}