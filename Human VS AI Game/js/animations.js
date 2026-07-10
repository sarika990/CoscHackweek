/**
 * Animations Manager
 * Handles particle backgrounds, click ripples, victory confetti, and card flips.
 */
import { StorageManager } from './storage.js';

class AnimationsManagerClass {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.confettiParticles = [];
    this.animationFrameId = null;
    this.confettiFrameId = null;
    this.enabled = true;

    // Load setting
    const settings = StorageManager.getSettings();
    this.enabled = settings.animationsEnabled;
  }

  initBackground(canvasElement) {
    if (!this.enabled || !canvasElement) return;
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.createParticles();
    this.animateBackground();
  }

  resizeCanvas() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  }

  createParticles() {
    this.particles = [];
    const count = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 20000));
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.1
      });
    }
  }

  animateBackground() {
    if (!this.enabled || !this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap around edges
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(0, 242, 254, ${p.opacity})`;
      this.ctx.shadowBlur = 4;
      this.ctx.shadowColor = '#00f2fe';
      this.ctx.fill();
    });

    this.animationFrameId = requestAnimationFrame(() => this.animateBackground());
  }

  stopBackground() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  toggleAnimations(enabled) {
    this.enabled = enabled;
    if (enabled) {
      if (this.canvas) this.initBackground(this.canvas);
    } else {
      this.stopBackground();
      this.stopConfetti();
      if (this.ctx && this.canvas) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }

  // --- Confetti Explosion ---

  startConfetti(durationSeconds = 4) {
    if (!this.enabled) return;

    // Create container canvas if not exist
    let confettiCanvas = document.getElementById('confetti-canvas');
    if (!confettiCanvas) {
      confettiCanvas = document.createElement('canvas');
      confettiCanvas.id = 'confetti-canvas';
      confettiCanvas.style.position = 'fixed';
      confettiCanvas.style.top = '0';
      confettiCanvas.style.left = '0';
      confettiCanvas.style.width = '100vw';
      confettiCanvas.style.height = '100vh';
      confettiCanvas.style.pointerEvents = 'none';
      confettiCanvas.style.zIndex = '99999';
      document.body.appendChild(confettiCanvas);
    }

    const cCtx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const colors = ['#00ffcc', '#00f2fe', '#b621fe', '#fe019a', '#ffaa00'];
    this.confettiParticles = [];

    // Populate confetti particles
    for (let i = 0; i < 150; i++) {
      this.confettiParticles.push({
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * -confettiCanvas.height,
        size: Math.random() * 8 + 4,
        speedX: (Math.random() - 0.5) * 4,
        speedY: Math.random() * 5 + 3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const animateConfetti = () => {
      cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      let active = false;

      this.confettiParticles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y < confettiCanvas.height) {
          active = true;
          cCtx.save();
          cCtx.translate(p.x, p.y);
          cCtx.rotate((p.rotation * Math.PI) / 180);
          cCtx.fillStyle = p.color;
          cCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          cCtx.restore();
        }
      });

      if (active) {
        this.confettiFrameId = requestAnimationFrame(animateConfetti);
      } else {
        this.stopConfetti();
      }
    };

    animateConfetti();

    // Stop after duration
    setTimeout(() => this.stopConfetti(), durationSeconds * 1000);
  }

  stopConfetti() {
    if (this.confettiFrameId) {
      cancelAnimationFrame(this.confettiFrameId);
      this.confettiFrameId = null;
    }
    const canvas = document.getElementById('confetti-canvas');
    if (canvas) {
      canvas.remove();
    }
  }

  // --- Button Ripple Effect ---

  applyRipple(event, button) {
    if (!this.enabled) return;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add('ripple-span');

    const prevRipple = button.querySelector('.ripple-span');
    if (prevRipple) {
      prevRipple.remove();
    }

    button.appendChild(circle);
  }
}

export const AnimationsManager = new AnimationsManagerClass();
