const cards = document.querySelectorAll('.memory-card');
const start = document.querySelector('#start');
const reset = document.querySelector('#reset');
const movesBoard = document.querySelector('#moves');
const time = document.querySelector('#time');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let gameStarted = false;
let moves = timer = seconds = 0;
let t;

//setting timer
function add() {
    seconds++;
    time.textContent = seconds;
}

function startTimer() {
    t = setInterval(add, 1000);
}

function stopTimer() {
    clearInterval(t);
}

function clearTimer(){
    stopTimer();
    time.textContent = 0;
    seconds = 0;
}
//end of setting timer

function startGame() {
    if (!gameStarted) {
        cards.forEach(card => card.addEventListener('click', flipCard));
        startTimer();
        gameStarted = true;
    }
}

function endGame() {
    stopTimer();
    gameStarted = false;
    cards.forEach(card => card.removeEventListener('click', flipCard));
}

function resetGame() {
    endGame();
    clearTimer();
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

function checkForEndGame() {
    let cardsArr = Array.from(cards);
    let flippedCards = cardsArr.every((card) => {
        return card.classList.contains('flip');
    })
    if (flippedCards) {
        endGame();
    }
}

//it's a match
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
    checkForEndGame();
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

//moves
function incrementMoves() {
    moves++;
    movesBoard.textContent = moves;
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

window.onload = function() {
    shuffle();
}

start.addEventListener('click', startGame);
reset.addEventListener('click', resetGame);