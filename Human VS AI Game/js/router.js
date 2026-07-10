/**
 * SPA Router
 * Dynamically swaps views in the main application container and runs screen initialization lifecycle hooks.
 */
import { AudioManager } from './audio.js';
import { StorageManager } from './storage.js';
import { StatisticsManager } from './statistics.js';
import { AchievementsManager, ACHIEVEMENT_LIST } from './achievements.js';
import { LeaderboardManager } from './leaderboard.js';
import { GameEngine } from './game.js';
import { UIManager } from './ui.js';
import { AnimationsManager } from './animations.js';

class RouterClass {
  constructor() {
    this.viewport = null;
    this.currentView = null;
  }

  init(viewportElement) {
    this.viewport = viewportElement;
    
    // Bind hash change listener
    window.addEventListener('hashchange', () => this.handleHashChange());
    
    // Start routing (default to home)
    this.handleHashChange();
  }

  navigateTo(hash) {
    window.location.hash = hash;
  }

  handleHashChange() {
    const hash = window.location.hash || '#home';
    AudioManager.playClick();
    this.routeTo(hash);
  }

  routeTo(hash) {
    // Basic route parsing
    const route = hash.split('?')[0];

    switch (route) {
      case '#home':
        this.renderHome();
        break;
      case '#rules':
        this.renderRules();
        break;
      case '#mode-select':
        this.renderModeSelect();
        break;
      case '#difficulty-select':
        // Needs a category query param
        const params = new URLSearchParams(hash.split('?')[1]);
        const cat = params.get('category') || 'mixed';
        this.renderDifficultySelect(cat);
        break;
      case '#gameplay':
        const gParams = new URLSearchParams(hash.split('?')[1]);
        const category = gParams.get('category') || 'mixed';
        const difficulty = gParams.get('difficulty') || 'Easy';
        this.renderGameplay(category, difficulty);
        break;
      case '#leaderboard':
        this.renderLeaderboard();
        break;
      case '#statistics':
        this.renderStatistics();
        break;
      case '#settings':
        this.renderSettings();
        break;
      case '#about':
        this.renderAbout();
        break;
      default:
        this.navigateTo('#home');
    }
  }

  // --- RENDERING VIEWS ---

  renderHome() {
    this.viewport.innerHTML = `
      <div class="view-container home-view fade-in">
        <div class="hero-section">
          <div class="logo-container pulsing-glow">
            <i class="fa fa-robot ai-glow-icon"></i>
            <h1>HUMAN vs AI</h1>
            <p class="subtitle">THE ULTIMATE DETECTION CHALLENGE</p>
          </div>
          
          <div class="home-menu grid-container">
            <a href="#mode-select" class="btn btn-gradient btn-large home-btn" aria-label="Start Detection Game">
              <i class="fa fa-play"></i> START GAME
            </a>
            <a href="#rules" class="btn btn-outline home-btn">
              <i class="fa fa-book-open"></i> TRAINING PROTOCOL
            </a>
            <a href="#statistics" class="btn btn-outline home-btn">
              <i class="fa fa-chart-line"></i> ANALYTICS
            </a>
            <a href="#leaderboard" class="btn btn-outline home-btn">
              <i class="fa fa-list-ol"></i> LEADERBOARD
            </a>
            <a href="#settings" class="btn btn-outline home-btn">
              <i class="fa fa-sliders-h"></i> CONFIGURATION
            </a>
            <a href="#about" class="btn btn-outline home-btn">
              <i class="fa fa-info-circle"></i> ABOUT LAB
            </a>
          </div>
        </div>
      </div>
    `;
    this.postRender();
  }

