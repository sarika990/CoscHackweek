/**
 * Premium Rock Paper Scissors - Battle Arena Core Logic
 * Handcrafted using Vanilla JavaScript, HTML5 Canvas, and Web Audio API
 */

(function () {
    'use strict';

    // ==========================================================================
    // State Management
    // ==========================================================================
    const DEFAULT_STATE = {
        scores: { player: 0, computer: 0, draws: 0 },
        stats: {
            gamesPlayed: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            currentStreak: 0,
            longestStreak: 0
        },
        history: [],
        round: 1,
        bestOfFive: false,
        theme: 'dark',
        soundEnabled: true,
        isGameOver: false
    };

    let state = JSON.parse(JSON.stringify(DEFAULT_STATE));

    // Choice mappings
    const CHOICES = {
        rock: { emoji: '🪨', label: 'Rock', beats: 'scissors', colorClass: 'arena-rock' },
        paper: { emoji: '📄', label: 'Paper', beats: 'rock', colorClass: 'arena-paper' },
        scissors: { emoji: '✂️', label: 'Scissors', beats: 'paper', colorClass: 'arena-scissors' }
    };

    // ==========================================================================
    // DOM Elements
    // ==========================================================================
    const els = {
        themeToggle: document.getElementById('theme-toggle'),
        soundToggle: document.getElementById('sound-toggle'),
        modeToggle: document.getElementById('mode-toggle'),
        
        roundIndicator: document.getElementById('round-indicator'),
        modeIndicator: document.getElementById('mode-indicator'),
        
        playerChoiceDisplay: document.getElementById('player-choice-display'),
        playerChoiceName: document.getElementById('player-choice-name'),
        
        computerChoiceDisplay: document.getElementById('computer-choice-display'),
        computerChoiceName: document.getElementById('computer-choice-name'),
        
        resultText: document.getElementById('result-text'),
        resultSubtext: document.getElementById('result-subtext'),
        
        btnRock: document.getElementById('btn-rock'),
        btnPaper: document.getElementById('btn-paper'),
        btnScissors: document.getElementById('btn-scissors'),
        
        postGameArea: document.getElementById('post-game-area'),
        btnPlayAgain: document.getElementById('btn-play-again'),
        btnResetTrigger: document.getElementById('btn-reset-trigger'),
        
        scorePlayer: document.getElementById('score-player'),
        scoreComputer: document.getElementById('score-computer'),
        scoreDraws: document.getElementById('score-draws'),
        
        statWinRate: document.getElementById('stat-win-rate'),
        statGamesPlayed: document.getElementById('stat-games-played'),
        statRatio: document.getElementById('stat-ratio'),
        statStreakCurrent: document.getElementById('stat-streak-current'),
        statStreakLongest: document.getElementById('stat-streak-longest'),
        
        historyList: document.getElementById('history-list-items'),
        particlesContainer: document.getElementById('particles-container'),
        confettiCanvas: document.getElementById('confetti-canvas'),
        
        resetModal: document.getElementById('reset-modal'),
        btnResetCancel: document.getElementById('btn-reset-cancel'),
        btnResetConfirm: document.getElementById('btn-reset-confirm')
    };

    // ==========================================================================
    // Audio Synthesis Engine (Web Audio API)
    // ==========================================================================
    let audioCtx = null;

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playSound(type) {
        if (!state.soundEnabled) return;
        try {
            initAudio();
            const now = audioCtx.currentTime;
            
            switch (type) {
                case 'click': {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(400, now);
                    osc.frequency.exponentialRampToValueAtTime(1000, now + 0.05);
                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start(now);
                    osc.stop(now + 0.05);
                    break;
                }
                case 'win': {
                    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
                    notes.forEach((freq, idx) => {
                        const osc = audioCtx.createOscillator();
                        const gain = audioCtx.createGain();
                        osc.type = 'triangle';
                        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
                        gain.gain.setValueAtTime(0, now + idx * 0.08);
                        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.08 + 0.02);
                        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.25);
                        osc.connect(gain);
                        gain.connect(audioCtx.destination);
                        osc.start(now + idx * 0.08);
                        osc.stop(now + idx * 0.08 + 0.3);
                    });
                    break;
                }
                case 'lose': {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(300, now);
                    osc.frequency.linearRampToValueAtTime(120, now + 0.45);
                    gain.gain.setValueAtTime(0.15, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start(now);
                    osc.stop(now + 0.45);
                    break;
                }
                case 'draw': {
                    const osc1 = audioCtx.createOscillator();
                    const osc2 = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    
                    osc1.frequency.setValueAtTime(220, now);
                    osc2.frequency.setValueAtTime(225, now);
                    
                    gain.gain.setValueAtTime(0.12, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                    
                    osc1.connect(gain);
                    osc2.connect(gain);
                    gain.connect(audioCtx.destination);
                    
                    osc1.start(now);
                    osc2.start(now);
                    osc1.stop(now + 0.3);
                    osc2.stop(now + 0.3);
                    break;
                }
                case 'reset': {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(100, now);
                    osc.frequency.exponentialRampToValueAtTime(800, now + 0.5);
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start(now);
                    osc.stop(now + 0.5);
                    break;
                }
            }
        } catch (e) {
            console.warn('Audio synthesis failed:', e);
        }
    }

    // ==========================================================================
    // Canvas Confetti System
    // ==========================================================================
    let confettiAnimationId = null;
    const confettiCtx = els.confettiCanvas.getContext('2d');
    let confettiParticles = [];

    function resizeConfettiCanvas() {
        els.confettiCanvas.width = window.innerWidth;
        els.confettiCanvas.height = window.innerHeight;
    }

    class ConfettiParticle {
        constructor() {
            this.x = Math.random() * els.confettiCanvas.width;
            this.y = Math.random() * els.confettiCanvas.height - els.confettiCanvas.height;
            this.size = Math.random() * 8 + 6;
            this.color = `hsl(${Math.random() * 360}, 85%, 60%)`;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 4 + 4;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 4 - 2;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;
        }
        draw() {
            confettiCtx.save();
            confettiCtx.translate(this.x, this.y);
            confettiCtx.rotate((this.rotation * Math.PI) / 180);
            confettiCtx.fillStyle = this.color;
            confettiCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            confettiCtx.restore();
        }
    }

    function triggerConfetti() {
        cancelAnimationFrame(confettiAnimationId);
        resizeConfettiCanvas();
        confettiParticles = Array.from({ length: 150 }, () => new ConfettiParticle());
        
        function animate() {
            confettiCtx.clearRect(0, 0, els.confettiCanvas.width, els.confettiCanvas.height);
            let active = false;
            confettiParticles.forEach(p => {
                p.update();
                p.draw();
                if (p.y < els.confettiCanvas.height) active = true;
            });
            if (active) {
                confettiAnimationId = requestAnimationFrame(animate);
            } else {
                confettiCtx.clearRect(0, 0, els.confettiCanvas.width, els.confettiCanvas.height);
            }
        }
        animate();
    }

    // ==========================================================================
    // Visual Particle Backdrop
    // ==========================================================================
    function createBackgroundParticles() {
        const particleCount = 8;
        els.particlesContainer.innerHTML = '';
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            const size = Math.random() * 250 + 100;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.animationDelay = `${Math.random() * 15}s`;
            particle.style.animationDuration = `${Math.random() * 15 + 15}s`;
            
            els.particlesContainer.appendChild(particle);
        }
    }

    // ==========================================================================
    // Core Game Mechanics
    // ==========================================================================
    function getComputerChoice() {
        const weapons = Object.keys(CHOICES);
        return weapons[Math.floor(Math.random() * weapons.length)];
    }

    function playRound(playerChoice) {
        if (state.isGameOver) return;
        playSound('click');

        const computerChoice = getComputerChoice();
        
        // Visual battle reveal animation sequence
        animateBattleReveal(playerChoice, computerChoice);
    }

    function animateBattleReveal(playerChoice, computerChoice) {
        // Disable choice buttons during animation
        setChoiceButtonsEnabled(false);

        let count = 0;
        const emojis = ['🪨', '📄', '✂️'];
        
        // Bounce placeholder animation
        const interval = setInterval(() => {
            els.playerChoiceDisplay.textContent = emojis[count % 3];
            els.computerChoiceDisplay.textContent = emojis[(count + 1) % 3];
            count++;
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            
            // Set real choices
            const pWeapon = CHOICES[playerChoice];
            const cWeapon = CHOICES[computerChoice];
            
            // Player
            els.playerChoiceDisplay.textContent = pWeapon.emoji;
            els.playerChoiceDisplay.className = `slot-circle shadow-glow ${pWeapon.colorClass}`;
            els.playerChoiceName.textContent = pWeapon.label;

            // Computer
            els.computerChoiceDisplay.textContent = cWeapon.emoji;
            els.computerChoiceDisplay.className = `slot-circle shadow-glow ${cWeapon.colorClass}`;
            els.computerChoiceName.textContent = cWeapon.label;

            // Calculate winner
            evaluateResult(playerChoice, computerChoice);
        }, 600);
    }

    function evaluateResult(playerChoice, computerChoice) {
        let result = ''; // 'win', 'lose', 'draw'
        let titleText = '';
        let subText = '';

        if (playerChoice === computerChoice) {
            result = 'draw';
            titleText = 'Draw!';
            subText = 'Great minds think alike.';
            state.scores.draws++;
            state.stats.draws++;
            state.stats.currentStreak = 0;
            playSound('draw');
        } else if (CHOICES[playerChoice].beats === computerChoice) {
            result = 'win';
            titleText = 'You Win!';
            subText = `${CHOICES[playerChoice].label} beats ${CHOICES[computerChoice].label}.`;
            state.scores.player++;
            state.stats.wins++;
            state.stats.currentStreak++;
            if (state.stats.currentStreak > state.stats.longestStreak) {
                state.stats.longestStreak = state.stats.currentStreak;
            }
            playSound('win');
            triggerHighlight('player');
        } else {
            result = 'lose';
            titleText = 'Computer Wins!';
            subText = `${CHOICES[computerChoice].label} beats ${CHOICES[playerChoice].label}.`;
            state.scores.computer++;
            state.stats.losses++;
            state.stats.currentStreak = 0;
            playSound('lose');
            triggerHighlight('computer');
        }

        state.stats.gamesPlayed++;

        // Add history
        state.history.unshift({
            round: state.round,
            player: playerChoice,
            computer: computerChoice,
            result: result
        });

        // Check Best of 5 status
        if (state.bestOfFive) {
            if (state.scores.player === 3) {
                state.isGameOver = true;
                titleText = '🏆 Victory!';
                subText = 'You won the Best of 5 match!';
                triggerConfetti();
            } else if (state.scores.computer === 3) {
                state.isGameOver = true;
                titleText = '💀 Match Defeat';
                subText = 'Computer won the Best of 5 match.';
            }
        }

        // Render updates
        els.resultText.textContent = titleText;
        els.resultText.className = `result-text ${result}`;
        els.resultSubtext.textContent = subText;

        if (state.isGameOver) {
            els.postGameArea.classList.remove('d-none');
            setChoiceButtonsEnabled(false);
        } else {
            state.round++;
            setChoiceButtonsEnabled(true);
        }

        updateUI();
        saveState();
    }

    function triggerHighlight(winner) {
        if (winner === 'player') {
            els.playerChoiceDisplay.classList.add('winner-glow');
        } else {
            els.computerChoiceDisplay.classList.add('winner-glow');
        }
    }

    function setChoiceButtonsEnabled(enabled) {
        els.btnRock.disabled = !enabled;
        els.btnPaper.disabled = !enabled;
        els.btnScissors.disabled = !enabled;
    }

    // ==========================================================================
    // UI Renderers & State Persistent Synchronizers
    // ==========================================================================
    function updateUI() {
        // Scoreboard
        els.scorePlayer.textContent = state.scores.player;
        els.scoreComputer.textContent = state.scores.computer;
        els.scoreDraws.textContent = state.scores.draws;
        
        // Round
        els.roundIndicator.textContent = `Round ${state.round}`;
        
        // Modes
        if (state.bestOfFive) {
            els.modeIndicator.classList.remove('d-none');
        } else {
            els.modeIndicator.classList.add('d-none');
        }

        // Stats Panel
        els.statGamesPlayed.textContent = state.stats.gamesPlayed;
        els.statRatio.textContent = `${state.stats.wins} / ${state.stats.losses} / ${state.stats.draws}`;
        els.statStreakCurrent.textContent = state.stats.currentStreak;
        els.statStreakLongest.textContent = state.stats.longestStreak;
        
        // Win rate percentage calculation
        const rate = state.stats.gamesPlayed > 0 
            ? Math.round((state.stats.wins / state.stats.gamesPlayed) * 100) 
            : 0;
        els.statWinRate.textContent = `${rate}%`;

        // Render Match History
        renderHistoryList();
    }

    function renderHistoryList() {
        els.historyList.innerHTML = '';
        if (state.history.length === 0) {
            const emptyLi = document.createElement('li');
            emptyLi.className = 'history-empty';
            emptyLi.textContent = 'No rounds played yet';
            els.historyList.appendChild(emptyLi);
            return;
        }

        state.history.forEach(item => {
            const li = document.createElement('li');
            li.className = 'history-item';
            
            const pEmoji = CHOICES[item.player].emoji;
            const cEmoji = CHOICES[item.computer].emoji;
            
            let statusTagClass = 'tag-draw';
            let statusLabel = 'Draw';
            if (item.result === 'win') {
                statusTagClass = 'tag-win';
                statusLabel = 'Win';
            } else if (item.result === 'lose') {
                statusTagClass = 'tag-lose';
                statusLabel = 'Loss';
            }

            li.innerHTML = `
                <span class="round-num">Rd ${item.round}</span>
                <span class="history-choices">You: ${pEmoji} vs Com: ${cEmoji}</span>
                <span class="status-tag ${statusTagClass}">${statusLabel}</span>
            `;
            els.historyList.appendChild(li);
        });
    }

    function resetArenaUI() {
        els.playerChoiceDisplay.textContent = '?';
        els.playerChoiceDisplay.className = 'slot-circle shadow-glow';
        els.playerChoiceName.textContent = '-';
        
        els.computerChoiceDisplay.textContent = '?';
        els.computerChoiceDisplay.className = 'slot-circle shadow-glow';
        els.computerChoiceName.textContent = '-';

        els.resultText.textContent = 'Make Your Move';
        els.resultText.className = 'result-text';
        els.resultSubtext.textContent = state.bestOfFive 
            ? 'First to 3 wins in Best of 5 mode' 
            : 'Play at your own pace';
        
        els.postGameArea.classList.add('d-none');
        setChoiceButtonsEnabled(true);
    }

    function playAgain() {
        state.scores.player = 0;
        state.scores.computer = 0;
        state.scores.draws = 0;
        state.round = 1;
        state.isGameOver = false;
        
        playSound('click');
        resetArenaUI();
        updateUI();
        saveState();
    }

    function resetAllProgress() {
        state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        
        // Preserve current settings
        state.theme = document.documentElement.getAttribute('data-theme') || 'dark';
        state.soundEnabled = !els.soundToggle.querySelector('.icon-sound-on').classList.contains('d-none');
        state.bestOfFive = els.modeToggle.getAttribute('aria-checked') === 'true';

        playSound('reset');
        resetArenaUI();
        updateUI();
        saveState();
    }

    // ==========================================================================
    // LocalStorage State Controllers
    // ==========================================================================
    function saveState() {
        localStorage.setItem('rps_arena_state_v1', JSON.stringify(state));
    }

    function loadState() {
        const saved = localStorage.getItem('rps_arena_state_v1');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Schema protection / deep merge
                state = { ...DEFAULT_STATE, ...parsed };
                state.scores = { ...DEFAULT_STATE.scores, ...parsed.scores };
                state.stats = { ...DEFAULT_STATE.stats, ...parsed.stats };
            } catch (e) {
                console.warn('Error loading game state from localStorage:', e);
            }
        }
        
        // Apply loaded settings
        applyTheme(state.theme);
        applySound(state.soundEnabled);
        applyMode(state.bestOfFive);
        
        updateUI();
        if (state.isGameOver) {
            els.postGameArea.classList.remove('d-none');
            setChoiceButtonsEnabled(false);
            
            // Re-render final game over state texts
            if (state.scores.player === 3 && state.bestOfFive) {
                els.resultText.textContent = '🏆 Victory!';
                els.resultText.className = 'result-text win';
                els.resultSubtext.textContent = 'You won the Best of 5 match!';
            } else if (state.scores.computer === 3 && state.bestOfFive) {
                els.resultText.textContent = '💀 Match Defeat';
                els.resultText.className = 'result-text lose';
                els.resultSubtext.textContent = 'Computer won the Best of 5 match.';
            }
        } else {
            resetArenaUI();
        }
    }

    function applyTheme(theme) {
        state.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            els.themeToggle.querySelector('.icon-sun').classList.remove('d-none');
            els.themeToggle.querySelector('.icon-moon').classList.add('d-none');
        } else {
            els.themeToggle.querySelector('.icon-sun').classList.add('d-none');
            els.themeToggle.querySelector('.icon-moon').classList.remove('d-none');
        }
    }

    function applySound(enabled) {
        state.soundEnabled = enabled;
        if (enabled) {
            els.soundToggle.querySelector('.icon-sound-on').classList.remove('d-none');
            els.soundToggle.querySelector('.icon-sound-off').classList.add('d-none');
            els.soundToggle.setAttribute('aria-label', 'Mute sound');
        } else {
            els.soundToggle.querySelector('.icon-sound-on').classList.add('d-none');
            els.soundToggle.querySelector('.icon-sound-off').classList.remove('d-none');
            els.soundToggle.setAttribute('aria-label', 'Unmute sound');
        }
    }

    function applyMode(bestOfFive) {
        state.bestOfFive = bestOfFive;
        els.modeToggle.setAttribute('aria-checked', bestOfFive ? 'true' : 'false');
        
        // Reset scores if mode changes mid-game
        state.scores.player = 0;
        state.scores.computer = 0;
        state.scores.draws = 0;
        state.round = 1;
        state.isGameOver = false;
        
        resetArenaUI();
        updateUI();
    }

    // ==========================================================================
    // Event Listeners & Input Handlers
    // ==========================================================================
    function setupEventListeners() {
        // Weapon choice selectors
        els.btnRock.addEventListener('click', () => playRound('rock'));
        els.btnPaper.addEventListener('click', () => playRound('paper'));
        els.btnScissors.addEventListener('click', () => playRound('scissors'));

        // Action Buttons
        els.btnPlayAgain.addEventListener('click', playAgain);
        
        // Reset Dialog management
        els.btnResetTrigger.addEventListener('click', () => {
            playSound('click');
            els.resetModal.classList.remove('d-none');
            els.btnResetConfirm.focus();
        });

        els.btnResetCancel.addEventListener('click', () => {
            playSound('click');
            els.resetModal.classList.add('d-none');
        });

        els.btnResetConfirm.addEventListener('click', () => {
            resetAllProgress();
            els.resetModal.classList.add('d-none');
        });

        // Theme and Audio Toggles
        els.themeToggle.addEventListener('click', () => {
            const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme);
            playSound('click');
            saveState();
        });

        els.soundToggle.addEventListener('click', () => {
            applySound(!state.soundEnabled);
            playSound('click');
            saveState();
        });

        els.modeToggle.addEventListener('click', () => {
            applyMode(!state.bestOfFive);
            playSound('click');
            saveState();
        });

        // Keyboard Controls
        window.addEventListener('keydown', handleKeyboardShortcuts);

        // Window resize
        window.addEventListener('resize', () => {
            if (confettiParticles.length > 0) {
                resizeConfettiCanvas();
            }
        });
    }

    function handleKeyboardShortcuts(e) {
        // Skip hotkeys if user is in confirmation modal
        const isModalOpen = !els.resetModal.classList.contains('d-none');
        
        if (isModalOpen) {
            if (e.key === 'Escape') {
                e.preventDefault();
                els.resetModal.classList.add('d-none');
                playSound('click');
            }
            return;
        }

        const key = e.key.toLowerCase();
        
        if (!state.isGameOver) {
            if (key === 'r') {
                els.btnRock.click();
            } else if (key === 'p') {
                els.btnPaper.click();
            } else if (key === 's') {
                els.btnScissors.click();
            }
        } else {
            if (e.key === 'Enter') {
                e.preventDefault();
                els.btnPlayAgain.click();
            }
        }

        if (e.key === 'Escape') {
            e.preventDefault();
            els.btnResetTrigger.click();
        }
    }

    // ==========================================================================
    // Initialization
    // ==========================================================================
    function init() {
        createBackgroundParticles();
        loadState();
        setupEventListeners();
    }

    document.addEventListener('DOMContentLoaded', init);

})();
