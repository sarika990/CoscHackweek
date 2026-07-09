class UIManager {
  constructor(audioEngine) {
    this.audio = audioEngine;
    this.container = document.getElementById('soundboard-grid');
    this.searchBar = document.getElementById('search-bar');
    this.activeFilter = 'All';
    this.searchQuery = '';
    this.favorites = new Set();
    
    // Now playing panel references
    this.nowPlayingPanel = document.getElementById('now-playing-panel');
    this.nowPlayingName = document.getElementById('now-playing-name');
    this.nowPlayingStatus = document.getElementById('now-playing-status');
    this.nowPlayingProgress = document.getElementById('now-playing-progress');
    this.nowPlayingCurrentTime = document.getElementById('now-playing-current');
    this.nowPlayingDuration = document.getElementById('now-playing-duration');
    this.nowPlayingProgressFill = document.getElementById('now-playing-fill');
    this.nowPlayingPlayBtn = document.getElementById('now-playing-play');
    this.nowPlayingPauseBtn = document.getElementById('now-playing-pause');
    this.nowPlayingStopBtn = document.getElementById('now-playing-stop');
    this.nowPlayingLoopBtn = document.getElementById('now-playing-loop');
    this.nowPlayingVolumeSlider = document.getElementById('now-playing-volume');
  }

  init(soundsData) {
    this.soundsData = soundsData;
    this.loadFavorites();
    this.renderFilters();
    this.renderCards();
    this.setupGlobalControls();
    this.setupSearch();
    this.setupNowPlayingPanel();
    this.updateActiveSoundCount();
  }

  loadFavorites() {
    const saved = localStorage.getItem('soundboard_favorites');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.favorites = new Set(parsed);
      } catch (e) {
        console.error('Failed to load favorites', e);
      }
    }
  }

  saveFavorites() {
    localStorage.setItem('soundboard_favorites', JSON.stringify(Array.from(this.favorites)));
  }

  toggleFavorite(id) {
    if (this.favorites.has(id)) {
      this.favorites.delete(id);
      this.showToast(`Removed from favorites`);
    } else {
      this.favorites.add(id);
      this.showToast(`Added to favorites!`);
    }
    this.saveFavorites();
    this.updateCardFavoriteState(id);
  }

  renderFilters() {
    const filterContainer = document.getElementById('filter-tabs');
    filterContainer.innerHTML = '';
    
    CATEGORIES.forEach(category => {
      const button = document.createElement('button');
      button.className = `filter-tab ${this.activeFilter === category ? 'active' : ''}`;
      button.innerText = category;
      button.setAttribute('aria-label', `Filter by ${category}`);
      button.addEventListener('click', () => {
        document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
        button.classList.add('active');
        this.activeFilter = category;
        localStorage.setItem('soundboard_last_category', category);
        this.renderCards();
      });
      filterContainer.appendChild(button);
    });
  }

  renderCards() {
    this.container.innerHTML = '';
    const filtered = this.soundsData.filter(sound => {
      const matchesCategory = this.activeFilter === 'All' || sound.category === this.activeFilter;
      const matchesSearch = sound.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                            sound.category.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      this.container.innerHTML = `
        <div class="no-results">
          <svg viewBox="0 0 24 24" class="no-results-icon" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <p>No sounds found matching "${this.searchQuery}"</p>
        </div>
      `;
      return;
    }

    filtered.forEach(sound => {
      const card = this.createCardElement(sound);
      this.container.appendChild(card);
      
      // Hook audio engine event updates
      this.audio.onStateChange(sound.id, (state) => {
        this.updateCardUIState(card, state);
        if (this.audio.currentlyPlayingId === sound.id) {
          this.updateNowPlayingPanelState(state);
        }
      });

      this.audio.onTimeUpdate(sound.id, (current, duration) => {
        this.updateCardProgress(card, current, duration);
      });
      
      // Trigger initial state sync
      const state = this.audio.sounds[sound.id];
      if (state) {
        this.updateCardUIState(card, state);
      }
    });
  }

  createCardElement(sound) {
    const card = document.createElement('div');
    card.className = `sound-card ${this.audio.sounds[sound.id]?.isPlaying ? 'playing' : ''}`;
    card.id = `card-${sound.id}`;
    card.setAttribute('data-id', sound.id);

    const isFav = this.favorites.has(sound.id);
    const soundState = this.audio.sounds[sound.id] || { isLooping: false, volume: 1.0, duration: 0 };

    card.innerHTML = `
      <div class="card-shortcut" title="Keyboard Shortcut">Key ${sound.shortcut}</div>
      <button class="card-favorite-btn ${isFav ? 'active' : ''}" aria-label="Favorite ${sound.name}">
        <svg viewBox="0 0 24 24" class="heart-icon" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>

      <div class="card-icon-container">
        ${sound.icon}
        <div class="card-equalizer">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
      </div>

      <div class="card-info">
        <h3 class="card-title">${sound.name}</h3>
        <span class="card-category">${sound.category}</span>
      </div>

      <!-- Live Mini Progress -->
      <div class="card-progress-container" aria-label="Audio progress">
        <div class="card-progress-bar">
          <div class="card-progress-fill" style="width: 0%"></div>
        </div>
        <div class="card-progress-time">
          <span class="card-time-current">0:00</span>
          <span class="card-time-duration">${this.formatTime(soundState.duration || this.audio.getSynthDuration(sound.id))}</span>
        </div>
      </div>

      <!-- Individual Sound Controls -->
      <div class="card-controls">
        <button class="control-btn play-btn" aria-label="Play ${sound.name}">
          <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </button>
        <button class="control-btn pause-btn" aria-label="Pause ${sound.name}" style="display: none;">
          <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        </button>
        <button class="control-btn stop-btn" aria-label="Stop ${sound.name}">
          <svg viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16"/></svg>
        </button>
        <button class="control-btn loop-btn ${soundState.isLooping ? 'active' : ''}" aria-label="Toggle Loop">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
        </button>
      </div>

      <!-- Volume Indicator -->
      <div class="card-volume-container">
        <svg viewBox="0 0 24 24" class="volume-icon" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg>
        <input type="range" class="card-volume-slider" min="0" max="1" step="0.05" value="${soundState.volume}" aria-label="Volume for ${sound.name}">
      </div>
    `;

    // Event Bindings
    card.querySelector('.play-btn').addEventListener('click', () => this.audio.play(sound.id));
    card.querySelector('.pause-btn').addEventListener('click', () => this.audio.pause(sound.id));
    card.querySelector('.stop-btn').addEventListener('click', () => this.audio.stop(sound.id));
    card.querySelector('.loop-btn').addEventListener('click', () => this.audio.setLoop(sound.id, !this.audio.sounds[sound.id].isLooping));
    card.querySelector('.card-favorite-btn').addEventListener('click', () => this.toggleFavorite(sound.id));
    
    // Seek support inside mini progress bar
    const progressContainer = card.querySelector('.card-progress-container');
    progressContainer.addEventListener('click', (e) => {
      const rect = progressContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const state = this.audio.sounds[sound.id];
      if (state && state.duration) {
        const percentage = clickX / width;
        this.audio.seek(sound.id, percentage * state.duration);
      }
    });

    const volSlider = card.querySelector('.card-volume-slider');
    volSlider.addEventListener('input', (e) => {
      this.audio.setVolume(sound.id, parseFloat(e.target.value));
    });

    return card;
  }

  updateCardFavoriteState(id) {
    const card = document.getElementById(`card-${id}`);
    if (!card) return;
    const favBtn = card.querySelector('.card-favorite-btn');
    const isFav = this.favorites.has(id);
    if (isFav) {
      favBtn.classList.add('active');
      favBtn.querySelector('svg').setAttribute('fill', 'currentColor');
    } else {
      favBtn.classList.remove('active');
      favBtn.querySelector('svg').setAttribute('fill', 'none');
    }
  }

  updateCardUIState(card, state) {
    const playBtn = card.querySelector('.play-btn');
    const pauseBtn = card.querySelector('.pause-btn');
    const loopBtn = card.querySelector('.loop-btn');
    const durationLabel = card.querySelector('.card-time-duration');
    
    // Toggle play/pause buttons
    if (state.isPlaying) {
      card.classList.add('playing');
      playBtn.style.display = 'none';
      pauseBtn.style.display = 'inline-flex';
    } else {
      card.classList.remove('playing');
      playBtn.style.display = 'inline-flex';
      pauseBtn.style.display = 'none';
    }

    // Toggle loop active state
    if (state.isLooping) {
      loopBtn.classList.add('active');
    } else {
      loopBtn.classList.remove('active');
    }

    if (state.duration) {
      durationLabel.innerText = this.formatTime(state.duration);
    }
  }

  updateCardProgress(card, current, duration) {
    const progressFill = card.querySelector('.card-progress-fill');
    const currentLabel = card.querySelector('.card-time-current');
    
    const percentage = duration > 0 ? (current / duration) * 100 : 0;
    progressFill.style.width = `${percentage}%`;
    currentLabel.innerText = this.formatTime(current);
  }

  setupGlobalControls() {
    const masterVolSlider = document.getElementById('master-volume');
    const muteBtn = document.getElementById('mute-all-btn');
    const stopAllBtn = document.getElementById('stop-all-btn');
    const playRandomBtn = document.getElementById('play-random-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Master volume slider
    masterVolSlider.addEventListener('input', (e) => {
      const vol = parseFloat(e.target.value);
      this.audio.setMasterVolume(vol);
      localStorage.setItem('soundboard_master_volume', vol);
    });

    // Mute All Button
    muteBtn.addEventListener('click', () => {
      const isMuted = !this.audio.isMuted;
      this.audio.setMute(isMuted);
      muteBtn.classList.toggle('active', isMuted);
      if (isMuted) {
        muteBtn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9 2 9 2 15 6 15 11 19 11 5Z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
          Muted
        `;
        this.showToast('All sounds muted');
      } else {
        muteBtn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          Mute All
        `;
        this.showToast('Audio unmuted');
      }
    });

    // Stop All Button
    stopAllBtn.addEventListener('click', () => {
      this.audio.stopAll();
      this.showToast('Stopped all sounds');
    });

    // Play Random Button
    playRandomBtn.addEventListener('click', () => {
      const randomSound = this.soundsData[Math.floor(Math.random() * this.soundsData.length)];
      if (randomSound) {
        this.audio.play(randomSound.id);
        this.showToast(`Playing random: ${randomSound.name}`);
      }
    });

    // Shuffle Button (plays up to 3 random sounds together for fun)
    shuffleBtn.addEventListener('click', () => {
      this.audio.stopAll();
      const shuffled = [...this.soundsData].sort(() => 0.5 - Math.random());
      const count = Math.min(3, shuffled.length);
      for (let i = 0; i < count; i++) {
        this.audio.play(shuffled[i].id);
      }
      this.showToast(`Shuffled! Playing combo of ${count} sounds`);
    });

    // Reset Button (clears favorites, volumes, loops, search)
    resetBtn.addEventListener('click', () => {
      this.audio.stopAll();
      this.favorites.clear();
      this.saveFavorites();
      
      // Reset sliders and filters
      masterVolSlider.value = 1.0;
      this.audio.setMasterVolume(1.0);
      this.searchBar.value = '';
      this.searchQuery = '';
      this.activeFilter = 'All';
      
      localStorage.removeItem('soundboard_favorites');
      localStorage.removeItem('soundboard_master_volume');
      localStorage.removeItem('soundboard_last_category');

      this.renderFilters();
      this.renderCards();
      this.showToast('Soundboard reset successfully');
    });
  }

  setupSearch() {
    this.searchBar.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.renderCards();
      this.updateActiveSoundCount();
    });
  }

  updateActiveSoundCount() {
    const counter = document.getElementById('sound-counter');
    if (!counter) return;
    const count = this.container.querySelectorAll('.sound-card').length;
    counter.innerText = `${count} Sound${count !== 1 ? 's' : ''} available`;
  }

  setupNowPlayingPanel() {
    this.audio.onGlobalTimeUpdate((current, duration) => {
      const percentage = duration > 0 ? (current / duration) * 100 : 0;
      this.nowPlayingProgressFill.style.width = `${percentage}%`;
      this.nowPlayingCurrentTime.innerText = this.formatTime(current);
      this.nowPlayingDuration.innerText = this.formatTime(duration);
    });

    this.audio.onGlobalStateChange(() => {
      const activeId = this.audio.currentlyPlayingId;
      if (!activeId) {
        this.nowPlayingPanel.classList.remove('active');
        return;
      }
      const sound = this.audio.sounds[activeId];
      if (sound) {
        this.nowPlayingPanel.classList.add('active');
        this.nowPlayingName.innerText = sound.name;
        this.nowPlayingStatus.innerText = sound.isPlaying ? 'Playing' : 'Paused';
        
        if (sound.isPlaying) {
          this.nowPlayingPlayBtn.style.display = 'none';
          this.nowPlayingPauseBtn.style.display = 'inline-flex';
        } else {
          this.nowPlayingPlayBtn.style.display = 'inline-flex';
          this.nowPlayingPauseBtn.style.display = 'none';
        }

        this.nowPlayingLoopBtn.classList.toggle('active', sound.isLooping);
      }
    });

    // Panel controls
    this.nowPlayingPlayBtn.addEventListener('click', () => {
      if (this.audio.currentlyPlayingId) this.audio.play(this.audio.currentlyPlayingId);
    });
    this.nowPlayingPauseBtn.addEventListener('click', () => {
      if (this.audio.currentlyPlayingId) this.audio.pause(this.audio.currentlyPlayingId);
    });
    this.nowPlayingStopBtn.addEventListener('click', () => {
      if (this.audio.currentlyPlayingId) this.audio.stop(this.audio.currentlyPlayingId);
    });
    this.nowPlayingLoopBtn.addEventListener('click', () => {
      const activeId = this.audio.currentlyPlayingId;
      if (activeId) {
        const sound = this.audio.sounds[activeId];
        this.audio.setLoop(activeId, !sound.isLooping);
      }
    });

    // Progress Bar clicking (seek) in Now Playing panel
    this.nowPlayingProgress.addEventListener('click', (e) => {
      const activeId = this.audio.currentlyPlayingId;
      if (!activeId) return;
      const sound = this.audio.sounds[activeId];
      if (sound && sound.duration) {
        const rect = this.nowPlayingProgress.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const percentage = clickX / width;
        this.audio.seek(activeId, percentage * sound.duration);
      }
    });

    // Volume inside Now Playing panel
    this.nowPlayingVolumeSlider.addEventListener('input', (e) => {
      const activeId = this.audio.currentlyPlayingId;
      if (activeId) {
        this.audio.setVolume(activeId, parseFloat(e.target.value));
      }
    });
  }

  updateNowPlayingPanelState(state) {
    if (this.audio.currentlyPlayingId === state.id) {
      this.nowPlayingStatus.innerText = state.isPlaying ? 'Playing' : 'Paused';
      this.nowPlayingLoopBtn.classList.toggle('active', state.isLooping);
      
      const volSlider = this.nowPlayingPanel.querySelector('.now-playing-volume-slider');
      if (volSlider) volSlider.value = state.volume;
    }
  }

  triggerVisualKeyboardPress(id) {
    const card = document.getElementById(`card-${id}`);
    if (!card) return;
    card.classList.add('keyboard-pulse');
    setTimeout(() => {
      card.classList.remove('keyboard-pulse');
    }, 300);
  }

  formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    
    container.appendChild(toast);
    
    // Animate in and out
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }
}
