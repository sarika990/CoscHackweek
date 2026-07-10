/**
 * AudioManager
 * Synthesizes retro-futuristic sound effects and background music using Web Audio API.
 * Manages Web Speech API for voice question playback.
 */
import { StorageManager } from './storage.js';

class AudioManagerClass {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.musicInterval = null;
    this.musicPlaying = false;
    this.isMuted = false;
    this.speechUtterance = null;
    this.speechCallbacks = null;

    // Load settings
    const settings = StorageManager.getSettings();
    this.soundEnabled = settings.soundEnabled;
    this.musicEnabled = settings.musicEnabled;
    this.volume = settings.volume;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.musicEnabled ? 0.35 : 0, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.soundEnabled ? 1 : 0, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      if (this.musicEnabled) {
        this.startBackgroundMusic();
      }
    } catch (e) {
      console.warn("Web Audio API not supported in this browser:", e);
    }
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(volume) {
    this.volume = volume;
    this.ensureContext();
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(volume, this.ctx.currentTime);
    }
  }

  toggleSound(enabled) {
    this.soundEnabled = enabled;
    this.ensureContext();
    if (this.sfxGain) {
      this.sfxGain.gain.setValueAtTime(enabled ? 1 : 0, this.ctx.currentTime);
    }
  }

  toggleMusic(enabled) {
    this.musicEnabled = enabled;
    this.ensureContext();
    if (this.musicGain) {
      this.musicGain.gain.setValueAtTime(enabled ? 0.35 : 0, this.ctx.currentTime);
    }
    if (enabled) {
      this.startBackgroundMusic();
    } else {
      this.stopBackgroundMusic();
    }
  }

  // --- Sound Effects Synthesizer ---

  playClick() {
    this.ensureContext();
    if (!this.soundEnabled || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playCorrect() {
    this.ensureContext();
    if (!this.soundEnabled || !this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Arpeggio: C5 (523.25Hz) then G5 (783.99Hz)
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.setValueAtTime(783.99, now + 0.08);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.setValueAtTime(0.4, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(now + 0.3);
  }

  playWrong() {
    this.ensureContext();
    if (!this.soundEnabled || !this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.25);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    // Apply lowpass filter for an industrial buzz sound
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(now + 0.35);
  }

  playTimerTick(isCritical = false) {
    this.ensureContext();
    if (!this.soundEnabled || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(isCritical ? 1200 : 800, this.ctx.currentTime);

    gain.gain.setValueAtTime(isCritical ? 0.25 : 0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  playVictory() {
    this.ensureContext();
    if (!this.soundEnabled || !this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C Major
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.2, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.4);
    });
  }

  playGameOver() {
    this.ensureContext();
    if (!this.soundEnabled || !this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [220.00, 207.65, 196.00, 174.61]; // descending minor vibe
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.15);

      gain.gain.setValueAtTime(0.25, now + idx * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.15 + 0.6);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now + idx * 0.15);
      osc.stop(now + idx * 0.15 + 0.6);
    });
  }

  // --- Synthesized Background Music (Cyber Ambient Drone) ---

  startBackgroundMusic() {
    if (this.musicPlaying || !this.musicEnabled) return;
    this.musicPlaying = true;
    
    // Play a ambient note cycle
    const notes = [110.00, 130.81, 146.83, 164.81]; // A2, C3, D3, E3
    let index = 0;

    const playDroneNote = () => {
      if (!this.musicPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(notes[index], now);
      // subtle modulation
      osc.frequency.linearRampToValueAtTime(notes[index] * 1.01, now + 2);
      osc.frequency.linearRampToValueAtTime(notes[index], now + 4);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 1.5);
      gain.gain.linearRampToValueAtTime(0.001, now + 3.8);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(150, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + 4);

      index = (index + 1) % notes.length;
    };

    // Trigger every 3.5 seconds to overlap notes beautifully
    playDroneNote();
    this.musicInterval = setInterval(playDroneNote, 3500);
  }

  stopBackgroundMusic() {
    this.musicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  // --- Voice / Speech Engine (Web Speech Synthesis) ---

  speak(text, answer, onStart, onEnd) {
    this.stopSpeech();
    this.ensureContext();

    if (!('speechSynthesis' in window)) {
      console.warn("Speech Synthesis is not supported in this browser.");
      if (onEnd) onEnd();
      return;
    }

    this.speechUtterance = new SpeechSynthesisUtterance(text);
    
    // Choose appropriate voice characteristics
    if (answer === 'AI') {
      // Robot setting
      this.speechUtterance.rate = 1.15;
      this.speechUtterance.pitch = 0.55;
    } else {
      // Human setting
      this.speechUtterance.rate = 0.95;
      this.speechUtterance.pitch = 1.05;
    }

    // Assign voice
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      // Look for Google English/US or Microsoft voices
      const targetVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
      this.speechUtterance.voice = targetVoice;
    }

    this.speechUtterance.onstart = () => {
      if (onStart) onStart();
    };

    this.speechUtterance.onend = () => {
      if (onEnd) onEnd();
    };

    this.speechUtterance.onerror = (e) => {
      console.error("Speech Synthesis Error:", e);
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(this.speechUtterance);
  }

  stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const AudioManager = new AudioManagerClass();
