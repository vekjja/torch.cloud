export let menuSound: HTMLAudioElement | null = null;
export let igniteSound: HTMLAudioElement | null = null;
let currentBGM: HTMLAudioElement | null = null;

const bgmFiles = [
  "/sfx/bgm/magic-forest-kevin-macleod.mp3",
  "/sfx/bgm/enchanted-forest-simon-folwar.mp3",
  "/sfx/bgm/world-of-merge-bosnow.mp3",
];

if (typeof window !== "undefined") {
  menuSound = new Audio("/sfx/menu.mp3");
  igniteSound = new Audio("/sfx/torch-lighting.mp3");
}

export function menuSelect(volume: number = 1.0) {
  playAudio(menuSound, volume);
}

export function lightTorch(volume: number = 1.0) {
  playAudio(igniteSound, volume);
}

export function playAudio(
  audio: HTMLAudioElement | null,
  volume: number = 1.0
) {
  if (audio) {
    audio.volume = volume;
    audio.play();
    audio.onended = () => {
      audio?.remove(); // Cleanup after playing
    };
  }
}

export function playRandomBGM() {
  if (!currentBGM || currentBGM.paused) {
    // Select a random BGM file
    const randomIndex = Math.floor(Math.random() * bgmFiles.length);
    const selectedBGM = bgmFiles[randomIndex];

    // Create a new audio instance
    currentBGM = new Audio(selectedBGM);
    currentBGM.play();
  }
}
