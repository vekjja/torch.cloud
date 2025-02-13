// src/app/components/AudioControls.tsx
"use client";

export let bgmVolume = 0.27;
export let sfxVolume = 0.27;
export let globalAudioEnabled = true;

let igniteSound: HTMLAudioElement | null = null;
let currentBGM: HTMLAudioElement | null = null;

const bgmFiles = [
  "/sfx/bgm/magic-forest-kevin-macleod.mp3",
  "/sfx/bgm/enchanted-forest-simon-folwar.mp3",
  "/sfx/bgm/world-of-merge-bosnow.mp3",
  "/sfx/bgm/beyond-time-danijel-zambo.mp3",
  "/sfx/bgm/elven-tale-vocalista.mp3",
  "/sfx/bgm/the-bard-s-tale-simon-folwar.mp3",
];

if (typeof window !== "undefined") {
  igniteSound = new Audio("/sfx/torch-lighting.mp3");
}

export function menuSelect() {
  playAudio(new Audio("/sfx/menu.mp3"), sfxVolume);
}

export function lightTorch() {
  playAudio(igniteSound, sfxVolume);
}

export function setGlobalAudioEnabled(enabled: boolean) {
  globalAudioEnabled = enabled;
  if (!globalAudioEnabled) {
    console.log("🔇 Audio disabled");
    stopBGM();
  } else {
    console.log("🔊 Audio enabled");
  }
}

export function playAudio(
  audio: HTMLAudioElement | null,
  volume: number = 1.0
) {
  if (audio && globalAudioEnabled && volume > 0) {
    audio.volume = volume;
    audio.play();
    audio.onended = () => {
      audio?.remove();
    };
  }
}

export function stopAudio(audio: HTMLAudioElement | null) {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}

export function fadeOutAudio(audio: HTMLAudioElement | null) {
  if (audio) {
    let volume = audio.volume;
    const fadeOut = setInterval(() => {
      volume -= 0.1;
      if (volume <= 0) {
        clearInterval(fadeOut);
        stopAudio(audio);
      } else {
        audio.volume = volume;
      }
    }, 200);
  }
}

export function setBgmVolume(volume: number) {
  bgmVolume = volume;
  if (volume <= 0) {
    stopBGM();
  }
  if (currentBGM) {
    currentBGM.volume = volume;
  }
}

export function setSfxVolume(volume: number) {
  sfxVolume = volume;
}

export function randomBGM() {
  const bgmf = bgmFiles[Math.floor(Math.random() * bgmFiles.length)];
  const bgm = new Audio(bgmf);
  bgm.volume = bgmVolume;
  return bgm;
}

export function playRandomBGM() {
  if (!globalAudioEnabled) return;
  if (!currentBGM || (currentBGM.paused && bgmVolume > 0)) {
    const bgm = randomBGM();
    currentBGM = bgm;
    currentBGM.volume = bgmVolume;
    currentBGM.play();
    currentBGM.onended = () => {
      currentBGM?.remove();
    };
  }
}

export function stopBGM() {
  if (currentBGM) {
    currentBGM.pause();
    currentBGM.currentTime = 0;
    currentBGM = null;
  }
}

export function fadeOutBGM() {
  if (currentBGM) {
    let volume = bgmVolume;
    const fadeOut = setInterval(() => {
      volume -= 0.1;
      if (volume <= 0) {
        clearInterval(fadeOut);
        stopBGM();
      } else {
        currentBGM!.volume = volume;
      }
    }, 200);
  }
}
