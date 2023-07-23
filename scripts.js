// import { cardsFood } from './database.js';
// cardsFood.sort(() => Math.random() - 0.5); 
// cardsFood.length = 6;

// const gameArea = document.querySelector('#gameArea');

// const deck = [...cardsFood, ...cardsFood];

// let selectedCards = [];
// let wonCards = []; // Here we define the wonCards array

// function preparation() {
//   for (let i = 0; i < 12; i++) {
//     const img = document.createElement('img');
//     img.className = 'card onTable'; // Adding 'onTable' to the class list
//     img.id = `card${i + 1}`;
//     img.src = deck[i];
//     img.dataset.value = deck.indexOf(deck[i]) % 6; 
//     gameArea.appendChild(img);
//   }
// }

// preparation();

// const cards = document.querySelectorAll('.card');
// cards.forEach(card => {
//   card.addEventListener('click', () => {
//     card.style.filter = 'brightness(50%)';
//     selectedCards.push(card);
//     compare();
//   });
// });

// function compare() {
//   if (selectedCards.length === 2) {
//     if (selectedCards[0].dataset.value === selectedCards[1].dataset.value) {
//       selectedCards.forEach(card => card.classList.toggle('right')); // Toggling 'right' class
//     } else {
//       selectedCards.forEach(card => card.classList.toggle('wrong')); // Toggling 'wrong' class
//     }
//     outcome(); // Call the outcome function
//   }
// }

// function outcome() {
//   selectedCards.forEach(card => {
//     if (card.classList.contains('right')) {
//       wonCards.push(card);
//       card.classList.toggle = 'won'; 
//     } else {
//       card.className = 'card'; 
//     }
//   });
//   selectedCards = []; 
// }

import { cardsFood } from './database.js';
cardsFood.sort(() => Math.random() - 0.5); 
cardsFood.length = 6;

const gameArea = document.querySelector('#gameArea');

const deck = [...cardsFood, ...cardsFood];

const formContainer = document.querySelector('.form-container');
const submitButton = document.getElementById('submitButton');

submitButton.addEventListener('click', function (event) {
  event.preventDefault(); // Prevent form submission

  formContainer.style.display = 'none'; // Hide the form container
  gameArea.style.display = 'grid'; // Show the game container
});



let selectedCards = [];
let wonCards = []; 


function preparation() {
  for (let i = 0; i < 12; i++) {
    const card = document.createElement('div');
    card.className = 'card';
    card.id = `card${i + 1}`;

    const front = document.createElement('div');
    front.className = 'front';

    const back = document.createElement('div');
    back.className = 'back';
    back.style.backgroundImage = `url('database/card (${i+1}).jpg')`;
    back.dataset.value = deck.indexOf(deck[i]) % 6; 

    card.appendChild(front);
    card.appendChild(back);

    gameArea.appendChild(card);
  }
}

preparation();

const cards = document.querySelectorAll('.card');
cards.forEach(card => {
  card.addEventListener('click', () => {
    card.classList.add('flipped');
    selectedCards.push(card);
    selectedCards.style.pointerEvents = 'none';
    compare();
  });
});

function compare() {
  if (selectedCards.length === 2) {
    if (selectedCards[0].querySelector('.back').dataset.value === selectedCards[1].querySelector('.back').dataset.value) {
      selectedCards.forEach(card => card.classList.add('right'));
    } else {
      selectedCards.forEach(card => card.classList.add('wrong'));
    }
    outcome();
  }
}

function outcome() {
  selectedCards.forEach(card => {
    if (card.classList.contains('right')) {
      wonCards.push(card);
      card.classList.replace('right', 'won');
    } else {
      card.classList.remove('flipped', 'wrong');
    }
  });
  selectedCards = [];

  if (wonCards.length === 12) {
    gameArea.style.display = 'none';
    const heading = document.createElement('h1');
    heading.textContent = `Your score is ${wonCards.length}`;
    document.body.appendChild(heading);
  }
}
