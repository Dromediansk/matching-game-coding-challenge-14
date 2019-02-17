const cards = document.querySelectorAll('.memory-card');
const start = document.querySelector('#start');
const reset = document.querySelector('#reset');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let gameStarted = false;

function startGame() {
    gameStarted = true;
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

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

(function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
    });
})();

function resetGame() {
    console.log('click');
}

cards.forEach(card => card.addEventListener('click', flipCard));
start.addEventListener('click', startGame);
reset.addEventListener('click', resetGame);