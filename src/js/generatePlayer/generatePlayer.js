let players = [];

const generatePlayer = (numPlayers) => {
    for(let i=1; i<=numPlayers; i++){
        players.push({
            id: `id${i}`,
            hand: [],
            score: 0
        })
    }
    return players;
}

const generateLayout = () => {
    let divMesa = document.querySelector('.mesa');

    for(let i=0; i<players.length; i++){
        let div = document.createElement('div');
        div.className = `player${players[i].id}`
        divMesa.appendChild(div);
    }

    for(let i=0; i<players.length; i++){
        let divPlayer = document.querySelector(`.player${players[i].id}`);

        let askButton = document.createElement('button');
        askButton.className = `askButton${players[i].id}`;
        askButton.textContent = 'pedir';
        divPlayer.appendChild(askButton);

        let downButton = document.createElement('button');
        downButton.className = `downButton${players[i].id}`;
        downButton.textContent = 'plantarse';
        divPlayer.appendChild(downButton);
    }

}

export {generatePlayer, generateLayout};