  renderRules() {
    this.viewport.innerHTML = `
      <div class="view-container glass-view fade-in">
        <div class="view-header">
          <a href="#home" class="back-link"><i class="fa fa-arrow-left"></i> BACK</a>
          <h1>TRAINING PROTOCOL</h1>
        </div>
        <div class="scroll-content rules-grid">
          <div class="card glass-card">
            <h3><i class="fa fa-gamepad cyan-text"></i> CORE OBJECTIVE</h3>
            <p>Differentiate between human creativity and synthetic AI generations across five distinct categories. Prove your perception skills!</p>
          </div>
          
          <div class="card glass-card">
            <h3><i class="fa fa-stopwatch purple-text"></i> THE TIMER</h3>
            <p>Every second counts. As difficulty spikes, the window of evaluation narrows down:</p>
            <ul>
              <li><strong>Easy:</strong> 30 seconds</li>
              <li><strong>Medium:</strong> 20 seconds</li>
              <li><strong>Hard:</strong> 15 seconds</li>
              <li><strong>Expert:</strong> 10 seconds</li>
            </ul>
          </div>

          <div class="card glass-card">
            <h3><i class="fa fa-calculator pink-text"></i> POINTS & STREAKS</h3>
            <p>Correct responses award base points, multiplied by your current difficulty setting. Answer swiftly and without hints to score maximum bonuses. Consecutive accuracy triggers streak multipliers!</p>
          </div>

          <div class="card glass-card">
            <h3><i class="fa fa-lightbulb yellow-text"></i> HINT PROTOCOL</h3>
            <p>Stuck on an evaluation? Unlock a structural hint. Warning: using hints disqualifies you from receiving the <em>No-Hint Bonus</em> points.</p>
          </div>
        </div>
      </div>
    `;
    this.postRender();
  }

  renderModeSelect() {
    this.viewport.innerHTML = `
      <div class="view-container glass-view fade-in">
        <div class="view-header">
          <a href="#home" class="back-link"><i class="fa fa-arrow-left"></i> BACK</a>
          <h1>SELECT EVALUATION MODULE</h1>
        </div>
        <div class="grid-layout select-grid">
          <div class="mode-card glass-panel" onclick="window.location.hash='#difficulty-select?category=image'">
            <div class="card-glow"></div>
            <i class="fa fa-image cyan-text"></i>
            <h2>Visual Image</h2>
            <p>Evaluate symmetrical lines vs AI spatial glitches.</p>
            <span class="badge diff-easy">Easy</span>
          </div>

          <div class="mode-card glass-panel" onclick="window.location.hash='#difficulty-select?category=text'">
            <div class="card-glow"></div>
            <i class="fa fa-file-alt text-purple-text"></i>
            <h2>Written Text</h2>
            <p>Detect structured robotic idioms and repetitive phrasing.</p>
            <span class="badge diff-medium">Medium</span>
          </div>

          <div class="mode-card glass-panel" onclick="window.location.hash='#difficulty-select?category=code'">
            <div class="card-glow"></div>
            <i class="fa fa-code pink-text"></i>
            <h2>Program Code</h2>
            <p>Identify textbooks structures against developer hacks.</p>
            <span class="badge diff-hard">Hard</span>
          </div>

          <div class="mode-card glass-panel" onclick="window.location.hash='#difficulty-select?category=voice'">
            <div class="card-glow"></div>
            <i class="fa fa-microphone yellow-text"></i>
            <h2>Vocal Speech</h2>
            <p>Listen for mechanical breathing and artificial pitch lines.</p>
            <span class="badge diff-expert">Expert</span>
          </div>

          <div class="mode-card glass-panel" onclick="window.location.hash='#difficulty-select?category=artwork'">
            <div class="card-glow"></div>
            <i class="fa fa-palette orange-text"></i>
            <h2>Fine Artwork</h2>
            <p>Analyze classic strokes against synthetic overlaps.</p>
            <span class="badge diff-medium">Medium</span>
          </div>

          <div class="mode-card glass-panel mixed-card" onclick="window.location.hash='#difficulty-select?category=mixed'">
            <div class="card-glow"></div>
            <i class="fa fa-random green-text"></i>
            <h2>Mixed Protocol</h2>
            <p>Test your intuition across all categories randomly.</p>
            <span class="badge diff-hard">Dynamic</span>
          </div>
        </div>
      </div>
    `;
    this.postRender();
  }

