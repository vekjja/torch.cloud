// src/utils/audio.ts

const audioRef: { current: HTMLAudioElement | null } = { current: null };

const ignite = new Audio("/sfx/torch-lighting.mp3");
const enchantedForest = new Audio("/sfx/enchanted-forest-simon-folwar.mp3");

export function lightTorch() {
  // Create or reuse the audio element
  if (!audioRef.current || audioRef.current === enchantedForest) {
    const torchAudio = ignite.cloneNode(true) as HTMLAudioElement;
    torchAudio.volume = 1.0;
    torchAudio.play();
    torchAudio.onended = () => {
      torchAudio.remove(); // Clean up the element after it finishes playing
    };
  }
}

export function playEnchantedForest() {
  if (audioRef.current?.paused === false) return; // Prevent multiple plays

  // Create or reuse the audio element
  if (!audioRef.current) {
    audioRef.current = enchantedForest;
    audioRef.current.volume = 0.5;
    audioRef.current.onended = () => {
      audioRef.current = null; // Reset so it can be played again
    };
  }

  audioRef.current.play();
}
