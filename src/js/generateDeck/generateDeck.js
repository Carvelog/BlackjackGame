const palos = ['H', 'D', 'S', 'C'];
const courtCards = ['A', 'J', 'Q', 'K'];

const translateCard = (card) => {
    if (courtCards.includes(card) && card != 'A'){
        return 10;
    }
    else
        return card;
}

const distributeCard = (deck) => {
    return deck.pop();
}

const generateDeck = () => {
    let deck = [];
    palos.forEach(e => {
        for(let i = 2; i<=10; i++){
        deck.push({
            value: i,
            stick: e
        });
        }
        courtCards.forEach(i => {
        deck.push({
            value: i,
            stick: e
        });
        })
    });
    
    return _.shuffle(deck);
}

export {generateDeck, translateCard, distributeCard};