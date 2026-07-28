/* =========================================================
   BENNY'S LABYRINTH
   Music player and playlists
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const audioPlayer = document.getElementById("audioPlayer");

  const playButton = document.getElementById("playButton");
  const previousButton = document.getElementById("previousButton");
  const nextButton = document.getElementById("nextButton");

  const progressBar = document.getElementById("progressBar");
  const currentTimeDisplay = document.getElementById("currentTime");
  const durationDisplay = document.getElementById("duration");

  const playerBand = document.getElementById("playerBand");
  const playerTrack = document.getElementById("playerTrack");
  const playerCover = document.getElementById("playerCover");

  const playlistTitle = document.getElementById("playlistTitle");
  const trackList = document.getElementById("trackList");

  const downloadButton = document.getElementById("downloadButton");

  let currentWorld = "rabbit";
  let currentTrackIndex = 0;
  let isSeeking = false;


  /* =======================================================
     PLAYLISTS

     Later, replace the example filenames below with the
     exact names of your real MP3 files.
  ======================================================= */

  const musicLibrary = {
    rabbit: {
      name: "Rabbit Hole Orchestra",
      cover: "assets/covers/rabbithole.jpg",

      tracks: [
        {
          title: "Rabbit Hole Orchestra — Track 1",
          file: "assets/audio/rabbit/track1.mp3"
        },
        {
          title: "Rabbit Hole Orchestra — Track 2",
          file: "assets/audio/rabbit/track2.mp3"
        },
        {
          title: "Rabbit Hole Orchestra — Track 3",
          file: "assets/audio/rabbit/track3.mp3"
        }
      ]
    },

    morph: {
      name: "Morph Dwarf",
      cover: "assets/covers/morphdwarf.jpg",

      tracks: [
        {
          title: "Morph Dwarf — Track 1",
          file: "assets/audio/morph/track1.mp3"
        },
        {
          title: "Morph Dwarf — Track 2",
          file: "assets/audio/morph/track2.mp3"
        },
        {
          title: "Morph Dwarf — Track 3",
          file: "assets/audio/morph/track3.mp3"
        }
      ]
    },

    forgotten: {
      name: "Forgotten Kingdoms",
      cover: "assets/covers/forgottenkingdoms.jpg",

      tracks: [
        {
          title: "Forgotten Kingdoms — Track 1",
          file: "assets/audio/forgotten/track1.mp3"
        },
        {
          title: "Forgotten Kingdoms — Track 2",
          file: "assets/audio/forgotten/track2.mp3"
        },
        {
          title: "Forgotten Kingdoms — Track 3",
          file: "assets/audio/forgotten/track3.mp3"
        }
      ]
    },

    earth: {
      name: "EarthJam",
      cover: "assets/covers/earthjam.jpg",

      tracks: [
        {
          title: "EarthJam — Track 1",
          file: "assets/audio/earthjam/track1.mp3"
        },
        {
          title: "EarthJam — Track 2",
          file: "assets/audio/earthjam/track2.mp3"
        },
        {
          title: "EarthJam — Track 3",
          file: "assets/audio/earthjam/track3.mp3"
        }
      ]
    },

    kaleidoscope: {
      name: "Kaleidoscope Karavan",
      cover: "assets/covers/kaleidoscope.jpg",

      tracks: [
        {
          title: "Kaleidoscope Karavan — Track 1",
          file: "assets/audio/kaleidoscope/track1.mp3"
        },
        {
          title: "Kaleidoscope Karavan — Track 2",
          file: "assets/audio/kaleidoscope/track2.mp3"
        },
        {
          title: "Kaleidoscope Karavan — Track 3",
          file: "assets/audio/kaleidoscope/track3.mp3"
        }
      ]
    }
  };


  /* =======================================================
     GET CURRENT WORLD AND TRACK
  ======================================================= */

  function getCurrentCollection() {
    return musicLibrary[currentWorld];
  }


  function getCurrentTrack() {
    const collection = getCurrentCollection();

    if (!collection || collection.tracks.length === 0) {
      return null;
    }

    return collection.tracks[currentTrackIndex];
  }


  /* =======================================================
     CHANGE WORLD
  ======================================================= */

  function changeWorld(worldId, startMusic = true) {
    const newCollection = musicLibrary[worldId];

    if (!newCollection) {
      console.warn(`No music collection found for: ${worldId}`);
      return;
    }

    const wasPlaying = !audioPlayer.paused;

    currentWorld = worldId;
    currentTrackIndex = 0;

    updateWorldDisplay();
    renderPlaylist();
    loadCurrentTrack(false);

    if (startMusic || wasPlaying) {
      playCurrentTrack();
    }
  }


  /* =======================================================
     UPDATE WORLD DISPLAY
  ======================================================= */

  function updateWorldDisplay() {
    const collection = getCurrentCollection();

    if (!collection) {
      return;
    }

    if (playerBand) {
      playerBand.textContent = collection.name;
    }

    if (playlistTitle) {
      playlistTitle.textContent = collection.name;
    }

    if (playerCover) {
      playerCover.src = collection.cover;
      playerCover.alt = `${collection.name} artwork`;
    }
  }


  /* =======================================================
     LOAD TRACK
  ======================================================= */

  function loadCurrentTrack(autoplay = false) {
    const track = getCurrentTrack();
    const collection = getCurrentCollection();

    if (!track || !collection) {
      clearPlayer();
      return;
    }

    audioPlayer.src = track.file;
    audioPlayer.load();

    if (playerTrack) {
      playerTrack.textContent = track.title;
    }

    if (downloadButton) {
      downloadButton.href = track.file;
      downloadButton.setAttribute(
        "download",
        getDownloadFilename(track)
      );
    }

    updateActiveTrack();
    resetProgress();

    if (autoplay) {
      playCurrentTrack();
    }
  }


  /* =======================================================
     PLAY AND PAUSE
  ======================================================= */

  async function playCurrentTrack() {
    const track = getCurrentTrack();

    if (!track) {
      return;
    }

    if (!audioPlayer.src) {
      loadCurrentTrack(false);
    }

    try {
      await audioPlayer.play();
      updatePlayButton(true);
    } catch (error) {
      console.warn(
        "The audio could not play. Check that the MP3 file exists:",
        track.file
      );

      updatePlayButton(false);
    }
  }


  function pauseCurrentTrack() {
    audioPlayer.pause();
    updatePlayButton(false);
  }


  function togglePlay() {
    if (audioPlayer.paused) {
      playCurrentTrack();
    } else {
      pauseCurrentTrack();
    }
  }


  function updatePlayButton(isPlaying) {
    if (!playButton) {
      return;
    }

    if (isPlaying) {
      playButton.textContent = "❚❚";
      playButton.setAttribute("aria-label", "Pause");
      playButton.classList.add("playing");
    } else {
      playButton.textContent = "▶";
      playButton.setAttribute("aria-label", "Play");
      playButton.classList.remove("playing");
    }
  }


  /* =======================================================
     PREVIOUS AND NEXT TRACK
  ======================================================= */

  function playNextTrack() {
    const collection = getCurrentCollection();

    if (!collection || collection.tracks.length === 0) {
      return;
    }

    currentTrackIndex++;

    if (currentTrackIndex >= collection.tracks.length) {
      currentTrackIndex = 0;
    }

    loadCurrentTrack(true);
  }


  function playPreviousTrack() {
    const collection = getCurrentCollection();

    if (!collection || collection.tracks.length === 0) {
      return;
    }

    /*
      If more than three seconds into a song,
      restart the current song instead of moving backward.
    */

    if (audioPlayer.currentTime > 3) {
      audioPlayer.currentTime = 0;
      return;
    }

    currentTrackIndex--;

    if (currentTrackIndex < 0) {
      currentTrackIndex = collection.tracks.length - 1;
    }

    loadCurrentTrack(true);
  }


  /* =======================================================
     PLAYLIST
  ======================================================= */

  function renderPlaylist() {
    const collection = getCurrentCollection();

    if (!trackList || !collection) {
      return;
    }

    trackList.innerHTML = "";

    if (collection.tracks.length === 0) {
      trackList.innerHTML = `
        <p class="empty-playlist">
          No tracks have been added yet.
        </p>
      `;

      return;
    }

    collection.tracks.forEach((track, index) => {
      const trackButton = document.createElement("button");

      trackButton.type = "button";
      trackButton.className = "track-item";
      trackButton.dataset.trackIndex = String(index);

      trackButton.innerHTML = `
        <span class="track-number">
          ${String(index + 1).padStart(2, "0")}
        </span>

        <span class="track-title">
          ${escapeHTML(track.title)}
        </span>

        <span class="track-duration">
          --:--
        </span>
      `;

      trackButton.addEventListener("click", () => {
        currentTrackIndex = index;
        loadCurrentTrack(true);
      });

      trackList.appendChild(trackButton);
    });

    updateActiveTrack();
  }


  function updateActiveTrack() {
    const trackItems = document.querySelectorAll(".track-item");

    trackItems.forEach((item) => {
      const itemIndex = Number(item.dataset.trackIndex);
      const isActive = itemIndex === currentTrackIndex;

      item.classList.toggle("active", isActive);

      if (isActive) {
        item.setAttribute("aria-current", "true");
      } else {
        item.removeAttribute("aria-current");
      }
    });
  }


  /* =======================================================
     PROGRESS BAR
  ======================================================= */

  function updateProgress() {
    if (isSeeking || !audioPlayer.duration) {
      return;
    }

    const percentage =
      (audioPlayer.currentTime / audioPlayer.duration) * 100;

    progressBar.value = String(percentage);
    progressBar.style.setProperty(
      "--progress",
      `${percentage}%`
    );

    currentTimeDisplay.textContent = formatTime(
      audioPlayer.currentTime
    );

    durationDisplay.textContent = formatTime(
      audioPlayer.duration
    );
  }


  function seekTrack() {
    if (!audioPlayer.duration) {
      return;
    }

    const percentage = Number(progressBar.value);
    const newTime = (percentage / 100) * audioPlayer.duration;

    audioPlayer.currentTime = newTime;

    progressBar.style.setProperty(
      "--progress",
      `${percentage}%`
    );

    currentTimeDisplay.textContent = formatTime(newTime);
  }


  function resetProgress() {
    progressBar.value = "0";
    progressBar.style.setProperty("--progress", "0%");

    currentTimeDisplay.textContent = "0:00";
    durationDisplay.textContent = "0:00";
  }


  /* =======================================================
     TRACK DURATION
  ======================================================= */

  function updateCurrentTrackDuration() {
    if (!audioPlayer.duration) {
      return;
    }

    durationDisplay.textContent = formatTime(
      audioPlayer.duration
    );

    const activeTrack = document.querySelector(
      `.track-item[data-track-index="${currentTrackIndex}"]`
    );

    if (!activeTrack) {
      return;
    }

    const durationElement =
      activeTrack.querySelector(".track-duration");

    if (durationElement) {
      durationElement.textContent = formatTime(
        audioPlayer.duration
      );
    }
  }


  /* =======================================================
     AUDIO EVENTS
  ======================================================= */

  audioPlayer.addEventListener("play", () => {
    updatePlayButton(true);
  });


  audioPlayer.addEventListener("pause", () => {
    updatePlayButton(false);
  });


  audioPlayer.addEventListener("ended", () => {
    playNextTrack();
  });


  audioPlayer.addEventListener("timeupdate", () => {
    updateProgress();
  });


  audioPlayer.addEventListener("loadedmetadata", () => {
    updateCurrentTrackDuration();
    updateProgress();
  });


  audioPlayer.addEventListener("durationchange", () => {
    updateCurrentTrackDuration();
  });


  audioPlayer.addEventListener("error", () => {
    const track = getCurrentTrack();

    updatePlayButton(false);

    if (playerTrack && track) {
      playerTrack.textContent =
        `${track.title} — audio file not found`;
    }

    console.warn(
      "Audio file not found. Add the file here:",
      track?.file
    );
  });


  /* =======================================================
     BUTTON EVENTS
  ======================================================= */

  if (playButton) {
    playButton.addEventListener("click", togglePlay);
  }


  if (previousButton) {
    previousButton.addEventListener(
      "click",
      playPreviousTrack
    );
  }


  if (nextButton) {
    nextButton.addEventListener("click", playNextTrack);
  }


  if (progressBar) {
    progressBar.addEventListener("mousedown", () => {
      isSeeking = true;
    });

    progressBar.addEventListener("touchstart", () => {
      isSeeking = true;
    });

    progressBar.addEventListener("input", seekTrack);

    progressBar.addEventListener("change", () => {
      seekTrack();
      isSeeking = false;
    });

    progressBar.addEventListener("mouseup", () => {
      isSeeking = false;
    });

    progressBar.addEventListener("touchend", () => {
      isSeeking = false;
    });
  }


  /* =======================================================
     HELPERS
  ======================================================= */

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) {
      return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(
      2,
      "0"
    )}`;
  }


  function getDownloadFilename(track) {
    return track.title
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase() + ".mp3";
  }


  function escapeHTML(value) {
    const temporaryElement = document.createElement("div");
    temporaryElement.textContent = value;

    return temporaryElement.innerHTML;
  }


  function clearPlayer() {
    audioPlayer.pause();
    audioPlayer.removeAttribute("src");
    audioPlayer.load();

    if (playerTrack) {
      playerTrack.textContent = "No tracks available";
    }

    if (downloadButton) {
      downloadButton.removeAttribute("href");
    }

    resetProgress();
    updatePlayButton(false);
  }


  /* =======================================================
     INITIAL PLAYER STATE
  ======================================================= */

  updateWorldDisplay();
  renderPlaylist();
  loadCurrentTrack(false);
  updatePlayButton(false);


  /* =======================================================
     MAKE PLAYER AVAILABLE TO APP.JS
  ======================================================= */

  window.LabyrinthPlayer = {
    changeWorld,
    togglePlay,
    playNextTrack,
    playPreviousTrack,

    getCurrentWorld() {
      return currentWorld;
    },

    getCurrentTrack() {
      return getCurrentTrack();
    }
  };
});