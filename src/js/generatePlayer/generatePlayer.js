const generatePlayers = (name, id) => {
    return {
        name: `${name}`,
        id: `${id}`,
        hand: [],
        score: 0,
        bet: 0,
        down: false
    }
}

const generateCpuPlayer = (numPlayers) => {
    let players = [];

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

const generateLayout = (players) => {
    let divMesa = document.querySelector('.players');

    for(let i=0; i<players.length; i++){
        let div = document.createElement('div');
        div.className = `player cpu${(players[i].id) - 1}`;
        div.innerHTML = `<p class="name${players[i].id}">CPU ${players[i].id-1}(Jugador)</p>
                         <p class="cpu${players[i].id}Wager">Apuesta:</p>
                         <div class="cpuHand"></div>`;
        divMesa.appendChild(div);
    }
}

export {generateCpuPlayer, generateLayout, generatePlayers};