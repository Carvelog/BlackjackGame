import {generateDeck, distributeCard} from './generateDeck/generateDeck';
import {makeCpuBet, calculateScore, downCpuPlayer} from './controlCpu/controlCpu';
import {generateCpuPlayer, generateLayout, generatePlayers} from './generatePlayer/generatePlayer';

const dom = {
    askButton: document.getElementById("askButton"),
    downButton: document.getElementById("downButton"),
    raiseButton: document.getElementById("raiseButton"),
    distributeButton: document.getElementById("distributeButton")
}

const cpuPlayers = generateCpuPlayer(4);
const deck = generateDeck();
const dealer = generatePlayers('Dealer', 1);
const player = generatePlayers('Player', 0);

const makeHand = (parent, person) => {
    let div = document.createElement('div');
    div.className = `card ${person.hand[(person.hand.length)-1].stick}`;
    div.textContent = `${person.hand[(person.hand.length)-1].value}`;
    parent.appendChild(div);
}

const showHand = (person) => {
    if (!person.down){ // si la persona se planto, no se le muestra mas cartas
        if(person.id == 0){ // si es el jugador
            let parent = document.querySelector('.playerHand');
            makeHand(parent, person);
        }

        else if(person.id == 1){ // si es el jugador
            let parent = document.querySelector('.cpuHand');
            makeHand(parent, person);
        }

        else{
            let parent = document.querySelector(`.cpu${(person.id) - 1}`);
            parent = parent.lastElementChild;
            makeHand(parent, person);
        }
    }
}

const giveCard = (person) => {
    if(deck.length > 0){
        if (!person.down) // si la persona se planto no se le da mas cartas
            person.hand.push(distributeCard(deck));
    }
    else {
        dom.askButton.remove();
    }
}

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

const selectWinners = (arrayName, array) => {
    array.forEach(element => {
        let p = document.querySelector(`.name${element.id}`);
        p.className += ` ${arrayName}`;

        switch (arrayName) {
            case 'blackjack': p.textContent += ` Gana (blackjack) Total: ${element.bet * 1.5}`; 
            break;
            case 'loosers': p.textContent += ` Pierde Total: ${element.bet}`;
            break;
            case 'winner': p.textContent += ` Gana Total: ${element.bet * 1}`;
            break;
        }
    })
}

const determinateWinner = (cpus, person, dealer) => {
    let blackJack = [], winners = [], loosers = []
    cpus = cpus.concat(person, dealer)
    let playersSortedByScore = sortJSON(cpus, 'score', 'desc');
    console.log(playersSortedByScore)

    while(playersSortedByScore.length > 0){
        console.log(playersSortedByScore[0].id);
        console.log(playersSortedByScore[0].score);

        if(playersSortedByScore[0].score == 21 && playersSortedByScore[0].hand.length == 2){
            blackJack.push(playersSortedByScore[0]);
            playersSortedByScore = _.drop(playersSortedByScore);
        }
        else if(playersSortedByScore[0].score > 21 || playersSortedByScore[0].score < dealer.score){
            loosers.push(playersSortedByScore[0]);
            playersSortedByScore = _.drop(playersSortedByScore);
        }
        else if(playersSortedByScore[0].score >= dealer.score && playersSortedByScore[0].score < 21){
            winners.push(playersSortedByScore[0]);
            playersSortedByScore = _.drop(playersSortedByScore);
        }
        else {
            alert('Ha ocurrido un error.');
            playersSortedByScore = _.drop(playersSortedByScore);
        }
    }

    let div = document.querySelectorAll('.cpuHand');
    console.log(div)
    div.forEach(element => {
        element.className = "showAll"
    })
    
    if(blackJack.length > 0){
        selectWinners('blackjack', blackJack);
    }
    
    if(winners.length > 0){
        selectWinners('winner', winners);
    }
    
    if(loosers.length > 0){
        selectWinners('loosers', loosers);
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
    let allPlayers = [];
    allPlayers = allPlayers.concat(cpuPlayers, dealer, player);

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

generateLayout(cpuPlayers);
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
    document.querySelector('.hideElement').className = 'dealerButton';
    dom.askButton.remove();
});