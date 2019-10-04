let players = [];

const generatePlayer = (numPlayers) => {
    for(let i=2; i<=numPlayers+1; i++){
        players.push({
            id: i,
            hand: [],
            down: false,
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
                         <div class="hand">
                            <p>${players[i].hand}</p>
                         </div>`;
        divMesa.appendChild(div);
    }

}

export {generatePlayer, generateLayout};