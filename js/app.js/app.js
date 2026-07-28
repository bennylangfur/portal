/* =========================================================
   BENNY'S LABYRINTH
   Main interface and world switching
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  const introScreen = document.getElementById("introScreen");
  const enterButton = document.getElementById("enterButton");

  const worldCards = document.querySelectorAll(".world-card");
  const worldButtons = document.querySelectorAll("[data-band]");

  const playlistButton = document.getElementById("playlistButton");
  const closePlaylistButton = document.getElementById(
    "closePlaylistButton"
  );
  const playlistPanel = document.getElementById("playlistPanel");
  const playlistBackdrop = document.getElementById(
    "playlistBackdrop"
  );

  const playerCover = document.getElementById("playerCover");
  const playerBand = document.getElementById("playerBand");
  const playlistTitle = document.getElementById("playlistTitle");

  let currentWorld = "rabbit";


  /* =======================================================
     WORLD INFORMATION
  ======================================================= */

  const worlds = {
    rabbit: {
      name: "Rabbit Hole Orchestra",
      themeClass: "theme-rabbit",
      cardClass: "rabbit-card",
      cover: "assets/covers/rabbithole.jpg"
    },

    morph: {
      name: "Morph Dwarf",
      themeClass: "theme-morph",
      cardClass: "morph-card",
      cover: "assets/covers/morphdwarf.jpg"
    },

    forgotten: {
      name: "Forgotten Kingdoms",
      themeClass: "theme-forgotten",
      cardClass: "forgotten-card",
      cover: "assets/covers/forgottenkingdoms.jpg"
    },

    earth: {
      name: "EarthJam",
      themeClass: "theme-earth",
      cardClass: "earth-card",
      cover: "assets/covers/earthjam.jpg"
    },

    kaleidoscope: {
      name: "Kaleidoscope Karavan",
      themeClass: "theme-kaleidoscope",
      cardClass: "kaleidoscope-card",
      cover: "assets/covers/kaleidoscope.jpg"
    }
  };


  /* =======================================================
     ENTER THE SITE
  ======================================================= */

  function enterLabyrinth() {
    body.classList.add("site-entered");

    if (introScreen) {
      introScreen.classList.add("hidden");
    }

    setTimeout(() => {
      if (introScreen) {
        introScreen.setAttribute("aria-hidden", "true");
      }
    }, 900);

    activateWorld("rabbit", {
      scroll: false,
      startMusic: true
    });
  }

  if (enterButton) {
    enterButton.addEventListener("click", enterLabyrinth);
  }


  /* =======================================================
     WORLD SWITCHING
  ======================================================= */

  function activateWorld(
    worldId,
    options = {
      scroll: true,
      startMusic: true
    }
  ) {
    const world = worlds[worldId];

    if (!world) {
      console.warn(`Unknown world: ${worldId}`);
      return;
    }

    currentWorld = worldId;

    removeThemeClasses();
    body.classList.add(world.themeClass);

    updateActiveCard(world.cardClass);
    updatePlayerInformation(world);

    triggerWorldTransition(worldId);

    if (
      window.LabyrinthPlayer &&
      typeof window.LabyrinthPlayer.changeWorld === "function"
    ) {
      window.LabyrinthPlayer.changeWorld(
        worldId,
        Boolean(options.startMusic)
      );
    }

    if (options.scroll) {
      scrollToActiveWorld(world.cardClass);
    }
  }


  function removeThemeClasses() {
    Object.values(worlds).forEach((world) => {
      body.classList.remove(world.themeClass);
    });
  }


  function updateActiveCard(cardClass) {
    worldCards.forEach((card) => {
      card.classList.remove("active");
    });

    const selectedCard = document.querySelector(`.${cardClass}`);

    if (selectedCard) {
      selectedCard.classList.add("active");
    }
  }


  function updatePlayerInformation(world) {
    if (playerCover) {
      playerCover.src = world.cover;
      playerCover.alt = `${world.name} artwork`;
    }

    if (playerBand) {
      playerBand.textContent = world.name;
    }

    if (playlistTitle) {
      playlistTitle.textContent = world.name;
    }
  }


  function scrollToActiveWorld(cardClass) {
    const card = document.querySelector(`.${cardClass}`);

    if (!card) {
      return;
    }

    const cardTop =
      card.getBoundingClientRect().top + window.scrollY;

    const targetPosition = Math.max(cardTop - 80, 0);

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth"
    });
  }


  worldButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const worldId = button.dataset.band;

      activateWorld(worldId, {
        scroll: true,
        startMusic: true
      });
    });
  });


  /* =======================================================
     WORLD TRANSITION EFFECT
  ======================================================= */

  function triggerWorldTransition(worldId) {
    const transitionLayer = document.createElement("div");

    transitionLayer.className =
      `world-transition world-transition-${worldId}`;

    transitionLayer.setAttribute("aria-hidden", "true");

    transitionLayer.innerHTML =
      createTransitionSymbols(worldId);

    document.body.appendChild(transitionLayer);

    requestAnimationFrame(() => {
      transitionLayer.classList.add("visible");
    });

    setTimeout(() => {
      transitionLayer.classList.add("leaving");
    }, 450);

    setTimeout(() => {
      transitionLayer.remove();
    }, 1100);
  }


  function createTransitionSymbols(worldId) {
    const symbols = {
      rabbit: ["♥", "♠", "♦", "♣", "◷", "🐇"],
      morph: ["⚙", "⚙", "⌁", "⚙", "♜", "⚙"],
      forgotten: ["✦", "ᚱ", "ᚾ", "🏰", "✧", "ᛟ"],
      earth: ["🌿", "✦", "🍃", "🔥", "🌿", "✧"],
      kaleidoscope: ["☕", "✺", "◉", "✹", "☕", "✧"]
    };

    const selectedSymbols = symbols[worldId] || symbols.rabbit;

    return selectedSymbols
      .map((symbol, index) => {
        return `
          <span
            class="transition-symbol transition-symbol-${index + 1}"
          >
            ${symbol}
          </span>
        `;
      })
      .join("");
  }


  /* =======================================================
     PLAYLIST DRAWER
  ======================================================= */

  function openPlaylist() {
    if (!playlistPanel || !playlistBackdrop) {
      return;
    }

    playlistPanel.classList.add("open");
    playlistBackdrop.classList.add("visible");

    playlistButton?.setAttribute("aria-expanded", "true");

    body.style.overflow = "hidden";
  }


  function closePlaylist() {
    if (!playlistPanel || !playlistBackdrop) {
      return;
    }

    playlistPanel.classList.remove("open");
    playlistBackdrop.classList.remove("visible");

    playlistButton?.setAttribute("aria-expanded", "false");

    body.style.overflow = "";
  }


  if (playlistButton) {
    playlistButton.addEventListener("click", () => {
      const isOpen = playlistPanel?.classList.contains("open");

      if (isOpen) {
        closePlaylist();
      } else {
        openPlaylist();
      }
    });
  }


  if (closePlaylistButton) {
    closePlaylistButton.addEventListener(
      "click",
      closePlaylist
    );
  }


  if (playlistBackdrop) {
    playlistBackdrop.addEventListener("click", closePlaylist);
  }


  /* =======================================================
     KEYBOARD CONTROLS
  ======================================================= */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePlaylist();
    }

    if (
      event.key === " " &&
      body.classList.contains("site-entered")
    ) {
      const activeElement = document.activeElement;

      const isTyping =
        activeElement &&
        (
          activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.tagName === "BUTTON" ||
          activeElement.tagName === "A"
        );

      if (!isTyping) {
        event.preventDefault();

        if (
          window.LabyrinthPlayer &&
          typeof window.LabyrinthPlayer.togglePlay === "function"
        ) {
          window.LabyrinthPlayer.togglePlay();
        }
      }
    }
  });


  /* =======================================================
     CLOSE PLAYLIST WHEN SCREEN BECOMES LARGE
  ======================================================= */

  window.addEventListener("resize", () => {
    if (
      window.innerWidth > 900 &&
      playlistPanel?.classList.contains("open")
    ) {
      closePlaylist();
    }
  });


  /* =======================================================
     INITIAL STATE
  ======================================================= */

  activateWorld("rabbit", {
    scroll: false,
    startMusic: false
  });


  /* =======================================================
     MAKE FUNCTIONS AVAILABLE TO PLAYER.JS
  ======================================================= */

  window.LabyrinthApp = {
    activateWorld,
    openPlaylist,
    closePlaylist,

    getCurrentWorld() {
      return currentWorld;
    },

    getWorldInformation(worldId) {
      return worlds[worldId] || null;
    }
  };
});