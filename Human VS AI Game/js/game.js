/**
 * GameEngine
 * Controls gameplay cycles, rounds, hint management, audio visualizer, syntax highlighter, and answers.
 */
import { ScoreManager } from './score.js';
import { Timer } from './timer.js';
import { AudioManager } from './audio.js';
import { StatisticsManager } from './statistics.js';
import { AchievementsManager } from './achievements.js';
import { LeaderboardManager } from './leaderboard.js';
import { UIManager } from './ui.js';

class GameEngineClass {
  constructor() {
    this.category = 'mixed';
    this.difficulty = 'Easy';
    this.scoreManager = null;
    this.timer = null;
    this.allQuestions = [];
    this.roundQueue = [];
    this.currentQuestion = null;
    this.roundNum = 1;
    this.hintsRemaining = 3;
    this.hintUsedThisRound = false;
    this.timeSpentThisRound = 0;
    this.voiceWaveStopper = null;

    // Session stats tracking
    this.sessionStats = {
      score: 0,
      accuracy: 0,
      difficulty: 'Easy',
      hintsUsed: 0,
      longestStreak: 0,
      fastestAnswer: 999,
      categories: {
        image: { played: 0, correct: 0 },
        text: { played: 0, correct: 0 },
        code: { played: 0, correct: 0 },
        voice: { played: 0, correct: 0 },
        artwork: { played: 0, correct: 0 }
      }
    };
  }

  async startSession(category, difficulty) {
    this.category = category;
    this.difficulty = difficulty;
    this.roundNum = 1;
    this.hintsRemaining = 3;
    
    // Reset Score Manager
    this.scoreManager = new ScoreManager(difficulty);
    
    // Reset session stats
    this.sessionStats = {
      score: 0,
      accuracy: 0,
      difficulty: difficulty,
      hintsUsed: 0,
      longestStreak: 0,
      fastestAnswer: 999,
      categories: {
        image: { played: 0, correct: 0 },
        text: { played: 0, correct: 0 },
        code: { played: 0, correct: 0 },
        voice: { played: 0, correct: 0 },
        artwork: { played: 0, correct: 0 }
      }
    };

    // Show loading indicator in viewport
    const viewport = document.getElementById('question-viewport');
    if (viewport) {
      viewport.innerHTML = `
        <div class="loading-container font-mono">
          <i class="fa fa-spinner fa-spin loading-icon text-cyan"></i>
          <p>RETRIEVING EVALUATION TARGETS...</p>
        </div>
      `;
    }

    try {
      await this.loadDatasets();
      this.buildRoundQueue();
      this.loadRound();
    } catch (e) {
      console.error("Failed to load game assets:", e);
      if (viewport) {
        viewport.innerHTML = `
          <div class="error-container">
            <i class="fa fa-exclamation-triangle error-icon text-red"></i>
            <h3>SYSTEM OVERLOAD</h3>
            <p>Could not download data packages. Check your offline settings.</p>
            <a href="#mode-select" class="btn btn-outline">RETURN TO HANGAR</a>
          </div>
        `;
      }
    }
  }

