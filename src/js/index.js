import {generateDeck, translateCard, distributeCard} from './generateDeck/generateDeck';
import {generatePlayer, generateLayout} from './controlCpu/controlCpu';

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


const calculateScore = (person) => { //intentar optimizar
    let score = 0;
    let ases = 0;
    person.hand.forEach(element => {
        if(translateCard(element.value) == 'A'){
            ases++;
            score += 11;
        }
        else score += translateCard(element.value)
        
        do {
            if(score > 21 && ases > 0){
                score -= 10;
            }
            ases--;
        } while(ases > 0)
    });

    person.score = score;
    return score;
}

const downCpuPlayer = (cpu) => {
    let score = 0;
    score += calculateScore(cpu);

    if(score >= 21){
        cpu.down = true;
    }
    else if(score >= 19){
        const random = Math.ceil((Math.random() * 10) + 1);
        if(random < 8 && random > 0);
            cpu.down = true;
    }
    else if(score >= 16){
        const random = Math.ceil((Math.random() * 3) + 1);
        if(random == 1);
            cpu.down = true;
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

const determinateWinner = (cpus, person, dealer) => { //terminar
    cpus = cpus.concat(person, dealer)
    let scores = sortJSON(cpus, 'score', 'desc');
    console.log(scores);

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
    }

    if(blackJack.length > 0){
        blackJack.forEach(element => {
            console.log(`Ganador ${element.name}`);
        })
    }
    
    winners.forEach(element => {
        console.log(`Ganador ${element.name}`);
    })
    
    loosers.forEach(element => {
        console.log(`Perdedores ${element.name}`);
    })
}

const makeBet = (cpu) => {
    let score = 0;
    score += calculateScore(cpu);

    if(score == 21){
        return cpu.bet =  Math.ceil((Math.random() * 10) + 5);
    }
    else if(score >= 19){
        return cpu.bet =  Math.ceil((Math.random() * 7) + 3);
    }
    else if(score >= 16 || score < 16){
        return cpu.bet =  Math.ceil((Math.random() * 3) + 1);
    }
}

const raiseBet = (person) => {
    if (!person.down){ // si la persona se planto, no se le muestra mas cartas
        if(person.id == 0){ // si es el jugador
            document.querySelector('.wager').innerHTML = `Apuesta: ${person.bet++}`
        }
        else if(person.id == 1){ // si es el dealer
            document.querySelector('.dealerWager').innerHTML = `Apuesta: ${makeBet(person)}`
        }

        else{
            document.querySelector(`.cpu${person.id}Wager`).innerHTML = `Apuesta: ${makeBet(person)}`
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
dom.distributeButton.addEventListener('click', cpuTurn);
dom.raiseButton.addEventListener('click', function(){
    raiseBet(player);
});
dom.downButton.addEventListener('click', function(){
    player.down = true;
    calculateScore(player)
    dom.askButton.remove();
    document.querySelector('.dealerButton').style.display = 'block';
    if(isGameFinished()){
        determinateWinner(cpuPlayers, player, dealer);
    }
});