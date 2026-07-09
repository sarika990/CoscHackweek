class AudioEngine {
  constructor() {
    this.sounds = {};
    this.masterVolume = 1.0;
    this.isMuted = false;
    this.audioContext = null;
    this.currentlyPlayingId = null;
    this.onTimeUpdateCallbacks = {};
    this.onEndedCallbacks = {};
    this.onStateChangeCallbacks = {};

    this.initAudioContext();
  }

  initAudioContext() {
    // Lazy initialize Web Audio API for synth fallbacks
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      this.audioContext = new AudioContextClass();
    }
  }

  resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  loadSounds(soundsData) {
    soundsData.forEach(sound => {
      const audio = new Audio();
      audio.src = sound.src;
      audio.preload = 'auto';

      const soundState = {
        id: sound.id,
        name: sound.name,
        category: sound.category,
        audio: audio,
        volume: 1.0,
        isLooping: false,
        isPlaying: false,
        isFailed: false,
        duration: 0,
        currentTime: 0
      };

      // Audio Event Listeners
      audio.addEventListener('loadedmetadata', () => {
        soundState.duration = audio.duration;
        this.triggerStateChange(sound.id);
      });

      audio.addEventListener('timeupdate', () => {
        soundState.currentTime = audio.currentTime;
        if (this.onTimeUpdateCallbacks[sound.id]) {
          this.onTimeUpdateCallbacks[sound.id](audio.currentTime, audio.duration);
        }
        if (this.currentlyPlayingId === sound.id) {
          this.triggerGlobalTimeUpdate(audio.currentTime, audio.duration);
        }
      });

      audio.addEventListener('play', () => {
        soundState.isPlaying = true;
        this.currentlyPlayingId = sound.id;
        this.triggerStateChange(sound.id);
      });

      audio.addEventListener('pause', () => {
        soundState.isPlaying = false;
        this.triggerStateChange(sound.id);
      });

      audio.addEventListener('ended', () => {
        soundState.isPlaying = false;
        this.triggerStateChange(sound.id);
        if (this.onEndedCallbacks[sound.id]) {
          this.onEndedCallbacks[sound.id]();
        }
        if (this.currentlyPlayingId === sound.id) {
          this.currentlyPlayingId = null;
          this.triggerGlobalTimeUpdate(0, soundState.duration);
        }
      });

      // Handle missing file or loading error
      audio.addEventListener('error', (e) => {
        console.warn(`Failed to load audio for ${sound.name}. Activating real-time synthesizer fallback!`);
        soundState.isFailed = true;
        // Mock a duration for synthesize fallback
        soundState.duration = this.getSynthDuration(sound.id);
        this.triggerStateChange(sound.id);
      });

      this.sounds[sound.id] = soundState;
    });
  }

  play(id) {
    this.resumeAudioContext();
    const sound = this.sounds[id];
    if (!sound) return;

    // Pause current playing sound if not looping or multi-track
    // But soundboards can play multiple sounds!
    // The now playing panel will track the latest played sound.
    this.currentlyPlayingId = id;

    if (sound.isFailed) {
      this.playSynthesizedSound(id);
    } else {
      sound.audio.play().catch(err => {
        console.warn(`Audio playback failed, attempting synthesis fallback: ${err.message}`);
        this.playSynthesizedSound(id);
      });
    }
  }

  pause(id) {
    const sound = this.sounds[id];
    if (!sound) return;

    if (sound.isFailed && sound.synthActive) {
      this.pauseSynthesizedSound(sound);
    } else if (!sound.isFailed) {
      sound.audio.pause();
    }
  }

  stop(id) {
    const sound = this.sounds[id];
    if (!sound) return;

    if (sound.isFailed && sound.synthActive) {
      this.stopSynthesizedSound(sound);
    } else if (!sound.isFailed) {
      sound.audio.pause();
      sound.audio.currentTime = 0;
    }
    sound.currentTime = 0;
    this.triggerStateChange(id);
  }

  seek(id, time) {
    const sound = this.sounds[id];
    if (!sound) return;

    const clampedTime = Math.max(0, Math.min(time, sound.duration));
    if (sound.isFailed && sound.synthActive) {
      sound.currentTime = clampedTime;
      // Restart synth at offset
      this.stopSynthesizedSound(sound);
      this.playSynthesizedSound(id, clampedTime);
    } else if (!sound.isFailed) {
      sound.audio.currentTime = clampedTime;
    }
  }

  setVolume(id, volume) {
    const sound = this.sounds[id];
    if (!sound) return;

    sound.volume = volume;
    this.updateAudioVolume(id);
  }

  setLoop(id, isLooping) {
    const sound = this.sounds[id];
    if (!sound) return;

    sound.isLooping = isLooping;
    if (!sound.isFailed) {
      sound.audio.loop = isLooping;
    }
    this.triggerStateChange(id);
  }

  setMasterVolume(volume) {
    this.masterVolume = volume;
    Object.keys(this.sounds).forEach(id => {
      this.updateAudioVolume(id);
    });
  }

  setMute(isMuted) {
    this.isMuted = isMuted;
    Object.keys(this.sounds).forEach(id => {
      this.updateAudioVolume(id);
    });
  }

  stopAll() {
    Object.keys(this.sounds).forEach(id => {
      this.stop(id);
    });
    this.currentlyPlayingId = null;
  }

  updateAudioVolume(id) {
    const sound = this.sounds[id];
    if (!sound) return;

    const finalVolume = this.isMuted ? 0 : (sound.volume * this.masterVolume);
    if (!sound.isFailed) {
      sound.audio.volume = finalVolume;
    }
    if (sound.synthActive && sound.gainNode) {
      sound.gainNode.gain.setValueAtTime(finalVolume, this.audioContext.currentTime);
    }
  }

  // --- Real-time Synthesizer Fallbacks ---
  getSynthDuration(id) {
    const durations = {
      piano: 1.5, drum: 0.5, clap: 0.4, bell: 2.0, guitar: 1.8,
      rain: 3.0, thunder: 3.0, bird: 1.2, cat: 1.5, applause: 3.0,
      laugh: 2.0, horn: 1.0
    };
    return durations[id] || 1.0;
  }

  playSynthesizedSound(id, offsetTime = 0) {
    if (!this.audioContext) return;
    const sound = this.sounds[id];
    if (!sound) return;

    // Stop active synth if already playing
    if (sound.synthActive) {
      this.stopSynthesizedSound(sound);
    }

    sound.synthActive = true;
    sound.isPlaying = true;
    sound.currentTime = offsetTime;

    const ctx = this.audioContext;
    const dest = ctx.destination;

    const gainNode = ctx.createGain();
    const finalVolume = this.isMuted ? 0 : (sound.volume * this.masterVolume);
    gainNode.gain.setValueAtTime(finalVolume, ctx.currentTime);
    gainNode.connect(dest);

    sound.gainNode = gainNode;
    sound.oscillators = [];
    sound.synthStartTime = ctx.currentTime - offsetTime;

    const duration = sound.duration;
    const remainingTime = duration - offsetTime;

    const tStart = ctx.currentTime;

    // Trigger state change
    this.triggerStateChange(id);

    // Synthesis routines based on sound type
    if (id === 'piano') {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(261.63, tStart); // Middle C
      gainNode.gain.setValueAtTime(finalVolume, tStart);
      gainNode.gain.exponentialRampToValueAtTime(0.001, tStart + remainingTime);
      osc.connect(gainNode);
      osc.start(tStart);
      osc.stop(tStart + remainingTime);
      sound.oscillators.push(osc);
    } 
    else if (id === 'drum') {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, tStart);
      osc.frequency.exponentialRampToValueAtTime(40, tStart + remainingTime);
      gainNode.gain.setValueAtTime(finalVolume, tStart);
      gainNode.gain.exponentialRampToValueAtTime(0.001, tStart + remainingTime);
      osc.connect(gainNode);
      osc.start(tStart);
      osc.stop(tStart + remainingTime);
      sound.oscillators.push(osc);
    } 
    else if (id === 'clap') {
      // Noise buffer for clap
      const bufferSize = ctx.sampleRate * remainingTime;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1000;
      gainNode.gain.setValueAtTime(finalVolume, tStart);
      gainNode.gain.exponentialRampToValueAtTime(0.001, tStart + remainingTime);
      noise.connect(filter);
      filter.connect(gainNode);
      noise.start(tStart);
      sound.oscillators.push(noise);
    } 
    else if (id === 'bell') {
      const freqs = [523.25, 783.99, 987.77];
      freqs.forEach(f => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = f;
        osc.connect(gainNode);
        osc.start(tStart);
        osc.stop(tStart + remainingTime);
        sound.oscillators.push(osc);
      });
      gainNode.gain.setValueAtTime(finalVolume, tStart);
      gainNode.gain.exponentialRampToValueAtTime(0.001, tStart + remainingTime);
    } 
    else if (id === 'guitar') {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(196.00, tStart);
      gainNode.gain.setValueAtTime(finalVolume, tStart);
      gainNode.gain.exponentialRampToValueAtTime(0.001, tStart + remainingTime);
      osc.connect(gainNode);
      osc.start(tStart);
      osc.stop(tStart + remainingTime);
      sound.oscillators.push(osc);
    }
    else if (id === 'rain' || id === 'thunder') {
      const bufferSize = ctx.sampleRate * remainingTime;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Pink/lowpass noise approximation
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = id === 'rain' ? 'highpass' : 'lowpass';
      filter.frequency.value = id === 'rain' ? 800 : 150;
      
      gainNode.gain.setValueAtTime(finalVolume, tStart);
      gainNode.gain.exponentialRampToValueAtTime(id === 'rain' ? finalVolume : 0.001, tStart + remainingTime);
      
      noise.connect(filter);
      filter.connect(gainNode);
      noise.start(tStart);
      sound.oscillators.push(noise);
    }
    else {
      // General fallbacks for bird, cat, applause, laugh, horn
      const osc = ctx.createOscillator();
      osc.type = id === 'horn' ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(id === 'cat' ? 300 : 440, tStart);
      if (id === 'cat') {
        osc.frequency.exponentialRampToValueAtTime(500, tStart + (remainingTime * 0.5));
        osc.frequency.exponentialRampToValueAtTime(250, tStart + remainingTime);
      }
      gainNode.gain.setValueAtTime(finalVolume, tStart);
      gainNode.gain.exponentialRampToValueAtTime(0.001, tStart + remainingTime);
      osc.connect(gainNode);
      osc.start(tStart);
      osc.stop(tStart + remainingTime);
      sound.oscillators.push(osc);
    }

    // Interval to simulate timeupdate
    sound.synthInterval = setInterval(() => {
      const current = ctx.currentTime - sound.synthStartTime;
      sound.currentTime = current;
      if (this.onTimeUpdateCallbacks[id]) {
        this.onTimeUpdateCallbacks[id](current, duration);
      }
      if (this.currentlyPlayingId === id) {
        this.triggerGlobalTimeUpdate(current, duration);
      }
    }, 100);

    // Timeout when sound ends
    sound.synthTimeout = setTimeout(() => {
      clearInterval(sound.synthInterval);
      sound.synthActive = false;
      sound.isPlaying = false;
      sound.currentTime = 0;
      this.triggerStateChange(id);
      
      if (this.onEndedCallbacks[id]) {
        this.onEndedCallbacks[id]();
      }
      if (this.currentlyPlayingId === id) {
        if (sound.isLooping) {
          this.playSynthesizedSound(id);
        } else {
          this.currentlyPlayingId = null;
          this.triggerGlobalTimeUpdate(0, duration);
        }
      }
    }, remainingTime * 1000);
  }

  pauseSynthesizedSound(sound) {
    this.stopSynthesizedSound(sound);
    sound.isPlaying = false;
    this.triggerStateChange(sound.id);
  }

  stopSynthesizedSound(sound) {
    if (sound.synthInterval) clearInterval(sound.synthInterval);
    if (sound.synthTimeout) clearTimeout(sound.synthTimeout);
    if (sound.oscillators) {
      sound.oscillators.forEach(osc => {
        try { osc.stop(); } catch(e) {}
      });
      sound.oscillators = [];
    }
    if (sound.gainNode) {
      try { sound.gainNode.disconnect(); } catch(e) {}
      sound.gainNode = null;
    }
    sound.synthActive = false;
    sound.isPlaying = false;
  }

  // Event Listeners
  onTimeUpdate(id, callback) {
    this.onTimeUpdateCallbacks[id] = callback;
  }

  onEnded(id, callback) {
    this.onEndedCallbacks[id] = callback;
  }

  onStateChange(id, callback) {
    this.onStateChangeCallbacks[id] = callback;
  }

  onGlobalTimeUpdate(callback) {
    this.globalTimeUpdateCallback = callback;
  }

  triggerStateChange(id) {
    if (this.onStateChangeCallbacks[id]) {
      this.onStateChangeCallbacks[id](this.sounds[id]);
    }
    if (this.globalStateChangeCallback) {
      this.globalStateChangeCallback();
    }
  }

  onGlobalStateChange(callback) {
    this.globalStateChangeCallback = callback;
  }

  triggerGlobalTimeUpdate(current, duration) {
    if (this.globalTimeUpdateCallback) {
      this.globalTimeUpdateCallback(current, duration);
    }
  }
}
