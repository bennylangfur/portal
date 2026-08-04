const stage = document.getElementById("stage");
const portals = document.querySelectorAll(".portal");
const worlds = document.querySelectorAll(".world");
const backButtons = document.querySelectorAll(".back-button");
const kaleidoscopeAudio = document.getElementById("kaleidoscopeAudio");
function openWorld(worldId) {
  const selectedWorld = document.getElementById(worldId);

  if (!selectedWorld) {
    return;
  }

  stage.hidden = true;

  worlds.forEach((world) => {
    world.classList.remove("active");
  });

  selectedWorld.classList.add("active");
  selectedWorld.scrollTop = 0;
}
function closeWorlds() {
  if (kaleidoscopeAudio) {
    kaleidoscopeAudio.pause();
    kaleidoscopeAudio.currentTime = 0;
  }

  worlds.forEach((world) => {
    world.classList.remove("active");
  });

  stage.hidden = false;
}

portals.forEach((portal) => {
  portal.addEventListener("click", () => {
    if (kaleidoscopeAudio) {
      kaleidoscopeAudio.pause();
      kaleidoscopeAudio.currentTime = 0;
    }

    if (
      portal.dataset.world === "kaleidoscope-world" &&
      kaleidoscopeAudio
    ) {
      kaleidoscopeAudio.play().catch((error) => {
        console.log("Audio could not play:", error);
      });
    }

    openWorld(portal.dataset.world);
  });
});
backButtons.forEach((button) => {
  button.addEventListener("click", closeWorlds);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeWorlds();
  }
});
const rabbitTracks = [
  {
    title: "The Hourglass",
    src: "assets/audio/hourglass.m4a"
  },
  {
    title: "Tunnels",
    src: "assets/audio/tunnels.m4a"
  },
  {
    title: "Creators of the World",
    src: "assets/audio/creators.m4a"
  },
  {
    title: "Levitating",
    src: "assets/audio/levitating.m4a"
  },
  
];

const rabbitPlayer = document.getElementById("rabbitPlayer");
const playerTitle = document.getElementById("playerTitle");
const playButton = document.getElementById("playButton");
const previousButton = document.getElementById("previousButton");
const nextButton = document.getElementById("nextButton");
const shuffleButton = document.getElementById("shuffleButton");
const repeatButton = document.getElementById("repeatButton");
const trackProgress = document.getElementById("trackProgress");
const currentTimeDisplay = document.getElementById("currentTime");
const durationDisplay = document.getElementById("trackDuration");

let currentTrackIndex = Math.floor(Math.random() * rabbitTracks.length);
let repeatEnabled = false;

function loadRabbitTrack(index) {
  currentTrackIndex =
    (index + rabbitTracks.length) % rabbitTracks.length;

  const track = rabbitTracks[currentTrackIndex];

  rabbitPlayer.src = track.src;
  playerTitle.textContent = track.title;
  trackProgress.value = 0;
  currentTimeDisplay.textContent = "0:00";
  durationDisplay.textContent = "0:00";
  playButton.textContent = "▶";

  rabbitPlayer.load();
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

function playRabbitTrack() {
  rabbitPlayer.play()
    .then(() => {
      playButton.textContent = "❚❚";
    })
    .catch((error) => {
      console.log("Rabbit Hole audio could not play:", error);
    });
}

playButton.addEventListener("click", () => {
  if (rabbitPlayer.paused) {
    playRabbitTrack();
  } else {
    rabbitPlayer.pause();
    playButton.textContent = "▶";
  }
});

nextButton.addEventListener("click", () => {
  loadRabbitTrack(currentTrackIndex + 1);
  playRabbitTrack();
});

previousButton.addEventListener("click", () => {
  loadRabbitTrack(currentTrackIndex - 1);
  playRabbitTrack();
});

shuffleButton.addEventListener("click", () => {
  let randomIndex = currentTrackIndex;

  while (
    rabbitTracks.length > 1 &&
    randomIndex === currentTrackIndex
  ) {
    randomIndex = Math.floor(Math.random() * rabbitTracks.length);
  }

  loadRabbitTrack(randomIndex);
  playRabbitTrack();
});

repeatButton.addEventListener("click", () => {
  repeatEnabled = !repeatEnabled;
  rabbitPlayer.loop = repeatEnabled;
  repeatButton.classList.toggle("active", repeatEnabled);
});

rabbitPlayer.addEventListener("loadedmetadata", () => {
  durationDisplay.textContent = formatTime(rabbitPlayer.duration);
});

rabbitPlayer.addEventListener("timeupdate", () => {
  if (!rabbitPlayer.duration) {
    return;
  }

  const percentage =
    (rabbitPlayer.currentTime / rabbitPlayer.duration) * 100;

  trackProgress.value = percentage;
  currentTimeDisplay.textContent =
    formatTime(rabbitPlayer.currentTime);
});

trackProgress.addEventListener("input", () => {
  if (!rabbitPlayer.duration) {
    return;
  }

  rabbitPlayer.currentTime =
    (trackProgress.value / 100) * rabbitPlayer.duration;
});

rabbitPlayer.addEventListener("ended", () => {
  if (!repeatEnabled) {
    loadRabbitTrack(currentTrackIndex + 1);
    playRabbitTrack();
  }
});

/* Select a different random Rabbit Hole track on every refresh */
loadRabbitTrack(currentTrackIndex);