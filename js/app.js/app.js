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
});

backButtons.forEach((button) => {
  button.addEventListener("click", closeWorlds);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeWorlds();
  }
});
