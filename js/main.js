import {
  shuffle,
  setTimerText,
  showPlayAgainButton,
  hidePlayAgainButton,
} from './utils.js';

// const variables
const GAME_STATUS = {
  PLAYING: 'playing',
  BLOCKING: 'blocking',
  FINISHED: 'finished',
};
const PAIRS_COUNT = 8;
const GAME_TIME = 30;

//global variables
let selections = [];
let gameStatus = GAME_STATUS.PLAYING;

// selectors:
const ulElement = document.querySelector('.card-list');
const liElementList = document.querySelectorAll('.card-list > li');
const playGameButton = document.querySelector('.game__playBtn');

//set timer
const handleTimerChange = (second) => {
  const fullSecond = `0${second}`.slice(-2);
  setTimerText(fullSecond);
};
const handleTimerFinish = () => {
  gameStatus = GAME_STATUS.FINISHED;
  setTimerText('GAME OVER!');
  showPlayAgainButton();
};

const createTimer = ({ seconds, onChange, onFinish }) => {
  let intervalId = null;

  function start() {
    clear();
    let currentSecond = seconds;
    intervalId = setInterval(() => {
      // if (onChange) onChange(currentSecond)
      onChange?.(currentSecond);

      currentSecond--;

      if (currentSecond < 0) {
        clear();
        onFinish?.();
      }
    }, 1000);
  }

  function clear() {
    clearInterval(intervalId);
  }

  return {
    start,
    clear,
  };
};

let timer = createTimer({
  seconds: GAME_TIME,
  onChange: handleTimerChange,
  onFinish: handleTimerFinish,
});

// handle card click
const handleCardClick = (liElement) => {
  const shouldBlockClick = [
    GAME_STATUS.BLOCKING,
    GAME_STATUS.FINISHED,
  ].includes(gameStatus);

  const isClicked = liElement.classList.contains('active');

  if (!liElement || isClicked || shouldBlockClick) return;

  // add "active" class to liElement (clicked cell) for showing picture
  liElement.classList.add('active');

  // save clicked cell to selection
  selections.push(liElement);
  if (selections.length < 2) return;

  // check match
  const firstCard = selections[0].dataset.id;
  const secondCard = selections[1].dataset.id;
  const isMatch = firstCard === secondCard;
  console.log(firstCard, secondCard);
  console.log(isMatch);

  if (isMatch) {
    //remove the liElement
    // selections[o].classList.remove('active');
    // selections[o].style.backgroundColor('#fff');
    // selections[1].classList.remove('active');
    // selections[1].style.backgroundColor('#fff');

    // check win
    const inActiveColorList = document.querySelectorAll(
      '.card-list > li:not(.active)'
    );
    const isWin = inActiveColorList.length === 0;
    if (isWin) {
      setTimerText('YOU WIN!!!!');
      showPlayAgainButton();
      resetGame();
      timer.clear();

      gameStatus = GAME_STATUS.FINISHED;
    }

    selections = [];
    return;
  }

  // in case isMatch === false
  // remove "active" class from two liElement
  // reset selections for the next turn
  gameStatus = GAME_STATUS.BLOCKING;
  setTimeout(() => {
    selections[0].classList.remove('active');
    selections[1].classList.remove('active');

    //reset selections
    selections = [];

    if (gameStatus !== GAME_STATUS.FINISHED) {
      gameStatus = GAME_STATUS.PLAYING;
    }
  }, 500);
};

// reset game
const resetGame = () => {
  // reset global vars
  selections = [];
  gameStatus = GAME_STATUS.PLAYING;

  // reset Dom elements
  // + remove 'active' class in li Element
  liElementList;
  for (const liElement of liElementList) {
    liElement.classList.remove('active');
  }

  // + hide replay button
  hidePlayAgainButton();

  // + hide 'YOU WIN' text
  setTimerText('');

  // re-generate new picture card list
  initPictures();

  //start a new timer
  startTimer();
};

//1. init pictures
const initPictures = () => {
  const pictureList = [];
  for (let i = 1; i < PAIRS_COUNT + 1; i++) {
    // let randomNumber =Math.floor(Math.random()*20)
    // let src = `./img/${randomNumber}.jpg`;
    let src = `./img/${i}.jpg`;
    pictureList.push(src);
  }

  //double list
  const fullPictureList = [...pictureList, ...pictureList];

  //shuffle list
  shuffle(fullPictureList);
  console.log(fullPictureList);

  // bind to li>div.overlay
  liElementList.forEach((liElement, index) => {
    //create dataset Id for each liElement
    liElement.dataset.id = fullPictureList[index];

    //set picture to each div.overlay
    const overlayElement = liElement.querySelector('.overlay');
    overlayElement.style.backgroundImage = `url(${fullPictureList[index]})`;
  });
};

//2. attach event for card list
const attachEventForCardList = () => {
  ulElement.addEventListener('click', (event) => {
    handleCardClick(event.target); //event.target = liElement
  });
};

//3.attach Event for Play again button
const attachEventForPlayAgainButton = () => {
  playGameButton.addEventListener('click', resetGame);
};

//4.start timer
const startTimer = () => {
  timer.start();
};

//main
(() => {
  initPictures();
  attachEventForCardList();
  attachEventForPlayAgainButton();
  startTimer();
})();
