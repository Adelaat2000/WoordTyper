const words = [];

async function loadWords() {
    try {
        const response = await fetch('./words.txt'); //haald de woorden uit een woordenlijst
        const text = await response.text();
        words.push(...text.split('\n').map(word => word.trim()).filter(word => word));
        createDiv(); // Begint het spel alleen wanneer de woorden klaar zijn
    } catch (error) {
    }
}

playerHpBar.value = 100;
let randomWord = '';

let enemyCounter = 0; // teller voor unieke id's
let score = 0;

function createDiv() {
    if (words.length === 0) {
        console.log('Words array is still empty!');
        return;
    }

    let randomIndex = Math.floor(Math.random() * words.length);
    randomWord = words[randomIndex];

    let div = document.createElement('div');
    let enemyWordSpan = document.createElement('span');
    let enemyImage = document.createElement('img');
    enemyImage.src = "./images/enemy.gif";
    enemyImage.style.width = '200px';
    enemyImage.style.height = '200px';

    div.setAttribute("id", `enemyContainer${enemyCounter}`);
    div.setAttribute("class", "enemyContainers");
    enemyWordSpan.setAttribute("id", `enemyWordSpan${enemyCounter}`);
    enemyWordSpan.innerHTML = randomWord;

    document.body.appendChild(div);
    div.appendChild(enemyWordSpan);
    div.appendChild(enemyImage);

    time = Math.max(1000, 5000 - (score * 250)); //moeilijkheidsgraad aanpassen
    setTimeout(createDiv, time);
    moveEnemy(div);
    enemyCounter++;
}

loadWords(); // Call the function to load the words

function moveEnemy(enemy) {
    let position = 0;
    const interval = setInterval(() => {
        position += 0.5; //veranderd de ren snelheid
        enemy.style.right = `${position}px`;

        const player = document.getElementById('playerContainer');
        const playerRect = player.getBoundingClientRect();
        const enemyRect = enemy.getBoundingClientRect();

        if (enemyRect.left <= playerRect.right && enemyRect.bottom >= playerRect.top) {
            clearInterval(interval);
            enemy.remove();
            takeDamage(10);
        }

        if (position > window.innerWidth) {
            clearInterval(interval);
            enemy.remove();
        }
    }, .1);
}

function takeDamage(amount) {
    playerHpBar.value -= amount;
    if (playerHpBar.value <= 0) {
        alert('Game Over!');
        window.location.reload();
    }
}

document.getElementById("textInput").addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const inputValue = event.target.value.trim().toLowerCase();
        for (let i = 0; i < enemyCounter; i++) {
            const enemyWordSpan = document.getElementById(`enemyWordSpan${i}`);
            if (enemyWordSpan) {
                const enemyWord = enemyWordSpan.innerHTML.trim().toLowerCase();
                if (enemyWord === inputValue) {
                    document.getElementById(`enemyContainer${i}`).remove();
                    event.target.value = '';
                    score++
                    document.getElementById("score").innerHTML = score
                    console.log(score)
                    return;
                }
            }
        }
        alert("Wrong!");
        takeDamage(10);
    }
});

createDiv()

//moeilijkheisgraad verhogen dit kan door moeilijkere woorden te gebruiken bij een hogere score
//performance verbeteren
//netter maken
//wpm counter
//reset enemies wanneer je dmg pakt


