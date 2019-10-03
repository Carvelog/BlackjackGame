const palos = ['C', 'D', 'P', 'T'];

/** @function translateCard
 * devuelve el valor de las figuras en el juego
 * @param card recibe una figura
*/
const translateCard = (card) => {
  switch(card){
    case 'J': return 10; 
    break;
    case 'Q': return 10;
    break;
    case 'K': return 10;
    break;
    default: return card //si no es una figura es una carta normal, por lo que la devolvemos
    ;
  }
}

/** @function generateDeck 
 * crea la baraja de cartas y la mezcla
*/
const generateDeck = () => {
  let courtCards = ['A', 'J', 'Q', 'K'];
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

export {generateDeck, translateCard};