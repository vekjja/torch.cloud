// // src/app/components/AudioControls.tsx
// "use client";

// export let igniteSound: HTMLAudioElement | null = null;
// let currentBGM: HTMLAudioElement | null = null;
// let bgmVolume = 0.25;
// let sfxVolume = 0.8;
// let playBGM = true;

// const bgmFiles = [
//   "/sfx/bgm/magic-forest-kevin-macleod.mp3",
//   "/sfx/bgm/enchanted-forest-simon-folwar.mp3",
//   "/sfx/bgm/world-of-merge-bosnow.mp3",
// ];

// if (typeof window !== "undefined") {
//   igniteSound = new Audio("/sfx/torch-lighting.mp3");
// }

// export function menuSelect() {
//   playAudio(new Audio("/sfx/menu.mp3"), sfxVolume);
// }

// export function lightTorch() {
//   playAudio(igniteSound, sfxVolume);
// }

// export function playAudio(
//   audio: HTMLAudioElement | null,
//   volume: number = 1.0
// ) {
//   if (audio) {
//     audio.volume = volume;
//     audio.play();
//     audio.onended = () => {
//       audio?.remove(); // Cleanup after playing
//     };
//   }
// }

// export function setVolume(bgm: number, sfx: number) {
//   bgmVolume = bgm;
//   sfxVolume = sfx;
//   if (currentBGM) {
//     currentBGM.volume = bgmVolume;
//   }
// }

// export function playRandomBGM() {
//   if (!currentBGM || (currentBGM.paused && playBGM)) {
//     // Select a random BGM file
//     const randomIndex = Math.floor(Math.random() * bgmFiles.length);
//     const selectedBGM = bgmFiles[randomIndex];
//     // Create a new audio instance
//     currentBGM = new Audio(selectedBGM);
//     currentBGM.volume = bgmVolume;
//     currentBGM.play();
//   }
// }
