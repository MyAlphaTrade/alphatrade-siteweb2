// Animated particle background + scroll-to-top
(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'bg-canvas';
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext('2d');

  let W, H;
  const N = 55;
  const GREEN  = '0, 200, 150';
  const PURPLE = '123, 47, 190';
  const GOLD   = '212, 175, 55';
  const COLORS = [GREEN, GREEN, GREEN, PURPLE, GOLD];
  let particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W; this.y = Math.random() * H;
      this.r = Math.random() * 1.5 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.25;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = Math.random() * 0.4 + 0.1;
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.vx; this.y += this.vy; this.pulse += 0.02;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      const a = this.alpha * (0.7 + 0.3 * Math.sin(this.pulse));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${a})`;
      ctx.fill();
    }
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 140) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${a.color}, ${(1 - d/140) * 0.08})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  function drawGlow() {
    const grad = ctx.createRadialGradient(W/2, H*0.3, 0, W/2, H*0.3, W*0.5);
    grad.addColorStop(0, 'rgba(0,200,150,0.035)');
    grad.addColorStop(0.5, 'rgba(123,47,190,0.02)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  function init() { resize(); particles = []; for (let i = 0; i < N; i++) particles.push(new Particle()); }

  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, W, H);
    drawGlow();
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
  }

  window.addEventListener('resize', () => { resize(); init(); });
  init(); animate();

  // ── Scroll reveal ──────────────────────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  revealEls.forEach(el => observer.observe(el));

  // ── Bouton scroll-to-top ───────────────────────────────────────────────────
  const scrollBtn = document.createElement('button');
  scrollBtn.id = 'scrollTop';
  scrollBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`;
  scrollBtn.style.cssText = `
    position:fixed; bottom:32px; right:32px; width:48px; height:48px;
    background:linear-gradient(135deg,#00C896,#00a87d);
    color:#07100b; border:none; border-radius:50%; cursor:pointer;
    display:none; align-items:center; justify-content:center;
    box-shadow:0 4px 20px rgba(0,200,150,0.35); z-index:9999;
    transition:opacity .3s, transform .3s;
  `;
  document.body.appendChild(scrollBtn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollBtn.style.display = 'flex';
      scrollBtn.style.opacity = '1';
    } else {
      scrollBtn.style.opacity = '0';
      setTimeout(() => { if (window.scrollY <= 400) scrollBtn.style.display = 'none'; }, 300);
    }
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

})();
