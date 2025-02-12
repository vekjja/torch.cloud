const audioInstances: { enchantedForest: HTMLAudioElement | null } = {
  enchantedForest: null,
};

const menuSound = new Audio("/sfx/menu.mp3");
const ignite = new Audio("/sfx/torch-lighting.mp3");

export function menuSelect() {
  ignite.volume = 1.0;
  menuSound.play();
  menuSound.onended = () => {
    menuSound.remove(); // Cleanup after playing
  };
}

export function lightTorch() {
  ignite.volume = 1.0;
  ignite.play();
  ignite.onended = () => {
    ignite.remove(); // Cleanup after playing
  };
}

export function playEnchantedForest() {
  if (
    audioInstances.enchantedForest &&
    !audioInstances.enchantedForest.paused
  ) {
    return; // Already playing, don't restart
  }

  if (!audioInstances.enchantedForest) {
    audioInstances.enchantedForest = new Audio(
      "/sfx/enchanted-forest-simon-folwar.mp3"
    );
    audioInstances.enchantedForest.loop = true; // Loop indefinitely
    audioInstances.enchantedForest.volume = 0.5;
  }

  audioInstances.enchantedForest.play();
}

export function stopEnchantedForest() {
  if (audioInstances.enchantedForest) {
    audioInstances.enchantedForest.pause();
  }
}
