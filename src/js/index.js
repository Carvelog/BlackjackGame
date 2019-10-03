import {generateDeck, translateCard} from './generateDeck/generateDeck';
import distributeCard from './distributeCard/distributeCard';
import {generatePlayer, generateLayout } from './generatePlayer/generatePlayer';

const dom = {
    askButtonid1: document.querySelector(".askButtonid1"),
    downButtonid1: document.querySelector(".downButtonid1")
}

let deck = generateDeck(); 
let dealer = [];
let player = [];

/** @function showHand 
 * muestra la mano de los jugadores
*/
const showHand = (person) => {
    console.log(person);
}

/** @function showHand 
 * reparte cartas a los jugadores
*/
const giveCard = (person) => {
    person.push(distributeCard(deck));
}

const determinateWinner = () => {
}

const calculateScore = (person) => {
    let score = 0;
    let ases = 0;
    person.forEach(element => {
        if(translateCard(element.value) == 'A'){
            ases++;
            score += 11;
        }
        else score += translateCard(element.value)
        
        do {
            if(score > 21 && ases > 1){
                score -= 10;
            }
            ases--;
        } while(ases > 0)
    });

    return score;
}

const startGame = () => {
    giveCard(player);
    showHand(player);
    console.log(calculateScore(player));
}

generatePlayer(5)
generateLayout();


dom.askButtonid1.addEventListener('click', startGame);
dom.downButtonid1.addEventListener('click', function(){
    console.log(calculateScore(player));
} );



//falta que el addEventListener pille los click de los botones generados