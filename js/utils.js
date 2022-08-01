export const shuffle = (arr) => {
  if (!Array.isArray(arr) || arr.length < 2) return arr;

  for (let i = arr.length - 1; i > 1; i--) {
    const j = Math.floor(Math.random() * i);

    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
};

export const showPlayAgainButton = () => {
  const playAgainButton = document.querySelector('.game__playBtn');
  playAgainButton.classList.add('show');
};

export const hidePlayAgainButton = () => {
  const playAgainButton = document.querySelector('.game__playBtn');
  playAgainButton.classList.remove('show');
};

export const setTimerText = (text) => {
  const timerElement = document.querySelector('.game__timer');
  if (timerElement) timerElement.textContent = text;
};
