/* ============================
   script.js — animations & UX
   ============================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------ Theme toggle ------------------ */
  const themeBtn = document.getElementById('themeBtn');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') document.documentElement.setAttribute('data-theme', 'light');

  themeBtn?.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
      themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
  });


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


  /* ------------------ Contact form ------------------ */
  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (document.getElementById('name') || {}).value || '';
    const email = (document.getElementById('email') || {}).value || '';
    if (!name.trim() || !email.trim()) {
      alert('Please enter your name and email.');
      return;
    }
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const oldText = submitBtn ? submitBtn.textContent : null;
    if (submitBtn) submitBtn.textContent = 'Sending...';
    setTimeout(() => {
      if (submitBtn) submitBtn.textContent = oldText || 'Send';
      alert(`Thanks ${name.trim()}! Message received.`);
      contactForm.reset();
    }, 900);
  });


  /* ------------------ Tiny particles system ------------------ */
  (function particles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = canvas.width = innerWidth;
    let H = canvas.height = innerHeight;
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
      W = canvas.width = innerWidth;
      H = canvas.height = innerHeight;
      make();
    }
    addEventListener('resize', resize);

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

    make(); step();
  })();


  /* ------------------ Skills reveal ------------------ */
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


  /* ------------------ Smooth scroll ------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const el = document.querySelector(href);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ------------------ Blog Read / Hide toggle ------------------ */
  document.querySelectorAll(".read-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const post = btn.closest(".post");

      // Close other open posts
      document.querySelectorAll(".post").forEach(p => {
        if (p !== post) p.classList.remove("active");
      });

      // Toggle this one
      post.classList.toggle("active");

      // Change button text
      btn.textContent = post.classList.contains("active") ? "Hide" : "Read";
    });
  });


  /* ------------------ Scrollspy (Active nav link on scroll) ------------------ */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  function scrollSpy() {
    let scrollY = window.pageYOffset;

    sections.forEach(sec => {
      const sectionTop = sec.offsetTop - 120; // adjust for header height
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
  scrollSpy(); // run once on load

}); // DOMContentLoaded end
