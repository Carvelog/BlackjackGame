import {translateCard} from '../generateDeck/generateDeck';
let players = [];

const generatePlayer = (numPlayers) => {
    for(let i=2; i<=numPlayers+1; i++){
        players.push({
            name: `CPU ${i-1}`,
            id: i,
            hand: [],
            down: false,
            bet: 0,
            score: 0
        })
    }
    return players;
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

const makeCpuBet = (cpu) => {
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

const generateLayout = () => {
    let divMesa = document.querySelector('.players');

    for(let i=0; i<players.length; i++){
        let div = document.createElement('div');
        div.className = `player p${players[i].id}`;
        div.innerHTML = `<div class="cpuHand"></div>
                         <p class="name${players[i].id}">CPU ${players[i].id-1}(Jugador)</p>
                         <p class="cpu${players[i].id}Wager">Apuesta:</p>`;
        divMesa.appendChild(div);
    }

}

export {generatePlayer, generateLayout, makeCpuBet, downCpuPlayer, calculateScore};