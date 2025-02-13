"use client";
import React, { createContext, useContext, useState } from "react";
import {
  bgmVolume,
  sfxVolume,
  setBgmVolume,
  setSfxVolume,
  globalAudioEnabled,
  setGlobalAudioEnabled,
  playMenuSFX,
  playRandomBGM,
  fadeOutBGM,
  playAudio,
  stopAudio,
} from "@/utils/audio";

interface AudioContextProps {
  bgmVolume: number;
  sfxVolume: number;
  globalAudioEnabled: boolean;
  setBgmVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  setGlobalAudioEnabled: (enabled: boolean) => void;
  playMenuSFX: () => void;
  playRandomBGM: () => void;
  fadeOutBGM: () => void;
  playAudio: (audio: HTMLAudioElement | null, volume?: number) => void;
  stopAudio: (audio: HTMLAudioElement | null) => void;
}

const AudioContext = createContext<AudioContextProps | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [bgm, setBgm] = useState(bgmVolume);
  const [sfx, setSfx] = useState(sfxVolume);
  const [audioEnabled, setAudioEnabled] = useState(globalAudioEnabled);

  const value = {
    bgmVolume: bgm,
    sfxVolume: sfx,
    globalAudioEnabled: audioEnabled,
    setBgmVolume: (volume: number) => {
      setBgm(volume);
      setBgmVolume(volume);
    },
    setSfxVolume: (volume: number) => {
      setSfx(volume);
      setSfxVolume(volume);
    },
    setGlobalAudioEnabled: (enabled: boolean) => {
      setAudioEnabled(enabled);
      setGlobalAudioEnabled(enabled);
    },
    playMenuSFX,
    playRandomBGM,
    fadeOutBGM,
    playAudio,
    stopAudio,
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
