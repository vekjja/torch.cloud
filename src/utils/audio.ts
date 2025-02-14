// src/app/components/AudioControls.tsx
"use client";

export let bgmVolume = 0.27;
export let sfxVolume = 0.27;
export let globalVoice = "onyx";
export let globalStopBGMNarrate = true;
export let globalAudioEnabled = true;

export const availableVoices = [
  "alloy",
  "ash",
  "coral",
  "echo",
  "fable",
  "onyx",
  "nova",
  "sage",
  "shimmer",
];

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

export function setGlobalVoice(voice: string) {
  globalVoice = voice;
}

export function playMenuSFX() {
  playAudio(new Audio("/sfx/menu.mp3"), sfxVolume);
}

export function igniteTorch() {
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

export function setGlobalStopBGMNarrate(stop: boolean) {
  globalStopBGMNarrate = stop;
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

export function playAudio(
  audio: HTMLAudioElement | null,
  volume: number = 1.0
) {
  if (audio && globalAudioEnabled && volume > 0) {
    audio.volume = volume;
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
  }
}

export function playAudioOnce(
  audio: HTMLAudioElement | null,
  volume: number = 1.0
) {
  if (audio && globalAudioEnabled && volume > 0) {
    audio.onended = () => {
      stopAudio(audio);
    };
    playAudio(audio, volume);
  }
}

export function stopAudio(audio: HTMLAudioElement | null) {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.remove();
    audio = null;
  }
}

export function toggleAudio(audio: HTMLAudioElement | null) {
  if (audio) {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
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

export function fadePauseAudio(audio: HTMLAudioElement | null) {
  if (audio) {
    let volume = audio.volume;
    const fadeOut = setInterval(() => {
      volume -= 0.27;
      if (volume <= 0) {
        clearInterval(fadeOut);
        audio.pause();
      } else {
        audio.volume = volume;
      }
    }, 200);
  }
}

export function fadeInAudio(
  audio: HTMLAudioElement | null,
  volume: number = 1.0
) {
  if (audio && globalAudioEnabled && volume > 0) {
    audio.volume = 0;
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
    const fadeIn = setInterval(() => {
      audio.volume += 0.027;
      if (audio.volume >= volume) {
        clearInterval(fadeIn);
      }
    }, 200);
  }
}

export function narrateAudio(audio: HTMLAudioElement | null) {
  if (!audio || !globalAudioEnabled) return;
  if (audio.paused) {
    if (globalStopBGMNarrate) {
      fadePauseAudio(currentBGM);
    }
    audio.onended = () => {
      if (globalStopBGMNarrate) {
        fadeInAudio(currentBGM, bgmVolume);
      }
    };
    playAudio(audio);
  } else {
    audio.pause();
    if (globalStopBGMNarrate) {
      fadeInAudio(currentBGM, bgmVolume);
    }
  }
}

export function playRandomBGM() {
  if (!globalAudioEnabled) return;
  if (!currentBGM && bgmVolume > 0) {
    const bgm = randomBGM();
    currentBGM = bgm;
    currentBGM.volume = bgmVolume;
    playAudioOnce(bgm, bgmVolume);
  } else if (currentBGM && bgmVolume > 0) {
    currentBGM.play();
  }
}

export function randomBGM() {
  const bgmf = bgmFiles[Math.floor(Math.random() * bgmFiles.length)];
  const bgm = new Audio(bgmf);
  bgm.volume = bgmVolume;
  return bgm;
}

export function stopBGM() {
  stopAudio(currentBGM);
}

export function fadeOutBGM() {
  fadeOutAudio(currentBGM);
}

export function pauseBGM() {
  fadePauseAudio(currentBGM);
}
