let menuSound: HTMLAudioElement | null = null;
let ignite: HTMLAudioElement | null = null;
let magicForrest: HTMLAudioElement | null = null;
let enchantedForest: HTMLAudioElement | null = null;

if (typeof window !== "undefined") {
  menuSound = new Audio("/sfx/menu.mp3");
  ignite = new Audio("/sfx/torch-lighting.mp3");
  magicForrest = new Audio("/sfx/magic-forest-kevin-macleod.mp3");
  enchantedForest = new Audio("/sfx/enchanted-forest-simon-folwar.mp3");
}

export function menuSelect(volume: number = 1.0) {
  if (menuSound) {
    menuSound.volume = volume;
    menuSound.play();
    menuSound.onended = () => {
      menuSound?.remove(); // Cleanup after playing
    };
  }
}

export function lightTorch(volume: number = 1.0) {
  if (ignite) {
    ignite.volume = volume;
    ignite.play();
    ignite.onended = () => {
      ignite?.remove(); // Cleanup after playing
    };
  }
}

export function playMagicForrest(volume: number = 0.5) {
  if (magicForrest && magicForrest.paused) {
    magicForrest.volume = volume;
    magicForrest.play();
    magicForrest.onended = () => {
      magicForrest?.remove(); // Cleanup after playing
    };
  }
}

export function playEnchantedForest(volume: number = 0.5) {
  if (enchantedForest && enchantedForest.paused) {
    enchantedForest.volume = volume;
    enchantedForest.play();
    enchantedForest.onended = () => {
      enchantedForest?.remove(); // Cleanup after playing
    };
  }
}

export function playRandomForest(volume: number = 0.5) {
  const random = Math.random();
  if (random > 0.5) {
    playMagicForrest(volume);
  } else {
    playEnchantedForest(volume);
  }
}
