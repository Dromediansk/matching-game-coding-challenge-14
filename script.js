//selecting elements
const cards = document.querySelectorAll('.memory-card');
const start = document.querySelector('#start');
const reset = document.querySelectorAll('.reset');
const movesBoard = document.querySelectorAll('.moves');
const time = document.querySelectorAll('.time');
const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");

//defining variables
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let gameStarted = false;
let moves = timer = seconds = 0;
let t;

//timer section
function add() {
    seconds++;
    time.forEach(el => el.textContent = seconds);
}

function startTimer() {
    t = setInterval(add, 1000);
}

function stopTimer() {
    clearInterval(t);
}

function clearTimer(){
    stopTimer();
    time.forEach(el => el.textContent = 0);
    seconds = 0;
}
//end of timer section

function startGame() {
    if (!gameStarted) {
        start.removeEventListener('click', startGame);
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
    movesBoard.forEach((el) => el.textContent = moves);
    //unflip all cards
    cards.forEach(card => {
        if (card.classList.contains('flip')) {
            card.classList.remove('flip');
        }
    })
    closeModal();
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
        openModal();
    }
}

//modal section
function openModal() {
    setTimeout(() => {
        modal.classList.add("show-modal");
    }, 1000)
}

function closeModal() {
    modal.classList.remove("show-modal");
}

function windowOnClick(event) {
    if (event.target === modal) {
        closeModal();
    }
}
//end of modal section

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
    movesBoard.forEach(el => el.textContent = moves);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

window.onload = function() {
    shuffle();
}

//event listeners
start.addEventListener('click', startGame);
reset.forEach(button => button.addEventListener("click", resetGame))
closeButton.addEventListener("click", closeModal);
window.addEventListener("click", windowOnClick);