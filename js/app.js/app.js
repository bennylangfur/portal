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
}function closeWorlds() {

  kaleidoscopeAudio.pause();
  kaleidoscopeAudio.currentTime = 0;

 worlds.forEach((world) => {
    world.classList.remove("active");
  });

  stage.hidden = false;
}

portals.forEach((portal) => {
  portal.addEventListener("click", () => {

    // Stop music first
    kaleidoscopeAudio.pause();
    kaleidoscopeAudio.currentTime = 0;

    // If Kaleidoscope portal was clicked, play music
    if (portal.dataset.world === "kaleidoscope-world") {
      kaleidoscopeAudio.play();
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
