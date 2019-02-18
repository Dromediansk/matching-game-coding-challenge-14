const cards = document.querySelectorAll('.memory-card');
const start = document.querySelector('#start');
const reset = document.querySelector('#reset');
const movesBoard = document.querySelector('.moves');
const timeBoard = document.querySelector('.time');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let gameStarted = false;
let moves = 0;
let time = 0;
let interval = 0;

function startGame() {
    gameStarted = true;
    cards.forEach(card => card.addEventListener('click', flipCard));
    startTime();
}

function endGame() {
    endTime();
    gameStarted = false;
    cards.forEach(card => card.removeEventListener('click', flipCard));
}

//setting timer
// function startTime() {
//     interval = setInterval(timeElapse, 1000);
// }

// function timeElapse() {
//     time++;
//     timeBoard.textContent = time;
// }

// function endTime() {
//     clearInterval(interval);
// }
//end of setting timer

//shuffle cards
function shuffle() {
    setTimeout(() => {
        cards.forEach(card => {
            let randomPos = Math.floor(Math.random() * 16);
            card.style.order = randomPos;
        });
    }, 500);
}

function flipCard() {
    if (!gameStarted || lockBoard || this === firstCard) {
        return;
    }

    this.classList.add('flip');

    if (!hasFlippedCard) {
        //first click
        hasFlippedCard = true;
        firstCard = this;

        return;
    }
    //second click
    hasFlippedCard = false;
    secondCard = this;

    checkForMatch();
    incrementMoves();
}

function checkForMatch() {
    // do cards match?
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    isMatch ? disableCards() : unflipCards();
}

//it's a match
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}

 //not a match
function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 1500);
}

function incrementMoves() {
    moves++;
    movesBoard.textContent = moves;
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function resetGame() {
    endGame();
    //reset moves
    moves = 0;
    movesBoard.textContent = moves;
    //unflip all cards
    cards.forEach(card => {
        if (card.classList.contains('flip')) {
            card.classList.remove('flip');
        }
    })
    shuffle();
    //after 1,5s start new game
    setTimeout(() => {
        startGame();
    }, 1500);
}

window.onload = function() {
    shuffle();
}

start.addEventListener('click', startGame);
reset.addEventListener('click', resetGame);