  renderDifficultySelect(category) {
    this.viewport.innerHTML = `
      <div class="view-container glass-view fade-in">
        <div class="view-header">
          <a href="#mode-select" class="back-link"><i class="fa fa-arrow-left"></i> BACK</a>
          <h1>CHOOSE THREAT LEVEL</h1>
        </div>
        <div class="grid-layout diff-grid">
          <div class="diff-card glass-panel easy" onclick="window.location.hash='#gameplay?category=${category}&difficulty=Easy'">
            <div class="diff-header">
              <h2>EASY</h2>
              <span class="diff-mult">1.0x Score</span>
            </div>
            <p>Ideal for beginners. 30s evaluation window, basic features, and detailed hints.</p>
          </div>

          <div class="diff-card glass-panel medium" onclick="window.location.hash='#gameplay?category=${category}&difficulty=Medium'">
            <div class="diff-header">
              <h2>MEDIUM</h2>
              <span class="diff-mult">1.5x Score</span>
            </div>
            <p>20s timer. Complex patterns requiring closer inspection.</p>
          </div>

          <div class="diff-card glass-panel hard" onclick="window.location.hash='#gameplay?category=${category}&difficulty=Hard'">
            <div class="diff-header">
              <h2>HARD</h2>
              <span class="diff-mult">2.0x Score</span>
            </div>
            <p>15s window. High complexity targets. Fast reaction required.</p>
          </div>

          <div class="diff-card glass-panel expert" onclick="window.location.hash='#gameplay?category=${category}&difficulty=Expert'">
            <div class="diff-header">
              <h2>EXPERT</h2>
              <span class="diff-mult">3.0x Score</span>
            </div>
            <p>10s timer. Unbelievably subtle anomalies. Only for master detectors.</p>
          </div>
        </div>
      </div>
    `;
    this.postRender();
  }

  renderGameplay(category, difficulty) {
    this.viewport.innerHTML = `
      <div class="view-container gameplay-view fade-in">
        <div class="game-hud glass-panel">
          <div class="hud-left">
            <span class="round-indicator font-mono">ROUND: <span id="round-num">1</span>/10</span>
            <span class="score-indicator font-mono">SCORE: <span id="hud-score">0</span></span>
          </div>
          <div class="hud-center">
            <!-- Circular timer container -->
            <div class="timer-wrapper">
              <svg width="60" height="60" class="timer-svg">
                <circle class="timer-bg" cx="30" cy="30" r="26"></circle>
                <circle class="timer-progress" cx="30" cy="30" r="26" id="timer-bar"></circle>
              </svg>
              <span class="timer-text font-mono" id="timer-val">00</span>
            </div>
          </div>
          <div class="hud-right">
            <span class="streak-indicator font-mono"><i class="fa fa-fire text-orange-text"></i> STREAK: <span id="hud-streak">0</span></span>
          </div>
        </div>

        <div class="game-progress-bar-container">
          <div class="game-progress-bar-fill" id="game-progress-fill" style="width: 10%;"></div>
        </div>

        <div class="question-container glass-panel" id="question-viewport">
          <!-- Active question gets rendered here -->
        </div>

        <!-- Question Prompt and Option Cards -->
        <div class="options-container glass-panel">
          <h3 class="question-prompt font-mono">Was this created by a Human or an AI?</h3>
          <div class="choice-buttons-grid">
            <button class="btn btn-choice" id="choice-human" data-value="Human">
              <span class="choice-icon">👤</span> HUMAN
            </button>
            <button class="btn btn-choice" id="choice-ai" data-value="AI">
              <span class="choice-icon">🤖</span> AI GENERATED
            </button>
          </div>
        </div>

        <div class="control-row">
          <button class="btn btn-hint" id="game-btn-hint"><i class="fa fa-lightbulb"></i> SYSTEM HINT (<span id="hints-count">3</span>)</button>
          <button class="btn btn-gradient btn-large btn-submit" id="game-btn-submit" disabled>SUBMIT ANSWER</button>
          <button class="btn btn-outline" id="game-btn-skip"><i class="fa fa-forward"></i> SKIP</button>
        </div>

        <!-- Explanation Overlay Card -->
        <div class="explanation-overlay glass-panel hidden" id="explanation-panel">
          <!-- Dynamically generated correctness, facts, and CTA -->
        </div>
      </div>
    `;
    this.postRender();
    GameEngine.startSession(category, difficulty);
  }