  async loadDatasets() {
    this.allQuestions = [];
    const categoriesToLoad = this.category === 'mixed'
      ? ['images', 'text', 'code', 'voice', 'artwork']
      : [this.category === 'image' ? 'images' : this.category]; // map singular category

    // Load corresponding JSON packages
    for (const catName of categoriesToLoad) {
      // e.g. /data/images.json
      const response = await fetch(`./data/${catName}.json`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const data = await response.json();
      this.allQuestions.push(...data);
    }
  }

  buildRoundQueue() {
    // Filter questions matching selected difficulty (optional fallback, let's keep all matching, or shuffle them)
    // To ensure variety, we shuffle all available questions and pull 10.
    const shuffled = [...this.allQuestions].sort(() => Math.random() - 0.5);
    
    // Select exactly 10 questions for the session
    this.roundQueue = shuffled.slice(0, 10);
  }

  loadRound() {
    if (this.roundNum > 10) {
      this.finishSession();
      return;
    }

    this.currentQuestion = this.roundQueue[this.roundNum - 1];
    this.hintUsedThisRound = false;

    // Reset Voice stopper
    if (this.voiceWaveStopper) {
      this.voiceWaveStopper();
      this.voiceWaveStopper = null;
    }
    AudioManager.stopSpeech();

    // 1. Update HUD indicators
    document.getElementById('round-num').textContent = this.roundNum;
    document.getElementById('hud-score').textContent = this.scoreManager.score;
    document.getElementById('hud-streak').textContent = this.scoreManager.streak;
    document.getElementById('hints-count').textContent = this.hintsRemaining;

    // 2. Clear explanation panels
    const explPanel = document.getElementById('explanation-panel');
    explPanel.classList.add('hidden');
    explPanel.innerHTML = '';

    // Update progress bar
    const progressFill = document.getElementById('game-progress-fill');
    if (progressFill) {
      progressFill.style.width = `${this.roundNum * 10}%`;
    }

    this.selectedOption = null;

    // Enable choices buttons
    this.toggleControlButtons(true);

    // 3. Render round details
    const viewport = document.getElementById('question-viewport');
    this.renderQuestionContent(viewport);

    // 4. Setup Circular Timer durations
    const timerDurations = { Easy: 30, Medium: 20, Hard: 15, Expert: 10 };
    const seconds = timerDurations[this.difficulty] || 30;

    const timerElements = {
      text: document.getElementById('timer-val'),
      circle: document.getElementById('timer-bar')
    };

    if (this.timer) {
      this.timer.stop();
    }
    
    this.timer = new Timer(
      seconds,
      timerElements,
      (rem) => {
        this.timeSpentThisRound = seconds - rem;
      },
      () => {
        // Timeout callback -> Auto submit wrong answer
        this.handleAnswer(null);
      }
    );
    this.timer.start();

    // Setup input actions
    this.bindGameplayActions();
  }

  renderQuestionContent(viewport) {
    const q = this.currentQuestion;
    const catClass = q.type;

    viewport.innerHTML = `
      <div class="gameplay-card ${catClass}-card fade-in">
        <div class="card-category-indicator">
          <i class="fa ${this.getCategoryIcon(q.type)}"></i>
          <span>${q.type.toUpperCase()} EVALUATION</span>
        </div>
        <div class="question-body" id="question-payload-area"></div>
      </div>
    `;

    const payloadArea = document.getElementById('question-payload-area');

    if (q.type === 'image' || q.type === 'artwork') {
      payloadArea.innerHTML = `<div class="vector-viewport">${q.content}</div>`;
    } else if (q.type === 'text') {
      payloadArea.innerHTML = `<p class="evaluation-paragraph font-mono">${q.content}</p>`;
    } else if (q.type === 'code') {
      const highlighted = this.highlightCode(q.content, q.language);
      payloadArea.innerHTML = `
        <div class="code-editor-header font-mono">
          <span class="dot red-dot"></span>
          <span class="dot yellow-dot"></span>
          <span class="dot green-dot"></span>
          <span class="file-name">${q.language.toLowerCase()}_source_code</span>
        </div>
        <pre class="code-viewport font-mono"><code>${highlighted}</code></pre>
      `;
    } else if (q.type === 'voice') {
      payloadArea.innerHTML = `
        <div class="voice-player-card glass-panel">
          <button class="btn btn-circular play-btn" id="voice-play-trigger" aria-label="Play Voice sample">
            <i class="fa fa-play" id="voice-play-icon"></i>
          </button>
          <div class="voice-wave-container">
            <canvas id="voice-wave-canvas" width="300" height="60"></canvas>
          </div>
          <span class="voice-duration font-mono">SPEECH UTTERANCE</span>
        </div>
        <p class="voice-transcript font-mono">"${q.phrase}"</p>
      `;

      // Setup audio triggers
      const playBtn = document.getElementById('voice-play-trigger');
      const playIcon = document.getElementById('voice-play-icon');
      const canvas = document.getElementById('voice-wave-canvas');

      let isPlaying = false;

      playBtn.addEventListener('click', () => {
        if (isPlaying) {
          AudioManager.stopSpeech();
          if (this.voiceWaveStopper) {
            this.voiceWaveStopper();
            this.voiceWaveStopper = null;
          }
          playIcon.className = 'fa fa-play';
          isPlaying = false;
        } else {
          AudioManager.speak(
            q.phrase,
            q.answer,
            () => {
              // On start
              playIcon.className = 'fa fa-stop';
              isPlaying = true;
              this.voiceWaveStopper = this.startWaveAnimation(canvas);
            },
            () => {
              // On end
              playIcon.className = 'fa fa-play';
              isPlaying = false;
              if (this.voiceWaveStopper) {
                this.voiceWaveStopper();
                this.voiceWaveStopper = null;
              }
            }
          );
        }
      });
    }
  }

  // Built-in Syntax Highlighter using regular expressions
  highlightCode(code, lang) {
    let escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const stringRegex = /(["'`])(.*?)\1/g;
    const commentRegex = /(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$|&lt;!--[\s\S]*?--&gt;)/gm;
    const keywordRegex = /\b(const|let|var|function|return|def|import|from|class|public|static|void|struct|define|if|else|for|while|new|template|typename|std|int|double|float|bool|string)\b/g;
    const tagRegex = /(&lt;\/?[a-z0-9]+(?: [^&]*)?&gt;)/gi;
    
    escaped = escaped.replace(commentRegex, '<span class="code-comment">$1</span>');
    escaped = escaped.replace(stringRegex, '<span class="code-string">$1$2$1</span>');
    escaped = escaped.replace(keywordRegex, '<span class="code-keyword">$1</span>');
    if (lang === 'HTML' || lang === 'CSS') {
      escaped = escaped.replace(tagRegex, '<span class="code-tag">$1</span>');
    }
    return escaped;
  }

  startWaveAnimation(canvas) {
    const ctx = canvas.getContext('2d');
    let animationId = null;
    let phase = 0;
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      // Draw 3 layers of sine waves representing vocal speech frequencies
      for (let j = 0; j < 3; j++) {
        ctx.beginPath();
        ctx.strokeStyle = j === 0 ? 'rgba(0, 242, 254, 0.8)' : j === 1 ? 'rgba(182, 33, 254, 0.5)' : 'rgba(254, 1, 154, 0.3)';
        ctx.lineWidth = j === 0 ? 3 : 1.5;
        const amplitude = (3 - j) * 8 + (Math.sin(phase * 2) * 5);
        
        for (let i = 0; i < canvas.width; i++) {
          const x = i;
          const y = canvas.height / 2 + Math.sin(i * 0.04 + phase + j) * amplitude;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      phase += 0.15;
      animationId = requestAnimationFrame(draw);
    };
    
    draw();
    return () => cancelAnimationFrame(animationId);
  }

  bindGameplayActions() {
    const choiceHuman = document.getElementById('choice-human');
    const choiceAI = document.getElementById('choice-ai');
    const btnSubmit = document.getElementById('game-btn-submit');
    const btnSkip = document.getElementById('game-btn-skip');
    const btnHint = document.getElementById('game-btn-hint');

    // Reset option states
    this.selectedOption = null;
    if (btnSubmit) btnSubmit.disabled = true;
    if (choiceHuman) choiceHuman.classList.remove('selected');
    if (choiceAI) choiceAI.classList.remove('selected');

    // Clone buttons to clear old listeners
    const newHuman = choiceHuman.cloneNode(true);
    const newAI = choiceAI.cloneNode(true);
    const newSubmit = btnSubmit.cloneNode(true);
    const newSkip = btnSkip.cloneNode(true);
    const newHint = btnHint.cloneNode(true);

    choiceHuman.parentNode.replaceChild(newHuman, choiceHuman);
    choiceAI.parentNode.replaceChild(newAI, choiceAI);
    btnSubmit.parentNode.replaceChild(newSubmit, btnSubmit);
    btnSkip.parentNode.replaceChild(newSkip, btnSkip);
    btnHint.parentNode.replaceChild(newHint, btnHint);

    // Selection triggers
    newHuman.addEventListener('click', () => {
      AudioManager.playClick();
      this.selectedOption = 'Human';
      newHuman.classList.add('selected');
      newAI.classList.remove('selected');
      newSubmit.disabled = false;
    });

    newAI.addEventListener('click', () => {
      AudioManager.playClick();
      this.selectedOption = 'AI';
      newAI.classList.add('selected');
      newHuman.classList.remove('selected');
      newSubmit.disabled = false;
    });

    newSubmit.addEventListener('click', () => {
      if (this.selectedOption) {
        this.handleAnswer(this.selectedOption);
      }
    });

    newSkip.addEventListener('click', () => {
      this.handleAnswer('Skip');
    });

    newHint.addEventListener('click', () => {
      this.useHint();
    });
  }

  toggleControlButtons(enabled) {
    const ids = ['choice-human', 'choice-ai', 'game-btn-submit', 'game-btn-skip', 'game-btn-hint'];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.disabled = !enabled;
      }
    });
  }

  handleAnswer(guess) {
    this.timer.pause();
    this.toggleControlButtons(false);
    
    // Cancel voices
    AudioManager.stopSpeech();
    if (this.voiceWaveStopper) {
      this.voiceWaveStopper();
      this.voiceWaveStopper = null;
    }

    const q = this.currentQuestion;
    let isCorrect = false;

    if (guess === 'Skip') {
      isCorrect = false;
      AudioManager.playWrong();
    } else if (guess === null) {
      // Timeout
      isCorrect = false;
      AudioManager.playWrong();
    } else {
      isCorrect = (guess === q.answer);
      if (isCorrect) {
        AudioManager.playCorrect();
      } else {
        AudioManager.playWrong();
      }
    }

    // Process score calculations
    const breakdown = this.scoreManager.processAnswer(
      isCorrect,
      this.timer.remaining,
      this.timer.duration,
      this.hintUsedThisRound
    );

    // Record session statistics
    const catName = q.type;
    this.sessionStats.categories[catName].played++;
    if (isCorrect) {
      this.sessionStats.categories[catName].correct++;
      // check fastest response
      if (this.timeSpentThisRound < this.sessionStats.fastestAnswer) {
        this.sessionStats.fastestAnswer = this.timeSpentThisRound;
      }
    }

    if (this.scoreManager.streak > this.sessionStats.longestStreak) {
      this.sessionStats.longestStreak = this.scoreManager.streak;
    }

    // Reveal explanation dashboard
    this.revealExplanation(isCorrect, guess, breakdown);
  }

  useHint() {
    if (this.hintsRemaining <= 0 || this.hintUsedThisRound) return;
    this.hintsRemaining--;
    this.sessionStats.hintsUsed++;
    this.hintUsedThisRound = true;

    document.getElementById('hints-count').textContent = this.hintsRemaining;
    AudioManager.playClick();

    // Trigger toast message with hints details
    UIManager.showNotification({
      title: 'Structural Analysis Hint',
      description: this.currentQuestion.hint,
      iconClass: 'fa-lightbulb',
      type: 'info',
      duration: 6000
    });

    // Disable hint button for this round
    document.getElementById('game-btn-hint').disabled = true;
  }

  revealExplanation(isCorrect, guess, pointsBreakdown) {
    const q = this.currentQuestion;
    const explPanel = document.getElementById('explanation-panel');

    let headingText = '';
    let headingClass = '';

    if (guess === 'Skip') {
      headingText = 'EVALUATION SKIPPED';
      headingClass = 'text-yellow';
    } else if (guess === null) {
      headingText = "⏰ Time's Up!";
      headingClass = 'text-red';
    } else if (isCorrect) {
      headingText = 'DETECTION SUCCESSFUL';
      headingClass = 'text-cyan';
    } else {
      headingText = 'DETECTION FAILURE';
      headingClass = 'text-red';
    }

    explPanel.innerHTML = `
      <div class="expl-header">
        <h3 class="${headingClass}">${headingText}</h3>
        <span class="badge diff-${q.difficulty.toLowerCase()}">${q.difficulty}</span>
      </div>
      <div class="expl-body">
        ${guess === null ? `<p class="description text-red font-mono" style="font-weight: bold;">You did not submit an answer.</p>` : ''}
        <p class="correct-label font-mono">CORRECT CLASSIFICATION: <strong class="text-cyan">${q.answer.toUpperCase()}</strong></p>
        <p class="description">${q.explanation}</p>
        <div class="fact-card glass-card">
          <h4><i class="fa fa-info-circle"></i> Detection Intelligence Fact</h4>
          <p>${q.fact}</p>
        </div>
        ${guess !== null && isCorrect ? `
          <div class="points-earned font-mono">
            <h4>SCORE BREAKDOWN:</h4>
            <ul>
              <li>Base: +${pointsBreakdown.base} pts</li>
              ${pointsBreakdown.speedBonus > 0 ? `<li>Speed Bonus: +${pointsBreakdown.speedBonus} pts</li>` : ''}
              ${pointsBreakdown.hintBonus > 0 ? `<li>No Hint Bonus: +${pointsBreakdown.hintBonus} pts</li>` : ''}
              ${pointsBreakdown.streakBonus > 0 ? `<li class="text-orange-text">Streak Bonus: +${pointsBreakdown.streakBonus} pts</li>` : ''}
              <li>Multiplier: ${pointsBreakdown.multiplier}x</li>
              <li class="total-pts text-cyan">TOTAL EARNED: +${pointsBreakdown.total} pts</li>
            </ul>
          </div>
        ` : `<p class="points-earned font-mono text-red">${guess === null ? 'No selection made.' : 'No points earned this round.'}</p>`}
      </div>
      <div class="expl-footer">
        <button class="btn btn-gradient btn-large" id="btn-next-round">
          ${this.roundNum === 10 ? 'COMPLETE SYSTEM WIPE' : 'NEXT TARGET'} <i class="fa fa-arrow-right"></i>
        </button>
      </div>
    `;

    explPanel.classList.remove('hidden');

    const btnNext = document.getElementById('btn-next-round');
    btnNext.addEventListener('click', () => {
      AudioManager.playClick();
      this.roundNum++;
      this.loadRound();
    });
  }

  finishSession() {
    this.sessionStats.score = this.scoreManager.score;
    this.sessionStats.accuracy = this.scoreManager.getAccuracy();

    // Reset timer
    if (this.timer) {
      this.timer.stop();
    }

    // Save final stats into storage
    const cumulativeStats = StatisticsManager.recordGame(this.sessionStats);

    // Check unlocks & trigger popups
    AchievementsManager.checkUnlocks(cumulativeStats, this.sessionStats);

    // Trigger name input modal and navigate to Endgame summary view
    this.showEndgame();
  }

  showEndgame() {
    const viewport = document.getElementById('question-viewport');
    
    // Swap main gameplay viewport to final screen
    const mainViewport = document.getElementById('app-viewport');
    
    let rank = 'NOVICE';
    if (this.sessionStats.accuracy === 100) rank = 'MASTER DETECTOR';
    else if (this.sessionStats.accuracy >= 80) rank = 'ELITE INSPECTOR';
    else if (this.sessionStats.accuracy >= 60) rank = 'TRAINED SENSOR';

    mainViewport.innerHTML = `
      <div class="view-container endgame-view fade-in">
        <div class="logo-container pulsing-glow">
          <i class="fa fa-radiation-alt victory-icon text-cyan"></i>
          <h1>ANALYSIS COMPLETE</h1>
          <p class="subtitle">THREAT CLASSIFICATION RESULTS</p>
        </div>

        <div class="endgame-grid">
          <div class="card glass-card result-summary">
            <h3>FINAL SCORE</h3>
            <span class="result-value cyan-text">${this.sessionStats.score}</span>
          </div>

          <div class="card glass-card result-summary">
            <h3>ACCURACY</h3>
            <span class="result-value pink-text">${this.sessionStats.accuracy}%</span>
          </div>

          <div class="card glass-card result-summary">
            <h3>DETECTION RANK</h3>
            <span class="result-value green-text">${rank}</span>
          </div>
        </div>

        <div class="leaderboard-submission-card glass-panel" id="submission-card">
          <h3>SAVE RECORD TO DATA CORE</h3>
          <p>Provide your designation tag to store your final rank in the global ledger.</p>
          <div class="submission-row">
            <input type="text" id="player-designation-tag" placeholder="DESIGNATION TAG" maxlength="15" aria-label="Player Designation Tag">
            <button class="btn btn-gradient" id="btn-save-record">SAVE RECORD</button>
          </div>
        </div>

        <div class="endgame-menu">
          <a href="#mode-select" class="btn btn-gradient btn-large"><i class="fa fa-play-circle"></i> DETECT AGAIN</a>
          <a href="#leaderboard" class="btn btn-outline"><i class="fa fa-list-ol"></i> LEADERBOARD</a>
          <a href="#statistics" class="btn btn-outline"><i class="fa fa-chart-bar"></i> STATISTICS</a>
          <a href="#home" class="btn btn-outline"><i class="fa fa-home"></i> MAIN HANGAR</a>
        </div>
      </div>
    `;

    // Apply confetti triggers on win
    if (this.sessionStats.accuracy >= 60) {
      AnimationsManager.startConfetti(5);
    }

    const saveBtn = document.getElementById('btn-save-record');
    const inputTag = document.getElementById('player-designation-tag');

    saveBtn.addEventListener('click', () => {
      AudioManager.playClick();
      const tagValue = inputTag.value.trim();
      if (!tagValue) {
        UIManager.showNotification({
          title: 'Designation Required',
          description: 'Please type a valid name tag.',
          iconClass: 'fa-exclamation-circle',
          type: 'error'
        });
        return;
      }

      // Save to database
      LeaderboardManager.saveEntry(
        tagValue,
        this.sessionStats.score,
        this.sessionStats.accuracy,
        this.sessionStats.difficulty
      );

      // Hide card
      const subCard = document.getElementById('submission-card');
      subCard.innerHTML = `<h3 class="text-cyan"><i class="fa fa-check-circle"></i> DESIGNATION RECORDED SUCCESSFULLY</h3>`;

      UIManager.showNotification({
        title: 'Score Recorded',
        description: `Designation "${tagValue}" written to ledger.`,
        iconClass: 'fa-check',
        type: 'success'
      });
    });
  }

  getCategoryIcon(type) {
    const icons = {
      image: 'fa-image',
      text: 'fa-file-alt',
      code: 'fa-code',
      voice: 'fa-microphone',
      artwork: 'fa-palette'
    };
    return icons[type] || 'fa-question-circle';
  }
}

export const GameEngine = new GameEngineClass();
