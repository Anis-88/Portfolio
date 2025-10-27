document.addEventListener('DOMContentLoaded', () => {

  /* ------------------ Typewriter ------------------ */
  const typeEl = document.getElementById('typewriter');
  const words = ['Web Developer', 'Designer', 'React Native Dev', 'Open Source Enthusiast'];
  let wIndex = 0, cIndex = 0, deleting = false;
  if (typeEl) {
    const typeSpeed = () => deleting ? 40 : 80;
    (function typeLoop() {
      const current = words[wIndex];
      if (!deleting) {
        typeEl.textContent = current.slice(0, ++cIndex);
        if (cIndex === current.length) {
          deleting = true;
          setTimeout(typeLoop, 900);
          return;
        }
      } else {
        typeEl.textContent = current.slice(0, --cIndex);
        if (cIndex === 0) {
          deleting = false;
          wIndex = (wIndex + 1) % words.length;
        }
      }
      setTimeout(typeLoop, typeSpeed());
    })();
  }

  /* ------------------ Animate skill bars ------------------ */
  function animateSkills() {
    document.querySelectorAll('.progress > span').forEach(span => {
      const w = span.getAttribute('data-width') || '70%';
      span.style.transition = 'width 1200ms cubic-bezier(.2,.9,.2,1)';
      setTimeout(() => { span.style.width = w; }, 300);
    });
  }

  /* ------------------ Scroll reveal ------------------ */
  const faders = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    faders.forEach(f => io.observe(f));
  } else {
    faders.forEach(f => f.classList.add('show'));
  }

  /* ------------------ Particles system ------------------ */
  (function particles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const TAU = Math.PI * 2;
    const particles = [];
    const COUNT = Math.round(Math.min(120, Math.max(40, (W * H) / 90000)));

    function rand(min, max) { return Math.random() * (max - min) + min; }
    function make() {
      particles.length = 0;
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: rand(0.4, 2.2),
          vx: rand(-0.25, 0.6),
          vy: rand(-0.15, 0.35),
          hue: rand(185, 215),
          alpha: rand(0.05, 0.18)
        });
      }
    }

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      make();
    }
    window.addEventListener('resize', resize);

    function step() {
      ctx.clearRect(0, 0, W, H);

      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, 'rgba(56,189,248,0.02)');
      g.addColorStop(1, 'rgba(14,165,233,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      for (let p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x > W + 20) p.x = -20;
        if (p.x < -20) p.x = W + 20;
        if (p.y > H + 20) p.y = -20;
        if (p.y < -20) p.y = H + 20;

        ctx.beginPath();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = `hsl(${p.hue} 90% 60%)`;
        ctx.arc(p.x, p.y, p.r, 0, TAU);
        ctx.fill();
      }

      ctx.globalAlpha = 0.12;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < i + 6 && j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = 'rgba(56,189,248,0.02)';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(step);
    }

    make();
    step();
  })();

  /* ------------------ Skills reveal intersection observer ------------------ */
  const skillsSection = document.getElementById('skills');
  if (skillsSection && 'IntersectionObserver' in window) {
    const skillsObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(ent => {
        if (ent.isIntersecting) {
          animateSkills();
          obs.disconnect();
        }
      });
    }, { threshold: 0.2 });
    skillsObserver.observe(skillsSection);
  } else {
    animateSkills();
  }

  /* ------------------ Smooth scroll for nav links */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        const el = document.querySelector(href);
        if (el) {
          e.preventDefault();   // prevent jumping immediately
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ------------------ Blog expand/hide */
  document.querySelectorAll(".read-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const post = btn.closest(".post");
      document.querySelectorAll(".post").forEach(p => {
        if (p !== post) {
          p.classList.remove("active");
          const otherBtn = p.querySelector(".read-btn");
          if (otherBtn) otherBtn.textContent = "Read";
        }
      });
      const isActive = post.classList.toggle("active");
      btn.textContent = isActive ? "Hide" : "Read";
    });
  });

  /* ------------------ Scrollspy */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  function scrollSpy() {
    let scrollY = window.pageYOffset;
    sections.forEach(sec => {
      const sectionTop = sec.offsetTop - 120;
      const sectionHeight = sec.offsetHeight;
      const id = sec.getAttribute("id");
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => link.classList.remove("active"));
        const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (activeLink) activeLink.classList.add("active");
      }
    });
  }
  window.addEventListener("scroll", scrollSpy);
  scrollSpy();

  

});

