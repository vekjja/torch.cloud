"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AudioContextType {
  bgmVolume: number;
  sfxVolume: number;
  setBgmVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  playRandomBGM: () => void;
  menuSelect: () => void;
  lightTorch: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const bgmFiles = [
  "/sfx/bgm/magic-forest-kevin-macleod.mp3",
  "/sfx/bgm/enchanted-forest-simon-folwar.mp3",
  "/sfx/bgm/world-of-merge-bosnow.mp3",
  "/sfx/bgm/beyond-time-danijel-zambo.mp3",
  "/sfx/bgm/elven-tale-vocalista.mp3",
  "/sfx/bgm/the-bard-s-tale-simon-folwar.mp3",
];

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [bgmVolume, setBgmVolume] = useState(0.027);
  const [sfxVolume, setSfxVolume] = useState(0.3);
  const [currentBGM, setCurrentBGM] = useState<HTMLAudioElement | null>(null);

  let igniteSound: HTMLAudioElement | null = null;
  if (typeof window !== "undefined") {
    igniteSound = new Audio("/sfx/torch-lighting.mp3");
  }

  useEffect(() => {
    if (currentBGM) {
      currentBGM.volume = bgmVolume;
      console.log("🔊 BGM Volume Updated:", bgmVolume);
    }
  }, [bgmVolume, currentBGM]);

  const playRandomBGM = () => {
    if (!currentBGM || currentBGM.paused) {
      const randomIndex = Math.floor(Math.random() * bgmFiles.length);
      const selectedBGM = bgmFiles[randomIndex];

      const newBGM = new Audio(selectedBGM);

      // ✅ Ensure volume is applied before playing
      newBGM.volume = bgmVolume;
      newBGM.play().catch((err) => console.warn("🔇 Audio play blocked:", err));

      if (currentBGM) {
        currentBGM.pause();
        currentBGM.currentTime = 0;
      }

      setCurrentBGM(newBGM);
    }
  };

  const menuSelect = () => {
    const sound = new Audio("/sfx/menu.mp3");
    sound.volume = sfxVolume;
    sound
      .play()
      .catch((err) => console.warn("🔇 Menu sound play blocked:", err));
  };

  const lightTorch = () => {
    if (igniteSound) {
      igniteSound.volume = sfxVolume;
      igniteSound
        .play()
        .catch((err) => console.warn("🔇 Torch sound play blocked:", err));
    }
  };

  return (
    <AudioContext.Provider
      value={{
        bgmVolume,
        sfxVolume,
        setBgmVolume,
        setSfxVolume,
        playRandomBGM,
        menuSelect,
        lightTorch,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
