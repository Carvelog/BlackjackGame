import {generateDeck, translateCard, distributeCard} from './generateDeck/generateDeck';
import {generatePlayer, generateLayout} from './controlCpu/controlCpu';

const dom = {
    askButton: document.getElementById("askButton"),
    downButton: document.getElementById("downButton")
}

const cpuPlayers = generatePlayer(5);

let deck = generateDeck();

let dealer = {
    id: 1,
    hand: [],
    score: 0,
    down: false
};

let player = {
    id: 0,
    hand: [],
    score: 0
};

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

//intentar optimizar
const calculateScore = (person) => {
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

    if(cpu.down){
        //imperdor que ese jugador pida mas cartas
        //calculateScore(cpu);
    }
} 

const determinateWinner = () => {
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
        downCpuPlayer(cpuPlayers[i]);
    }

    giveCard(dealer);
    showHand(dealer);
}


const startTurn = () => {
    giveCard(player);
    showHand(player);
    
    giveCard(dealer);
    showHand(dealer);
    
    for(let i = 0; i<cpuPlayers.length; i++){
        giveCard(cpuPlayers[i]);
        showHand(cpuPlayers[i]);
        downCpuPlayer(cpuPlayers[i]);
    }

}


generateLayout();
initGame();

dom.askButton.addEventListener('click', startTurn);
dom.downButton.addEventListener('click', function(){
    console.log(calculateScore(player));
    //finalizar juego
    //determinateWinner();
});

