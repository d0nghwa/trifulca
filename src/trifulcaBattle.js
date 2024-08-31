import { Trifulca } from "./trifulca.js";
import { game, width, height } from "./trifulcaMovement.js";
import { getCards } from "./deck.js";

const whiteElem = document.getElementById('white_cards');
const redElem = document.getElementById('red_cards');

const scoreElem = document.getElementById('scoreboard');

const battleElem = document.getElementById('battle');

const battleCanvasElem = document.getElementById('battle_background');
const battleContext = battleCanvasElem.getContext('2d');

// scoreboard styling
const FONT = 'normal normal normal 20px arial';

const BATTLINGBACKGROUND = "rgb(23 33 33 / 35%)";

let inBattle = false;
let attacker,
    defender,
    duels,
    offWins,
    defWins,
    offTile,
    defTile,
    offHand,
    defHand,
    selectedIndex;

/**
 * The mechanics of the battles are subject to change, hence they are in a
 * separate file
 */

function initBattle(defPos, offPos) {
    inBattle = true;

    attacker = game.turn; 
    defender = game.turn == 'RED' ? 'WHITE' : 'RED';
    duels    = 0;
    offWins  = 0;
    defWins  = 0;
    offTile  = offPos;
    defTile  = defPos;

    /**
     * wrapper to allow promises to access updating primitives
     * @see selectingCard
     */ 
    selectedIndex = {off : -1, def : -1};

    offHand = [];
    defHand = [];

    getCards(
        offHand, 
        game.getSupport(offPos, attacker) + game.getPiece(offPos).battle, 
        defHand, 
        game.getSupport(defPos, defender) + game.getPiece(defPos).battle
    );
}

/**
     * Compares two cards and determines the winner, and updates the current 
     * battle state
     * @param {{suit : string, value : int}} off    the attacking faction's card
     * @param {{suit : string, value : int}} def    the defending faction's card
     * @returns 'OFF' or 'DEF' depending on the which player has a higher
     *           card, or 'DRAW' if card values are equal
     */
function compareCard(off, def) {
    duels++;

    let diff = off.value - def.value;
    if (diff === 0) 
        return;
    
    diff > 0 
        ? offWins++ 
        : defWins++;
}

 /**
     * Checks the state of the current battle to determine the winner
     * @returns {'INCOMPLETE' | 'OFFVICTORY' | 'DEFVICTORY'}
     */
function checkBattleState() {
    if (duels < 3)
        return 'INCOMPLETE';

    let winDiff = offWins - defWins;
    if (winDiff !== 0)
        return winDiff > 0 
            ? 'OFFVICTORY' 
            : 'DEFVICTORY';
            
    if (defHand.length === 0)
        return 'OFFVICTORY';

    return 'DEFVICTORY';
}

function removeCard(hand, index) {
    if (hand.length == 0)
        return;

    // using splice to preserve array element order
    hand.splice(index, 1);
}

/*
RENDER BATTLE FUNCTIONS
 */

function updateScore() {
    scoreElem.innerHTML = offWins + ' - ' + defWins;
}

function displayBattle() {
    battleElem.style.display = 'flex';
    battleCanvasElem.style.display = 'block';
}

function renderBattle() {
    battleContext.fillStyle = BATTLINGBACKGROUND;
    battleContext.fillRect(0, 0, width, height);
}

function unrenderBattle() {
    battleContext.clearRect(0, 0, width, height);

    whiteElem.replaceChildren();
    redElem.replaceChildren();

    battleElem.style.display = 'none';
    battleCanvasElem.style.display = 'none';
}

function renderAllCards() {
    const off = attacker;

    let whiteHand, redHand;
    if (off == 'WHITE') {
        whiteHand = offHand;
        redHand = defHand;
    } else {
        whiteHand = defHand;
        redHand = offHand;
    }

    renderCards(whiteElem, whiteHand, 'WHITE');
    renderCards(redElem, redHand, 'RED');
}

function renderCards(elem, hand, faction) {
    elem.replaceChildren();
    for (const [idx, card] of hand.entries()) {
        const cardElem = document.createElement('div');
        cardElem.className = 'card';

        cardElem.innerHTML = card.suit + '' + card.value;

        cardElem.addEventListener('click', () => {
            clickedCard(idx, faction);
        })

        elem.appendChild(cardElem);
    }
}

function clickedCard(idx, faction) {
    // determine the faction of the clicked card
    const handElem = faction == 'RED'
        ? redElem
        : whiteElem;

    // unselect old card and select new card
    const currentCard = handElem.querySelector('.selected');
    if (currentCard != null)
        currentCard.classList.remove('selected');

    handElem.children[idx].classList.add('selected');

    faction == attacker
        ? selectedIndex.off = idx
        : selectedIndex.def = idx;
}

function selectingCard(attacking, button) {
    return new Promise((resolve, reject) => {
        button.onclick = () => {
            let index = attacking ? selectedIndex.off : selectedIndex.def;
            if (index == -1) 
                return;
        
            resolve(index);
        }
    });
}

async function dueling() {
    let [offButton, defButton] = attacker == 'RED'
        ? [ document.getElementById('red_button'), 
            document.getElementById('white_button')]
        : [ document.getElementById('white_button'), 
            document.getElementById('red_button')];

    let offSelected = selectingCard(true, offButton);
    let defSelected = selectingCard(false, defButton);

    let [offIndex, defIndex] = await Promise.all([offSelected, defSelected]);
    
    compareCard(offHand[offIndex], defHand[defIndex]);

    removeCard(offHand, offIndex);
    removeCard(defHand, defIndex);
}

export async function battling(defPos, offPos) {
    initBattle(defPos, offPos);

    displayBattle();
    updateScore();

    renderBattle();
    window.addEventListener('resize', renderBattle);

    while (checkBattleState() === 'INCOMPLETE') {
        renderAllCards();

        await dueling();

        updateScore();
    }

    unrenderBattle();

    return checkBattleState();
}