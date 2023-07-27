
import { cardsFood } from './database.js';
window.addEventListener('load', function () {
  const user = JSON.parse(localStorage.getItem('user'));
  // if (user) {
  //   document.getElementById('usernameDisplay').innerHTML = user.name;
  // }
});


//global variables
const newUserButton = document.getElementById('newUserButton');
const gameArea = document.querySelector('#gameArea');
const startButton = document.getElementById('submitButton');
const deck = [...cardsFood, ...cardsFood];

//deck building
deck.sort(() => Math.random() - 0.5);
cardsFood.sort(() => Math.random() - 0.5);
cardsFood.length = 6;




// New User Creation
newUserButton.addEventListener('click', function () {
  const formContainer = document.getElementById('form-container');
  formContainer.innerHTML = `
  <div id="newUserForm">
  <h1 id="nameLabel">Pick your username:</h1>
      <input type="text" id="newUsername">
      <h1 id="avatarLabel"> Pick your avatar:</h1>
            <div id="avatarSelection">
        ${Array.from({ length: 6 }, (_, i) => `<img src="media/avatars/avatar (${i + 1}).jpg" class="avatar-option" data-avatar="${i + 1}">`).join('')}
        <button type="button" id="saveUserButton">Save</button>
         </div>
    </div>
  `;
  //select avatar and username
  const avatarOptions = document.querySelectorAll('.avatar-option');
  let selectedAvatar;
  let username = '';

  avatarOptions.forEach(option => {
    option.addEventListener('click', function () {
      this.classList.add('selected');
      selectedAvatar = this.dataset.avatar;
      avatarOptions.forEach(otherOption => {
        if (otherOption !== this) {
          otherOption.classList.remove('selected');
        }
      });
      checkUserInput();
    });
  });

  document.getElementById('newUsername').addEventListener('input', function () {
    username = this.value;
    checkUserInput();
  })

  const saveUserButton = document.getElementById('saveUserButton');
  function checkUserInput() {
    if (selectedAvatar && username !== '') {
      saveUserButton.style.display = 'block'; // changed from 'flex' to 'block'
    } else {
      saveUserButton.style.display = 'none';
    }
  }
  // add new user to json in local storage
  saveUserButton.addEventListener('click', function () {

    const username = document.getElementById('newUsername').value;
    const selectedAvatar = document.querySelector('.avatar-option.selected').dataset.avatar;
    const user = {
      username,
      avatar: selectedAvatar,
      gamesPlayed: 0,
      victories: 0,
      highScore: 0

    };
    localStorage.setItem('user', JSON.stringify(user));

    //  const userDisplaySelect = document.querySelector('.userDisplay');
    // const newOption = document.createElement('option');
    // newOption.value = user.username;
    // newOption.text = user.username;
    // userDisplaySelect.add(newOption);
    // saveUserButton.classList.add('hidden')
    // formContainer.innerHTML = "<H1> Welcome ${'username'} </H1>";

    formContainer.innerHTML = '';
    formContainer.style.display = 'none';
    gameArea.style.display = 'grid';
     setTimeout(preparation, 1500);
  });
});






// start the game
startButton.addEventListener('click', function (event) {
  event.preventDefault();
  formContainer.style.display = 'none';
  gameArea.style.display = 'grid';
});


                          // game phasefunctions 
/////////////////////////////////////////////////////////////// 

// strarts collecting game data
let selectedCards = [];
let wonCards = [];
let totalTime =  3 * 60; // in seconds
let timeLeft = totalTime;
let timerId = null;
let score = 0;


// TIMER //
function startTimer() {
  timerId = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(timerId);
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerId);
  score += timeLeft * 23;
}

//SETS THE GAME TABLE
function preparation() {
  for (let i = 0; i < 12; i++) {
    const card = document.createElement('div');
    card.className = 'card';
    card.id = `card${i + 1}`;
    const front = document.createElement('div');
    front.className = 'front';
    const back = document.createElement('div');
    back.className = 'back';
    back.style.backgroundImage = `url('${deck[i]}')`;
    back.dataset.value = deck.indexOf(deck[i]) % 6;
    card.appendChild(front);
    card.appendChild(back);
    gameArea.appendChild(card);
    startTimer()
  }};

const cards = document.querySelectorAll('.card');
cards.forEach(card => {
  card.addEventListener('click', () => {
    card.classList.add('flipped');
    selectedCards.push(card);

    setTimeout(compare, 500);
  });
});

function compare() {
  if (selectedCards.length === 2) {
    const back1 = selectedCards[0].querySelector('.back');
    const back2 = selectedCards[1].querySelector('.back');
    if (back1.style.backgroundImage === back2.style.backgroundImage) {
      selectedCards.forEach(card => card.classList.add('right'));
    } else {
      selectedCards.forEach(card => card.classList.add('wrong'));
    }
    setTimeout(outcome, 1500);
  }
}

function outcome() {
  selectedCards.forEach(card => {
    if (card.classList.contains('right')) {
      wonCards.push(card);
      card.classList.add('won');
      card.classList.remove('right');
      card.classList.remove('flipped');

    } else {
      card.classList.remove('flipped', 'wrong');
    }
  });
  selectedCards = [];

  if (wonCards.length === 12) {
    gameArea.style.display = 'none';
    stopTimer()
    gameArea.textContent = `Your score is ${wonCards.length}`;
    gameArea.appendChild(heading);

  }
}