import {translateCard} from '../generateDeck/generateDeck';

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

export {makeCpuBet, downCpuPlayer, calculateScore};