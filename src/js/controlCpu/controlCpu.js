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

const generateLayout = () => {
    let divMesa = document.querySelector('.mesa');

    for(let i=0; i<players.length; i++){
        let div = document.createElement('div');
        div.className = `player${players[i].id}`;
        div.innerHTML = `<p>CPU ${players[i].id-1}(Jugador)</p>
                         <pc class="cpu${players[i].id}Wager">Apuesta:</p>
                         <div class="hand">
                            <p>${players[i].hand}</p>
                         </div>`;
        divMesa.appendChild(div);
    }

}

export {generatePlayer, generateLayout};