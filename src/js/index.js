import {generateDeck, distributeCard} from './generateDeck/generateDeck';
import {generatePlayer, generateLayout, makeCpuBet, calculateScore, downCpuPlayer} from './controlCpu/controlCpu';

const dom = {
    askButton: document.getElementById("askButton"),
    downButton: document.getElementById("downButton"),
    raiseButton: document.getElementById("raiseButton"),
    distributeButton: document.getElementById("distributeButton")
}

const cpuPlayers = generatePlayer(4);
let deck = generateDeck();

let dealer = {
    name: 'Dealer',
    id: 1,
    hand: [],
    score: 0,
    bet: 0,
    down: false
};

let player = {
    name: 'Player',
    id: 0,
    hand: [],
    bet: 0,
    score: 0,
    down: false
};

let allPlayers = [], blackJack = [], winners = [], loosers = [];
allPlayers = allPlayers.concat(cpuPlayers, dealer, player);

const makeHand = (parent, person) => {
    let div = document.createElement('div');
    div.className = 'hand';
    div.textContent = `${person.hand[(person.hand.length)-1].value} ${person.hand[(person.hand.length)-1].stick}`;
    parent.appendChild(div);
}

/** @function showHand 
 * muestra la mano de los jugadores
*/
const showHand = (person) => {
    if (!person.down){ // si la persona se planto, no se le muestra mas cartas
        if(person.id == 0){ // si es el jugador
            let parent = document.querySelector('.playerHand');
            makeHand(parent, person);
        }

        else if(person.id == 1){ // si es el jugador
            let parent = document.querySelector('.dealerHand');
            makeHand(parent, person);
        }

        else{
            let parent = document.querySelector(`.player${person.id}`);
            makeHand(parent, person);
        }
    }
}

/** @function showHand 
 * reparte cartas a los jugadores
*/
const giveCard = (person) => {
    if (!person.down) // si la persona se planto no se le da mas cartas
        person.hand.push(distributeCard(deck));
}


/**
 * Ordenar JSON por medio del valor de una de sus propiedades
 * @author Fernando Magrosoto V. (@fmagrosoto)
 * @example sortJSON(json, propiedad, el orden)
 * @licence MIT
 * @version 1.0
 * @copyleft 2016 - Fernando Magrosoto V.
 * 
 */
const sortJSON = (data, key, orden) => {
    return data.sort(function (a, b){
        var x = a[key],
        y = b[key];

        if (orden === 'asc') {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }

        if (orden === 'desc') {
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
    });
}

const determinateWinner = (cpus, person, dealer) => { //terminar
    cpus = cpus.concat(person, dealer)
    let scores = sortJSON(cpus, 'score', 'desc');
    console.log(scores)

    while(scores.length > 0){
        if(scores[0].score == 21 && scores[0].hand.length == 2){
            blackJack.push(scores[0]);
            scores = _.drop(scores);
        }
        else if(scores[0].score > 21 || scores[0].score <= dealer.score){
            loosers.push(scores[0]);
            scores = _.drop(scores);
        }
        else if(scores[0].score > dealer.score && scores[0].score < 21){
            winners.push(scores[0]);
            scores = _.drop(scores);
        }
        else {
            alert('Ha ocurrido un error.');
            scores = _.drop(scores);
        }
    }

    if(blackJack.length > 0){
        blackJack.forEach(element => {
            let p = document.querySelector(`.name${element.id}`);
            p.className += ' blackjack';
            p.textContent += ` Gana (blackjack) Total: ${element.bet * 1.5}`; 
        })
    }
    
    if(winners.length > 0){
        winners.forEach(element => {
            let p = document.querySelector(`.name${element.id}`);
            p.className += ' winner';
            p.textContent += ` Gana Total: ${element.bet * 1}`;
        })
    }
    
    if(loosers.length > 0){
        loosers.forEach(element => {
            let p = document.querySelector(`.name${element.id}`);
            p.className += ' loosers';
            p.textContent += ` Pierde Total: ${element.bet}`;
        })
    }
}

const raiseBet = (person) => {
    if (!person.down){ // si la persona se planto, no se le muestra mas cartas
        if(person.id == 0){ // si es el jugador
            document.querySelector('.wager').innerHTML = `Apuesta: ${(person.bet += 1)}`
        }
        else if(person.id == 1){ // si es el dealer
            document.querySelector('.dealerWager').innerHTML = `Apuesta: ${makeCpuBet(person)}`
        }

        else{
            document.querySelector(`.cpu${person.id}Wager`).innerHTML = `Apuesta: ${makeCpuBet(person)}`
        }
    }
}

const initGame = () => {
    giveCard(player);
    showHand(player);
    giveCard(player);
    showHand(player);

    for(let i = 0; i<cpuPlayers.length; i++){
        giveCard(cpuPlayers[i]);
        showHand(cpuPlayers[i]);
        giveCard(cpuPlayers[i]);
        showHand(cpuPlayers[i]);
        raiseBet(cpuPlayers[i]);
        downCpuPlayer(cpuPlayers[i]);
    }

    giveCard(dealer);
    showHand(dealer);
    raiseBet(dealer);
    downCpuPlayer(dealer);
}

const isGameFinished = () => {
    let howManyDown = 0;

    allPlayers.forEach(element => {
        if(element.down) howManyDown++;
    });

    if(howManyDown == allPlayers.length) return true;
    else return false;
}

const cpuTurn = () => {
    giveCard(dealer);
    showHand(dealer);
    raiseBet(dealer);
    downCpuPlayer(dealer);
    
    for(let i = 0; i<cpuPlayers.length; i++){
        giveCard(cpuPlayers[i]);
        showHand(cpuPlayers[i]);
        raiseBet(cpuPlayers[i]);
        downCpuPlayer(cpuPlayers[i]);
    }

    if(isGameFinished()){
        determinateWinner(cpuPlayers, player, dealer);
    }
}

generateLayout();
initGame();

dom.askButton.addEventListener('click', function(){
    giveCard(player);
    showHand(player);
    cpuTurn();
});
dom.distributeButton.addEventListener('click', function(){
    cpuTurn();
    if(isGameFinished()){
        dom.distributeButton.remove();
    }
});
dom.raiseButton.addEventListener('click', function(){
    raiseBet(player);
});
dom.downButton.addEventListener('click', function(){
    player.down = true;
    calculateScore(player)
    document.querySelector('.dealerButton').style.display = 'block';
    dom.askButton.remove();
});