  renderLeaderboard() {
    this.viewport.innerHTML = `
      <div class="view-container glass-view fade-in">
        <div class="view-header">
          <a href="#home" class="back-link"><i class="fa fa-arrow-left"></i> BACK</a>
          <h1>GLOBAL LEADERBOARDS</h1>
        </div>
        
        <div class="leaderboard-controls glass-panel">
          <div class="search-box">
            <i class="fa fa-search"></i>
            <input type="text" id="leaderboard-search" placeholder="Search Player Name..." aria-label="Search Player Name">
          </div>
          <div class="sort-selector">
            <span>Sort by:</span>
            <button class="btn btn-mini active" id="sort-score">Highest Score</button>
            <button class="btn btn-mini" id="sort-accuracy">Accuracy</button>
            <button class="btn btn-mini" id="sort-newest">Newest</button>
          </div>
        </div>

        <div class="leaderboard-table-container glass-panel">
          <table class="leaderboard-table">
            <thead>
              <tr>
                <th scope="col">RANK</th>
                <th scope="col">PLAYER</th>
                <th scope="col">SCORE</th>
                <th scope="col">ACCURACY</th>
                <th scope="col">DIFFICULTY</th>
                <th scope="col">DATE</th>
              </tr>
            </thead>
            <tbody id="leaderboard-body">
              <!-- Dynamically populated -->
            </tbody>
          </table>
          <div id="leaderboard-empty" class="empty-state hidden">
            <i class="fa fa-ghost"></i>
            <p>No records found in database.</p>
          </div>
        </div>

        <div class="leaderboard-actions">
          <button class="btn btn-danger btn-outline" id="btn-reset-leaderboard"><i class="fa fa-trash-alt"></i> PURGE LOGS</button>
        </div>
      </div>
    `;
    
    this.postRender();
    
    // Bind leaderboard event listeners
    const searchInput = document.getElementById('leaderboard-search');
    let currentSort = 'score';

    const loadTable = () => {
      const query = searchInput ? searchInput.value : '';
      const entries = LeaderboardManager.getEntries({ query, sortBy: currentSort });
      const tbody = document.getElementById('leaderboard-body');
      const emptyState = document.getElementById('leaderboard-empty');

      if (!tbody) return;

      tbody.innerHTML = '';
      if (entries.length === 0) {
        emptyState.classList.remove('hidden');
      } else {
        emptyState.classList.add('hidden');
        entries.forEach((e, idx) => {
          const dateStr = new Date(e.date).toLocaleDateString();
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td class="col-rank">#${idx + 1}</td>
            <td class="col-name">${e.name}</td>
            <td class="col-score text-cyan">${e.score}</td>
            <td class="col-accuracy">${e.accuracy}%</td>
            <td class="col-diff"><span class="badge diff-${e.difficulty.toLowerCase()}">${e.difficulty}</span></td>
            <td class="col-date">${dateStr}</td>
          `;
          tbody.appendChild(tr);
        });
      }
    };

    if (searchInput) {
      searchInput.addEventListener('input', () => loadTable());
    }

    const sortButtons = {
      score: document.getElementById('sort-score'),
      accuracy: document.getElementById('sort-accuracy'),
      newest: document.getElementById('sort-newest')
    };

    Object.keys(sortButtons).forEach((sortKey) => {
      const btn = sortButtons[sortKey];
      if (btn) {
        btn.addEventListener('click', () => {
          Object.values(sortButtons).forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentSort = sortKey;
          loadTable();
        });
      }
    });

    const purgeBtn = document.getElementById('btn-reset-leaderboard');
    if (purgeBtn) {
      purgeBtn.addEventListener('click', () => {
        UIManager.showModal({
          title: 'Confirm Database Purge',
          body: 'This will permanently wipe all entries from the local high score log. This operation cannot be undone.',
          buttons: [
            { text: 'Cancel', type: 'secondary' },
            {
              text: 'Purge Records',
              type: 'danger',
              onClick: () => {
                LeaderboardManager.clear();
                loadTable();
                UIManager.showNotification({
                  title: 'Database Wiped',
                  description: 'Leaderboard successfully cleared.',
                  iconClass: 'fa-trash',
                  type: 'success'
                });
              }
            }
          ]
        });
      });
    }

    loadTable();
  }

  renderStatistics() {
    const stats = StorageManager.getStats();
    
    this.viewport.innerHTML = `
      <div class="view-container glass-view fade-in">
        <div class="view-header">
          <a href="#home" class="back-link"><i class="fa fa-arrow-left"></i> BACK</a>
          <h1>STATISTICS PORTAL</h1>
        </div>

        <div class="stats-summary-grid">
          <div class="card glass-card stat-summary-card">
            <span class="label">GAMES COMPLETED</span>
            <span class="value cyan-text">${stats.gamesPlayed}</span>
          </div>
          <div class="card glass-card stat-summary-card">
            <span class="label">WIN PROTOCOLS</span>
            <span class="value green-text">${stats.wins}</span>
          </div>
          <div class="card glass-card stat-summary-card">
            <span class="label">DETECTION ACCURACY</span>
            <span class="value pink-text">${stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0}%</span>
          </div>
          <div class="card glass-card stat-summary-card">
            <span class="label">HIGHEST STREAK</span>
            <span class="value orange-text">${stats.longestStreak}</span>
          </div>
        </div>

        <div class="stats-charts-grid">
          <div class="card glass-card chart-container">
            <h3>Category Performance Profile</h3>
            <canvas id="chart-radar-cat"></canvas>
          </div>
          <div class="card glass-card chart-container">
            <h3>Difficulty Distribution</h3>
            <canvas id="chart-bar-diff"></canvas>
          </div>
          <div class="card glass-card chart-container">
            <h3>Module Focus Ratio</h3>
            <canvas id="chart-pie-share"></canvas>
          </div>
        </div>
      </div>
    `;

    this.postRender();

    // Render ChartJS elements
    setTimeout(() => {
      StatisticsManager.renderCharts({
        categoryRadar: document.getElementById('chart-radar-cat'),
        difficultyBar: document.getElementById('chart-bar-diff'),
        performancePie: document.getElementById('chart-pie-share')
      });
    }, 100);
  }

  renderSettings() {
    const settings = StorageManager.getSettings();

    this.viewport.innerHTML = `
      <div class="view-container glass-view fade-in">
        <div class="view-header">
          <a href="#home" class="back-link"><i class="fa fa-arrow-left"></i> BACK</a>
          <h1>SYSTEM CONFIGURATION</h1>
        </div>

        <div class="settings-box glass-panel">
          <div class="setting-item">
            <div class="setting-info">
              <h3>Sound Effects</h3>
              <p>Chimes, warning ticks, and clicks</p>
            </div>
            <label class="switch-toggle" for="toggle-sfx">
              <input type="checkbox" id="toggle-sfx" ${settings.soundEnabled ? 'checked' : ''}>
              <span class="slider-round"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3>Ambient Music</h3>
              <p>Soft futuristic synthesizer looping background</p>
            </div>
            <label class="switch-toggle" for="toggle-music">
              <input type="checkbox" id="toggle-music" ${settings.musicEnabled ? 'checked' : ''}>
              <span class="slider-round"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3>Master Volume</h3>
              <p>Configure output amplitude levels</p>
            </div>
            <div class="volume-slider-wrapper">
              <i class="fa fa-volume-down"></i>
              <input type="range" id="volume-slider" min="0" max="1" step="0.1" value="${settings.volume}" aria-label="Master Volume">
              <i class="fa fa-volume-up"></i>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3>UI Animations</h3>
              <p>Floating background particles and ripples</p>
            </div>
            <label class="switch-toggle" for="toggle-animations">
              <input type="checkbox" id="toggle-animations" ${settings.animationsEnabled ? 'checked' : ''}>
              <span class="slider-round"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3>High Contrast Visual Mode</h3>
              <p>Increase text contrast for readability</p>
            </div>
            <label class="switch-toggle" for="toggle-contrast">
              <input type="checkbox" id="toggle-contrast" ${settings.theme === 'high-contrast' ? 'checked' : ''}>
              <span class="slider-round"></span>
            </label>
          </div>
        </div>

        <div class="achievements-section">
          <h2>ACHIEVEMENTS PROTOCOL</h2>
          <div class="achievements-grid" id="settings-achievements-list">
            <!-- Dynamically populated achievements list -->
          </div>
        </div>

        <div class="settings-actions">
          <button class="btn btn-danger btn-outline" id="btn-reset-all"><i class="fa fa-sync"></i> FACTORY RESET PROGRESS</button>
        </div>
      </div>
    `;

    this.postRender();

    // Populate Achievements
    const unlockedList = AchievementsManager.getUnlocked();
    const achListContainer = document.getElementById('settings-achievements-list');
    if (achListContainer) {
      ACHIEVEMENT_LIST.forEach((ach) => {
        const isUnlocked = unlockedList.includes(ach.id);
        const card = document.createElement('div');
        card.className = `achievement-item-card glass-panel ${isUnlocked ? 'unlocked' : 'locked'}`;
        card.innerHTML = `
          <div class="ach-badge-wrapper">
            <i class="fa ${ach.icon}"></i>
          </div>
          <div class="ach-text">
            <h4>${ach.title}</h4>
            <p>${ach.description}</p>
          </div>
        `;
        achListContainer.appendChild(card);
      });
    }

    // Bind event listeners
    const sfxCheckbox = document.getElementById('toggle-sfx');
    if (sfxCheckbox) {
      sfxCheckbox.addEventListener('change', (e) => {
        const set = StorageManager.getSettings();
        set.soundEnabled = e.target.checked;
        StorageManager.saveSettings(set);
        AudioManager.toggleSound(set.soundEnabled);
        AudioManager.playClick();
      });
    }

    const musicCheckbox = document.getElementById('toggle-music');
    if (musicCheckbox) {
      musicCheckbox.addEventListener('change', (e) => {
        const set = StorageManager.getSettings();
        set.musicEnabled = e.target.checked;
        StorageManager.saveSettings(set);
        AudioManager.toggleMusic(set.musicEnabled);
      });
    }

    const volSlider = document.getElementById('volume-slider');
    if (volSlider) {
      volSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        const set = StorageManager.getSettings();
        set.volume = val;
        StorageManager.saveSettings(set);
        AudioManager.setVolume(val);
      });
    }

    const animCheckbox = document.getElementById('toggle-animations');
    if (animCheckbox) {
      animCheckbox.addEventListener('change', (e) => {
        const set = StorageManager.getSettings();
        set.animationsEnabled = e.target.checked;
        StorageManager.saveSettings(set);
        AnimationsManager.toggleAnimations(set.animationsEnabled);
      });
    }

    const contrastCheckbox = document.getElementById('toggle-contrast');
    if (contrastCheckbox) {
      contrastCheckbox.addEventListener('change', (e) => {
        const set = StorageManager.getSettings();
        set.theme = e.target.checked ? 'high-contrast' : 'dark';
        StorageManager.saveSettings(set);
        // Force document style toggle
        if (e.target.checked) {
          document.body.classList.add('high-contrast');
        } else {
          document.body.classList.remove('high-contrast');
        }
      });
    }

    const resetAllBtn = document.getElementById('btn-reset-all');
    if (resetAllBtn) {
      resetAllBtn.addEventListener('click', () => {
        UIManager.showModal({
          title: 'Confirm Factory Reset',
          body: 'This will completely wipe your settings, cumulative statistics, unlocked achievements, and high score history. The system will start from scratch.',
          buttons: [
            { text: 'Cancel', type: 'secondary' },
            {
              text: 'Reset Everything',
              type: 'danger',
              onClick: () => {
                StorageManager.clearAll();
                AchievementsManager.reset();
                StatisticsManager.reset();
                LeaderboardManager.clear();
                
                // Refresh setting fields
                this.renderSettings();
                UIManager.showNotification({
                  title: 'Factory Reset Complete',
                  description: 'All system configurations wiped.',
                  iconClass: 'fa-history',
                  type: 'success'
                });
              }
            }
          ]
        });
      });
    }
  }

  renderAbout() {
    this.viewport.innerHTML = `
      <div class="view-container glass-view fade-in">
        <div class="view-header">
          <a href="#home" class="back-link"><i class="fa fa-arrow-left"></i> BACK</a>
          <h1>ABOUT DETECTION PROTOCOL</h1>
        </div>
        <div class="scroll-content about-content">
          <div class="card glass-card">
            <h3>Overview</h3>
            <p>The Human vs AI Detection Lab is an advanced portfolio prototype designed to highlight human intuition. AI-generated assets always leave digital footprints. Our training suites teach you what micro-deformities to search for.</p>
          </div>
          <div class="card glass-card">
            <h3>Credits</h3>
            <p>Developed with passion, utilizing premium Web Audio synthesizer networks, vanilla custom router nodes, and glassmorphic micro-animations.</p>
          </div>
        </div>
      </div>
    `;
    this.postRender();
  }

  postRender() {
    // Re-apply ripple effects to any newly rendered buttons
    const buttons = this.viewport.querySelectorAll('.btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        if (StorageManager.getSettings().animationsEnabled) {
          AnimationsManager.applyRipple(e, btn);
        }
      });
    });

    // Ensure speech stops when navigating away from gameplay
    if (window.location.hash !== '#gameplay') {
      AudioManager.stopSpeech();
    }
  }
}

export const Router = new RouterClass();
