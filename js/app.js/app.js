const stage = document.getElementById("stage");
const portals = document.querySelectorAll(".portal");
const worlds = document.querySelectorAll(".world");
const backButtons = document.querySelectorAll(".back-button");

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
  

  worlds.forEach((world) => {
    world.classList.remove("active");
  });

  stage.hidden = false;
}

portals.forEach((portal) => {
  portal.addEventListener("click", () => {
    openWorld(portal.dataset.world);
  });
})
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

const player = document.getElementById("rabbitPlayer");
const playerArtwork = document.getElementById("playerArtwork");
const playerTitle = document.getElementById("playerTitle");
const playerArtist = document.getElementById("playerArtist");

const playButton = document.getElementById("playButton");
const previousButton = document.getElementById("previousButton");
const nextButton = document.getElementById("nextButton");
const shuffleButton = document.getElementById("shuffleButton");
const repeatButton = document.getElementById("repeatButton");

const trackProgress = document.getElementById("trackProgress");
const currentTimeDisplay = document.getElementById("currentTime");
const durationDisplay = document.getElementById("trackDuration");


const portalMusic = {

  "rabbit-world": {
    title: "Rabbit Hole Orchestra",
    artist: "Benny Langfur Music",
    artwork: "assets/covers/rabbithole.jpg",

    tracks: [
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
      }
    ]
  },


  "morph-world": {
    title: "Morph Dwarf",
    artist: "Benny Langfur Music",
    artwork: "assets/covers/morphdwarf.jpg",
    tracks: []
  },


  "kingdom-world": {
    title: "Forgotten Kingdoms",
    artist: "Benny Langfur Music",
    artwork: "assets/covers/forgottenkingdoms.jpg",
    tracks: []
  },


  "earth-world": {
    title: "EarthJam",
    artist: "Benny Langfur Music",
    artwork: "assets/covers/earthjam.jpg",
    tracks: []
  },


  "kaleidoscope-world": {
    title: "Kaleidoscope Karavan",
    artist: "Benny Langfur Music",
    artwork: "assets/covers/kaleidoscope.jpg",

    tracks: [
      {
        title: "Kaleidoscope — March 23",
        src: "https://pub-3ed5fb1107fe45bfb96a991226d8182b.r2.dev/Kaleidoscope%2C%20March%2023.mp3"
      }
    ]
  }

};


let currentWorld = "rabbit-world";
let currentTrackIndex = 0;
let repeatEnabled = false;


function loadPortalPlayer(worldId, autoplay = false) {

  const portal = portalMusic[worldId];

  if (!portal) {
    return;
  }

  currentWorld = worldId;
  currentTrackIndex = 0;

  playerArtwork.src = portal.artwork;
  playerArtwork.alt = portal.title;

  playerTitle.textContent = portal.title;
  playerArtist.textContent = portal.artist;

  if (portal.tracks.length === 0) {

    player.pause();
    player.removeAttribute("src");
    player.load();

    playButton.textContent = "▶";
    trackProgress.value = 0;
    currentTimeDisplay.textContent = "0:00";
    durationDisplay.textContent = "0:00";

    return;
  }

  loadTrack(0, autoplay);
}


function loadTrack(index, autoplay = false) {

  const portal = portalMusic[currentWorld];

  if (!portal || portal.tracks.length === 0) {
    return;
  }

  currentTrackIndex =
    (index + portal.tracks.length) % portal.tracks.length;

  const track = portal.tracks[currentTrackIndex];

  player.src = track.src;

  playerTitle.textContent = track.title;
  playerArtist.textContent = portal.title;

  playerArtwork.src = portal.artwork;
  playerArtwork.alt = portal.title;

  trackProgress.value = 0;
  currentTimeDisplay.textContent = "0:00";
  durationDisplay.textContent = "0:00";

  player.load();

  if (autoplay) {
    playCurrentTrack();
  } else {
    playButton.textContent = "▶";
  }
}


function playCurrentTrack() {

  player.play()
    .then(() => {
      playButton.textContent = "❚❚";
    })
    .catch((error) => {
      console.log("Audio could not play:", error);
    });

}


function formatTime(seconds) {

  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const hours = Math.floor(seconds / 3600);

  const minutes = Math.floor(
    (seconds % 3600) / 60
  );

  const remainingSeconds =
    Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds}`;
  }

  return `${minutes}:${remainingSeconds}`;
}


playButton.addEventListener("click", () => {

  if (!player.src) {
    return;
  }

  if (player.paused) {
    playCurrentTrack();
  } else {
    player.pause();
    playButton.textContent = "▶";
  }

});


nextButton.addEventListener("click", () => {

  const portal = portalMusic[currentWorld];

  if (!portal || portal.tracks.length === 0) {
    return;
  }

  loadTrack(currentTrackIndex + 1, true);

});


previousButton.addEventListener("click", () => {

  const portal = portalMusic[currentWorld];

  if (!portal || portal.tracks.length === 0) {
    return;
  }

  loadTrack(currentTrackIndex - 1, true);

});


shuffleButton.addEventListener("click", () => {

  const portal = portalMusic[currentWorld];

  if (!portal || portal.tracks.length === 0) {
    return;
  }

  const randomIndex =
    Math.floor(Math.random() * portal.tracks.length);

  loadTrack(randomIndex, true);

});


repeatButton.addEventListener("click", () => {

  repeatEnabled = !repeatEnabled;

  player.loop = repeatEnabled;

  repeatButton.classList.toggle(
    "active",
    repeatEnabled
  );

});


player.addEventListener("loadedmetadata", () => {

  durationDisplay.textContent =
    formatTime(player.duration);

});


player.addEventListener("timeupdate", () => {

  if (!player.duration) {
    return;
  }

  const percentage =
    (player.currentTime / player.duration) * 100;

  trackProgress.value = percentage;

  currentTimeDisplay.textContent =
    formatTime(player.currentTime);

});


trackProgress.addEventListener("input", () => {

  if (!player.duration) {
    return;
  }

  player.currentTime =
    (trackProgress.value / 100) *
    player.duration;

});


player.addEventListener("ended", () => {

  if (repeatEnabled) {
    return;
  }

  loadTrack(currentTrackIndex + 1, true);

});


/* Start website with a random Rabbit Hole song loaded */

currentWorld = "rabbit-world";

currentTrackIndex =
  Math.floor(
    Math.random() *
    portalMusic["rabbit-world"].tracks.length
  );

loadTrack(currentTrackIndex, false);

const portalTracks = document.querySelectorAll(".portal-track");
const playerArtwork = document.getElementById("playerArtwork");
const playerArtist = document.getElementById("playerArtist");

portalTracks.forEach((trackButton) => {
  trackButton.addEventListener("click", () => {

    // Load selected music into the existing footer player
    rabbitPlayer.src = trackButton.dataset.src;

    // Change footer information
    playerTitle.textContent = trackButton.dataset.title;
    playerArtist.textContent = trackButton.dataset.artist;
    playerArtwork.src = trackButton.dataset.artwork;

    // Reset progress
    trackProgress.value = 0;
    currentTimeDisplay.textContent = "0:00";
    durationDisplay.textContent = "0:00";

    // Load and play
    rabbitPlayer.load();

    rabbitPlayer.play()
      .then(() => {
        playButton.textContent = "❚❚";
      })
      .catch((error) => {
        console.log("Audio could not play:", error);
      });

  });
});