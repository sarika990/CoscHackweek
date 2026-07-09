document.addEventListener('DOMContentLoaded', () => {
  // Initialize instances
  const audio = new AudioEngine();
  const ui = new UIManager(audio);

  // Load sound definition data
  audio.loadSounds(SOUNDS_DATA);

  // Restore initial LocalStorage states
  const savedMasterVol = localStorage.getItem('soundboard_master_volume');
  if (savedMasterVol !== null) {
    const vol = parseFloat(savedMasterVol);
    audio.setMasterVolume(vol);
    const masterVolSlider = document.getElementById('master-volume');
    if (masterVolSlider) masterVolSlider.value = vol;
  }

  const savedCategory = localStorage.getItem('soundboard_last_category');
  if (savedCategory) {
    ui.activeFilter = savedCategory;
  }

  // Init UI renderer
  ui.init(SOUNDS_DATA);

  // Theme Management (Light / Dark elegant)
  const themeToggle = document.getElementById('theme-toggle-btn');
  let currentTheme = localStorage.getItem('soundboard_theme') || 'theme-dark';
  
  document.body.className = currentTheme;
  updateThemeIcon(currentTheme);

  themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('theme-dark')) {
      document.body.classList.replace('theme-dark', 'theme-light');
      currentTheme = 'theme-light';
    } else {
      document.body.classList.replace('theme-light', 'theme-dark');
      currentTheme = 'theme-dark';
    }
    localStorage.setItem('soundboard_theme', currentTheme);
    updateThemeIcon(currentTheme);
    ui.showToast(`Switched to ${currentTheme === 'theme-dark' ? 'Dark' : 'Light'} Mode`);
  });

  function updateThemeIcon(theme) {
    if (theme === 'theme-dark') {
      themeToggle.innerHTML = `
        <svg viewBox="0 0 24 24" class="theme-icon" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      `;
    } else {
      themeToggle.innerHTML = `
        <svg viewBox="0 0 24 24" class="theme-icon" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      `;
    }
  }

  // Keyboard Shortcuts Listening
  window.addEventListener('keydown', (e) => {
    // Prevent trigger if typing inside search input
    if (document.activeElement === ui.searchBar) {
      return;
    }

    const pressedKey = e.key.toUpperCase();
    const soundMatch = SOUNDS_DATA.find(s => s.shortcut.toUpperCase() === pressedKey);
    
    if (soundMatch) {
      e.preventDefault();
      // Visual feedback in UI
      ui.triggerVisualKeyboardPress(soundMatch.id);
      // Play Sound
      audio.play(soundMatch.id);
      ui.showToast(`Keyboard play: ${soundMatch.name}`);
    }
  });
});
