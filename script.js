// Initializing elements
const playButton = document.querySelector(".icon--play");
const musicCircle1 = document.querySelector(".musicContainerBox1");
const musicCircle2 = document.querySelector(".musicContainerBox2");
const nextButton = document.querySelector(".icon--next");
const previousButton = document.querySelector(".icon--previous");
const musicTitle = document.querySelector(".musicTitle");
const musicTimer = document.querySelector(".musicTimerFiller");
let filler = musicTimer.querySelector(".filler");


// Button click event handlers
function stopButtonHandle() {
  playButton.textContent = "Stop_Circle";
  musicCircle1.classList.add("rotate");
  musicCircle2.classList.add("rotate");
}

function playButtonHandle() {
  playButton.textContent = "Play_Circle";
  musicCircle1.classList.remove("rotate");
  musicCircle2.classList.remove("rotate");
}

// Button disable logic
let index = 8;
let audio = null;
let intervalId = null;
let apiHandleRunning = false; // Flag to track whether API handle function is running

function updateButtonStatus(musics) {
  previousButton.disabled = index <= 0;
  nextButton.disabled = index >= musics.music.length - 1;
}

// Play control function
function playControl(musics) {
  if (audio) {
    audio.pause();
    clearInterval(intervalId);
    audio = null; // Reset audio object
  }

  audio = new Audio(`${musics.music[index].musicPath}`);

  if (playButton.textContent === "Stop_Circle") {
    playButtonHandle();
    audio.pause();
    clearInterval(intervalId); // Clear interval when paused

  } else if (playButton.textContent === "Play_Circle") {
    stopButtonHandle();
    audio.play();
    clearInterval(intervalId); // Clear interval to prevent multiple intervals
    apiHandle();
    updateButtonStatus(musics);
    
  }
  musicTitle.innerText = `${musics.music[index].musicCover}`;
}

// Previous button control
function previousButtonControl(musics) {
  if (audio) {
    audio.pause();
    clearInterval(intervalId);
    audio = null; // Reset audio object
  }

  if (index > 0) {
    index--;
    playControl(musics);
  }
}

// Next button control
function nextButtonControl(musics) {
  if (audio) {
    audio.pause();
    clearInterval(intervalId);
    audio = null; // Reset audio object
  }

  if (index < musics.music.length - 1) {
    index++;
    playControl(musics);
  }
}

// API handle function
function apiHandle() {

  function fillHandling() {
    const durations = audio.duration;

    if (!filler) {
      filler = document.createElement("div");
      filler.classList.add("filler");
      musicTimer.appendChild(filler);
    }

    let j = 0;
    intervalId = setInterval(function () {
      if (j <= durations) {
        filler.style.width = `${(j / durations) * 100}%`;
        j++;
      } else {
        clearInterval(intervalId); 
        audio.pause()
      }
    }, 1000);
  }

  audio.addEventListener("loadedmetadata", fillHandling);
  audio.addEventListener("canplaythrough", fillHandling);

}

// API fetch and handling
fetch("api.json")
  .then((response) => response.json())
  .then((data) => {
    // Attach event listeners to buttons
    nextButton.addEventListener("click", () => nextButtonControl(data));
    previousButton.addEventListener("click", () => previousButtonControl(data));
    playButton.addEventListener("click", () => playControl(data));

    // Update button status
    updateButtonStatus(data);
  })
  .catch((error) => console.error(error));
