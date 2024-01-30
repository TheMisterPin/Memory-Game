import { cardsFood } from './utils/database.js'; // Update the import extension

let selectedCards: Element[] = [];
let wonCards: Element[] = [];
const gameArea = document.querySelector('#gameArea') as HTMLElement;
const fullscreenModalBackdrop = document.getElementById('fullscreenModalBackdrop') as HTMLElement;
const modalBackdrop = document.getElementById('modalBackdrop') as HTMLElement;
const fullscreenBtn = document.getElementById('fullscreenBtn') as HTMLElement;
const modal = document.getElementById('gameModal') as HTMLElement;
const newGameButton = document.getElementById('newGameButton') as HTMLElement;
const timerDisplay = document.getElementById('timerDisplay') as HTMLElement;   
const scoreDisplay = document.getElementById('scoreDisplay') as HTMLElement;   
const modalTitle = document.getElementById('modalTitle') as HTMLElement;
const modaltText = document.getElementById('modalText') as HTMLElement;
const scoreboard = document.getElementById('scoreboard') as HTMLElement;

cardsFood.length = 6;
shuffleDeck(cardsFood);


const deck: string[] = [...cardsFood, ...cardsFood];
shuffleDeck(deck);


let timer: number;
let countdownInterval: number;
let score: number = 0;


function startTimer(duration: number): void {
    timer = duration;
    countdownInterval = setInterval(() => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        if (--timer < 0) {
            clearInterval(countdownInterval);
            gameOver(); }
    }, 1000);
}

function stopTimer(): void {
    clearInterval(countdownInterval);
}


// ----- Functions -----
function shuffleDeck(deck: any[]): void {
    deck.sort(() => Math.random() - 0.5);
}

function createCards(): void {
    gameArea.innerHTML = '';
    for (let i = 0; i < 12; i++) {
        const card = document.createElement('div');
        card.className = 'card';
        card.id = `card${i + 1}`;

        const front = document.createElement('div');
        front.className = 'front';

        const back = document.createElement('div');
        back.className = 'back';
        back.style.backgroundImage = `url('${deck[i]}')`;
        back.dataset.value = (deck.indexOf(deck[i]) % 6).toString();

        card.appendChild(front);
        card.appendChild(back);
        gameArea.appendChild(card);
    }
}

function initializeGame(): void {
    gameArea.style.display = 'grid';
    scoreboard.style.display = 'flex';
    createCards();
    startTimer(20); 

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.add('flipped');
            selectedCards.push(card);
            setTimeout(compare, 500);
        });
    });
}

function compare(): void {
    if (selectedCards.length === 2) {
        const back1 = selectedCards[0].querySelector('.back') as HTMLElement;
        const back2 = selectedCards[1].querySelector('.back') as HTMLElement;
        if (back1.style.backgroundImage === back2.style.backgroundImage) {
            selectedCards.forEach(card => card.classList.add('right'));
            addTimeToTimer(10); 
            addScore(10);
        } else {
            selectedCards.forEach(card => card.classList.add('wrong'));
        }
        setTimeout(outcome, 1500);
    }
}
function outcome(): void {
    selectedCards.forEach(card => {
        if (card.classList.contains('right')) {
            wonCards.push(card);
            card.classList.add('won');
            card.classList.remove('right', 'flipped');
        } else {
            card.classList.remove('flipped', 'wrong');
        }
    });
    selectedCards = [];

    if (wonCards.length === 12) {
        youWin();
    }
}
function addTimeToTimer(seconds: number): void {
    timer += seconds;
   
    const minutes = Math.floor(timer / 60);
    const remainingSeconds = timer % 60;
    timerDisplay.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
function addScore(points: number): void {
    score += points; 
    scoreDisplay.textContent = `${score}`
    console.log(score);
}
function resetScore(): void {
    score = 0;
    scoreDisplay.textContent = `${score}`;
}
function gameOver(): void {
    stopTimer();
    resetScore();
    gameArea.style.display = 'none';
    modalBackdrop.style.display = 'flex';
    modal.style.display = 'block';
    modalTitle.textContent = 'Game Over!';
    modaltText.textContent = 'You ran out of time!';
    modal.appendChild(newGameButton);
}

function youWin(): void {
    stopTimer();
    addScore(timer);
    gameArea.style.display = 'none';
    modalBackdrop.style.display = 'flex';
    modal.style.display = 'block';
    modalTitle.textContent = 'You Win!';
    modaltText.textContent = `Congratulations! Your score is ${score}`;
    modal.appendChild(newGameButton);
    resetScore();
}
function newGame(): void {
    shuffleDeck(cardsFood);
    const newDeck: string[] = [...cardsFood, ...cardsFood];
    shuffleDeck(newDeck);
    initializeGame();

    // Reset arrays
    selectedCards = [];
    wonCards = [];

    // Hide the modal
    modal.style.display = 'none';
    modalBackdrop.style.display = 'none';
}

fullscreenBtn.addEventListener('click', function () {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
            fullscreenModalBackdrop.style.display = 'none';
            modalBackdrop.style.display = 'flex';
        });
    }
});

newGameButton.addEventListener('click', newGame);