const wordContainer = document.querySelector("[data-word]");
const categoryDiv = document.querySelector("[data-cat-container]");
const categorySpan = document.querySelector("[data-category]");
const letters = document.querySelectorAll("[data-letter]");
const livesSpan = document.querySelector("[data-lives]");

let lives = 6;
let lettersGuessed = 0;

updateLives();

async function getWordsAndGetRandomWord() {
  const randomCategory = words[Math.floor(Math.random() * words.length)];
  const randomWord =
    randomCategory.words[
      Math.floor(Math.random() * randomCategory.words.length)
    ];
  return [randomWord, randomCategory.category];
}

async function updateWord(randomWordAndCategory) {
  const wordAndCategory = await randomWordAndCategory;

  categorySpan.textContent = wordAndCategory[1];
  const splittedWord = wordAndCategory[0].split("");
  splittedWord.forEach((lettter) => {
    const letterDiv = document.createElement("div");
    letterDiv.classList.add("word-letter");
    letterDiv.textContent = "-";
    wordContainer.append(letterDiv);
  });
}

const randomWord = getWordsAndGetRandomWord();

updateWord(randomWord);

async function checkForMatch(letterToCheck, letterDiv) {
  if (!lives) return;
  const getWord = await randomWord;
  const wordToIterate = getWord[0].split("");
  let found = false;
  wordToIterate.forEach((letter, index) => {
    if (letter === letterToCheck) {
      updateLetter(letter, index, true);
      found = true;
      letterDiv.classList.add("correct");
    }
  });

  if (lettersGuessed === wordToIterate.length) {
    endGame(true, getWord[0]);
  }

  if (!found) {
    lives--;
    updateLives();
    letterDiv.classList.add("wrong");
    if (lives === 0) {
      endGame(false, getWord[0]);
    }
  }
}

function updateLetter(letterToAdd, index) {
  let letters = wordContainer.children;
  lettersGuessed++;
  letters[index].textContent = letterToAdd;
}

function updateLives() {
  livesSpan.textContent = lives;
}

function endGame(isWin, word) {
  wordContainer.textContent = "";
  categoryDiv.textContent = "";
  if (isWin) {
    categoryDiv.innerHTML = `Good job! Wanna try again? <br/> word: <span class="blue-bold-text">${word}</span>`;
  } else {
    categoryDiv.innerHTML = `You loose! Wanna try again? <br/> word: <span class="blue-bold-text">${word}</span>`;
  }
  const resetBtn = document.createElement("button");
  resetBtn.classList.add("reset-btn");
  resetBtn.textContent = "reset";
  wordContainer.append(resetBtn);
  resetBtn.addEventListener("click", () => {
    location.reload();
  });
}

// Listen for click on letter
letters.forEach((letter) => {
  letter.addEventListener("click", (e) => {
    checkForMatch(e.target.innerText.toLowerCase(), e.target);
  });
});
