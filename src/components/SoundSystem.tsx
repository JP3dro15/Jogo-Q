import { useEffect, useRef, useState } from 'react';

interface SoundSystemProps {
  enabled?: boolean;
  volume?: number;
}

class SoundManager {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private isEnabled = true;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.3; // Default volume
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  async generateTone(frequency: number, duration: number, type: OscillatorType = 'sine'): Promise<void> {
    if (!this.audioContext || !this.masterGain || !this.isEnabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;

    // Envelope for smooth sound
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Chemical reaction sounds
  async playCorrectAnswer(): Promise<void> {
    // Crystalline success sound
    await this.generateTone(880, 0.1, 'sine');
    setTimeout(() => this.generateTone(1100, 0.15, 'sine'), 100);
    setTimeout(() => this.generateTone(1320, 0.2, 'sine'), 200);
  }

  async playWrongAnswer(): Promise<void> {
    // Acidic error sound
    await this.generateTone(200, 0.3, 'sawtooth');
    setTimeout(() => this.generateTone(180, 0.2, 'sawtooth'), 150);
  }

  async playButtonClick(): Promise<void> {
    // Holographic interface click
    await this.generateTone(800, 0.05, 'square');
  }

  async playHover(): Promise<void> {
    // Subtle hover feedback
    await this.generateTone(600, 0.03, 'sine');
  }

  async playTransition(): Promise<void> {
    // Scene transition whoosh
    if (!this.audioContext || !this.masterGain || !this.isEnabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.8);
    oscillator.type = 'sawtooth';

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.8);

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.8);
  }

  async playAmbientDrone(): Promise<void> {
    // Post-apocalyptic ambient background
    if (!this.audioContext || !this.masterGain || !this.isEnabled) return;

    const oscillator1 = this.audioContext.createOscillator();
    const oscillator2 = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    oscillator1.connect(filter);
    oscillator2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator1.frequency.value = 60;
    oscillator2.frequency.value = 90;
    oscillator1.type = 'sawtooth';
    oscillator2.type = 'sine';

    filter.type = 'lowpass';
    filter.frequency.value = 300;
    filter.Q.value = 5;

    gainNode.gain.value = 0.05; // Very quiet ambient

    oscillator1.start();
    oscillator2.start();

    // Stop after 10 seconds
    setTimeout(() => {
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext!.currentTime + 2);
      setTimeout(() => {
        oscillator1.stop();
        oscillator2.stop();
      }, 2000);
    }, 8000);
  }

  async playMoleculeInteraction(): Promise<void> {
    // Chemical bonding sound
    await this.generateTone(440, 0.1, 'sine');
    setTimeout(() => this.generateTone(554, 0.1, 'sine'), 50);
    setTimeout(() => this.generateTone(659, 0.15, 'sine'), 100);
  }

  setVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  // Resume audio context (required by browsers after user interaction)
  async resume(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }
}

// Singleton sound manager instance
const soundManager = new SoundManager();

export const SoundSystem = ({ enabled = true, volume = 0.3 }: SoundSystemProps) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    soundManager.setEnabled(enabled);
    soundManager.setVolume(volume);
    
    if (enabled && !isInitialized) {
      // Initialize audio context on first user interaction
      const handleFirstInteraction = async () => {
        await soundManager.resume();
        setIsInitialized(true);
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('keydown', handleFirstInteraction);
      };

      document.addEventListener('click', handleFirstInteraction);
      document.addEventListener('keydown', handleFirstInteraction);

      return () => {
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('keydown', handleFirstInteraction);
      };
    }
  }, [enabled, volume, isInitialized]);

  return null; // This component doesn't render anything
};

// Hook to use the sound system
export const useSound = () => {
  return {
    playCorrect: () => soundManager.playCorrectAnswer(),
    playWrong: () => soundManager.playWrongAnswer(),
    playClick: () => soundManager.playButtonClick(),
    playHover: () => soundManager.playHover(),
    playTransition: () => soundManager.playTransition(),
    playAmbient: () => soundManager.playAmbientDrone(),
    playMolecule: () => soundManager.playMoleculeInteraction(),
    setVolume: (volume: number) => soundManager.setVolume(volume),
    setEnabled: (enabled: boolean) => soundManager.setEnabled(enabled)
  };
};

export default SoundSystem;