let crtlIcon = document.getElementById("crtlIcon");
var audioPlayer = null;
var ct = document.getElementById("ct");
var sd = document.getElementById("sd");
let currentSongIndex;
let currentSongName;
let np = document.getElementById("np");

document.addEventListener("DOMContentLoaded", function () {
  const songList = document.getElementById("song-list");
  songList.querySelectorAll("li").forEach(function (song, index) {
    song.addEventListener("click", function () {
      currentSongName = this.querySelector("span").textContent;
      np.textContent = "Now playing : " + currentSongName;
      audioPlayer = document.getElementById("audio-player");
      const songSrc = this.getAttribute("data-src");
      audioPlayer.src = songSrc;
      audioPlayer.play();
      setTimeout(() => {
        sd.textContent = formatTime(audioPlayer.duration);
      }, 500);
      if (crtlIcon.classList.contains("bx-play")) {
        crtlIcon.classList.remove("bx-play");
        crtlIcon.classList.add("bx-pause");
      }
    });
  });
});

$(document).ready(function () {
  $("li").click(function () {
    currentSongIndex = $(this).index();
  });
});

let progress = document.getElementById("progress");
let song = document.getElementById("audio-player");
let time = document.getElementById("prog");

song.onloadedmetadata = function () {
  progress.max = song.duration;
  progress.value = song.currentTime;
  crtlIcon.classList.add("bx-pause");
};

function playPause() {
  if (audioPlayer === null) {
    ThrowError();
    return;
  }
  if (crtlIcon.classList.contains("bx-pause")) {
    song.pause();
    crtlIcon.classList.remove("bx-pause");
    crtlIcon.classList.add("bx-play");
    setInterval(() => {
      progress.value = audioPlayer.currentTime;
    }, 500);
  } else {
    song.play();
    crtlIcon.classList.remove("bx-play");
    crtlIcon.classList.add("bx-pause");
  }
}

if (song.play()) {
  setInterval(() => {
    progress.value = song.currentTime;
    ct.textContent = formatTime(song.currentTime);
    if (song.currentTime === song.duration) {
      if (currentSongIndex === 8) {
        return;
      }
      nextSong();
    }
  }, 500);
}

progress.onchange = function () {
  song.currentTime = progress.value;
  if (crtlIcon.classList.contains("bx-play")) {
    crtlIcon.classList.remove("bx-play");
    crtlIcon.classList.add("bx-pause");
  }
};

function nextSong() {
  if (audioPlayer === null) {
    ThrowError();
    return;
  }
  let songList = document.getElementById("song-list");
  // let currentSongIndex = parseInt(song.getAttribute('data-index'));

  if (!currentSongIndex) {
    currentSongIndex = 0;
  }
  if (crtlIcon.classList.contains("bx-play")) {
    crtlIcon.classList.remove("bx-play");
    crtlIcon.classList.add("bx-pause");
  }
  if (currentSongIndex === 8) {
    ThrowError("No more songs in the list!!");
    return null;
  }
  currentSongIndex =
    parseInt((currentSongIndex + 1) % songList.querySelectorAll("li").length) ||
    0;
  np.textContent =
    "Now Playing: " +
    songList.querySelectorAll("li")[currentSongIndex].querySelector("span")
      .textContent;
  song.setAttribute("data-index", currentSongIndex);
  const nextSong = songList.querySelectorAll("li")[currentSongIndex];
  const songSrc = nextSong.getAttribute("data-src");
  song.src = songSrc;
  song.play();
  crtlIcon.classList.add("bx-pause");
  setTimeout(() => {
    sd.textContent = formatTime(audioPlayer.duration);
  }, 300);
}

function previousSong() {
  if (audioPlayer === null) {
    ThrowError();
    return;
  }
  let songList = document.getElementById("song-list");

  // let currentSongIndex = parseInt(song.getAttribute('data-index')) || 0;

  if (crtlIcon.classList.contains("bx-play")) {
    crtlIcon.classList.remove("bx-play");
    crtlIcon.classList.add("bx-pause");
  }
  if (currentSongIndex === 0) {
    song.setAttribute("data-index", currentSongIndex);
    const prevSong = songList.querySelectorAll("li")[currentSongIndex];
    const songSrc = prevSong.getAttribute("data-src");
    song.src = songSrc;
    song.play();
  } else {
    // currentSongIndex = (currentSongIndex - 1 + songList.querySelectorAll('li').length)%songList.querySelectorAll('li').length;
    currentSongIndex = currentSongIndex - 1;
    np.textContent =
      "Now Playing: " +
      songList.querySelectorAll("li")[currentSongIndex].querySelector("span")
        .textContent;
    song.setAttribute("data-index", currentSongIndex);
    const prevSong = songList.querySelectorAll("li")[currentSongIndex];
    const songSrc = prevSong.getAttribute("data-src");
    song.src = songSrc;
    song.play();
    crtlIcon.classList.add("bx-pause");
  }
  setTimeout(() => {
    sd.textContent = formatTime(audioPlayer.duration);
  }, 300);
}

const formatTime = (time) => {
  let min = Math.floor(time / 60);
  if (min < 10) {
    min = `0${min}`;
  }
  let sec = Math.floor(time % 60);
  if (sec < 10) {
    sec = `0${sec}`;
  }
  return `${min}:${sec}`;
};

function skipP() {
  if (audioPlayer === null) {
    ThrowError();
    return;
  }
  song.currentTime = song.currentTime - 10;
}

function skipF() {
  if (audioPlayer === null) {
    ThrowError();
    return;
  }
  song.currentTime = song.currentTime + 10;
}

document.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    playPause();
  }
});

const notifications = document.querySelector(".notifications");

const removeError = (error) => {
  error.classList.add("hide");
  if (error.timeoutId) clearTimeout(error.timeoutId);
  setTimeout(() => error.remove(), 500);
};

function ThrowError(str = "No song has been Selected!!") {
  const error = document.createElement("li");
  error.className = `error warning`;
  error.innerHTML = `<div class="column">
                         <i class='bx bxs-error'></i>
                        &nbsp;&nbsp;&nbsp;<span>Error! ${str}</span>
                      </div>
                      <i class="bx bxs-x-circle" onclick="removeError(this.parentElement)"></i>`;
  notifications.appendChild(error);
  error.timeoutId = setTimeout(() => removeError(error), 5000);
}

window.addEventListener("keydown", function (e) {
  if (e.keyCode == 32 && e.target == document.body) {
    e.preventDefault();
  }
});
