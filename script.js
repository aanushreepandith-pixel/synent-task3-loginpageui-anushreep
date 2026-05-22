/* ════════════════════════════════════════════════════
   SYNENT TECHNOLOGIES — LOGIN PAGE SCRIPT
   Handles: canvas grid, particles, validation, toggle, submit
   ════════════════════════════════════════════════════ */

/* ── 1. ANIMATED TECH GRID (Canvas) ─────────────────────
   Draws a perspective-style dot grid that slowly pulses,
   giving the background a living data-center feel.
────────────────────────────────────────────────────── */
(function initGrid() {
  const canvas = document.getElementById('gridCanvas');
  const ctx    = canvas.getContext('2d');

  let W, H, cols, rows, dots = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildDots();
  }

  function buildDots() {
    dots = [];
    const gap = 48;
    cols = Math.ceil(W / gap) + 1;
    rows = Math.ceil(H / gap) + 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({
          x: c * gap,
          y: r * gap,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 0.6,
        });
      }
    }
  }

  let raf;
  function draw(ts) {
    ctx.clearRect(0, 0, W, H);
    const t = ts * 0.001;

    dots.forEach(d => {
      const pulse = 0.3 + 0.5 * Math.sin(d.phase + t * d.speed);
      ctx.beginPath();
      ctx.arc(d.x, d.y, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(10,108,255,${pulse * 0.6})`;
      ctx.fill();
    });

    raf = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  raf = requestAnimationFrame(draw);
})();


/* ── 2. FLOATING PARTICLES ───────────────────────────────
   Creates small glowing dots that drift upward randomly.
────────────────────────────────────────────────────── */
(function initParticles() {
  const container = document.getElementById('particles');
  const COUNT = 28;

  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size = 2 + Math.random() * 3;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${20 + Math.random() * 80}%;
      width: ${size}px;
      height: ${size}px;
      --dur: ${6 + Math.random() * 10}s;
      --delay: ${Math.random() * 8}s;
      opacity: 0;
      background: ${Math.random() > 0.5 ? '#0a6cff' : '#00d4ff'};
    `;
    container.appendChild(p);
  }
})();


/* ── 3. DOM REFERENCES ───────────────────────────────── */
const form          = document.getElementById('loginForm');
const emailInput    = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailGroup    = document.getElementById('emailGroup');
const passwordGroup = document.getElementById('passwordGroup');
const emailErr      = document.getElementById('emailErr');
const passwordErr   = document.getElementById('passwordErr');
const togglePwBtn   = document.getElementById('togglePw');
const eyeOpen       = document.getElementById('eyeOpen');
const eyeClosed     = document.getElementById('eyeClosed');
const signinBtn     = document.getElementById('signinBtn');
const btnLabel      = document.getElementById('btnLabel');
const btnSpinner    = document.getElementById('btnSpinner');
const successBanner = document.getElementById('successBanner');
const forgotLink    = document.getElementById('forgotLink');


/* ── 4. VALIDATION HELPERS ───────────────────────────── */
const isValidEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

function showErr(group, el, msg) {
  group.classList.add('error');
  el.textContent = msg;
}
function clearErr(group, el) {
  group.classList.remove('error');
  el.textContent = '';
}

function validateAll() {
  let ok = true;

  // Email
  if (!emailInput.value.trim()) {
    showErr(emailGroup, emailErr, 'Email address is required.');
    ok = false;
  } else if (!isValidEmail(emailInput.value)) {
    showErr(emailGroup, emailErr, 'Please enter a valid email address.');
    ok = false;
  } else {
    clearErr(emailGroup, emailErr);
  }

  // Password
  if (!passwordInput.value) {
    showErr(passwordGroup, passwordErr, 'Password is required.');
    ok = false;
  } else if (passwordInput.value.length < 6) {
    showErr(passwordGroup, passwordErr, 'Password must be at least 6 characters.');
    ok = false;
  } else {
    clearErr(passwordGroup, passwordErr);
  }

  return ok;
}


/* ── 5. REAL-TIME INLINE VALIDATION (on blur + input) ── */
emailInput.addEventListener('blur', () => {
  if (!emailInput.value.trim()) {
    showErr(emailGroup, emailErr, 'Email address is required.');
  } else if (!isValidEmail(emailInput.value)) {
    showErr(emailGroup, emailErr, 'Please enter a valid email address.');
  } else {
    clearErr(emailGroup, emailErr);
  }
});
emailInput.addEventListener('input', () => {
  if (emailGroup.classList.contains('error') && isValidEmail(emailInput.value))
    clearErr(emailGroup, emailErr);
});

passwordInput.addEventListener('blur', () => {
  if (!passwordInput.value)
    showErr(passwordGroup, passwordErr, 'Password is required.');
  else if (passwordInput.value.length < 6)
    showErr(passwordGroup, passwordErr, 'Password must be at least 6 characters.');
  else
    clearErr(passwordGroup, passwordErr);
});
passwordInput.addEventListener('input', () => {
  if (passwordGroup.classList.contains('error') && passwordInput.value.length >= 6)
    clearErr(passwordGroup, passwordErr);
});


/* ── 6. PASSWORD VISIBILITY TOGGLE ──────────────────── */
togglePwBtn.addEventListener('click', () => {
  const isHidden = passwordInput.type === 'password';
  passwordInput.type = isHidden ? 'text' : 'password';
  eyeOpen.style.display   = isHidden ? 'none'  : 'block';
  eyeClosed.style.display = isHidden ? 'block' : 'none';
  togglePwBtn.setAttribute('aria-label',
    isHidden ? 'Hide password' : 'Show password'
  );
  // Keep focus on password field
  passwordInput.focus();
});


/* ── 7. FORM SUBMIT ──────────────────────────────────── */
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  successBanner.classList.remove('show');

  if (!validateAll()) return;

  // Loading state
  signinBtn.disabled = true;
  btnLabel.textContent = 'Authenticating';
  btnSpinner.style.display = 'flex';

  // Simulate API call (replace with real fetch in production)
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Reset button
  signinBtn.disabled = false;
  btnLabel.textContent = 'Sign In to Portal';
  btnSpinner.style.display = 'none';

  // Show success
  successBanner.classList.add('show');

  // In production, redirect:
  // window.location.href = '/dashboard';
});


/* ── 8. FORGOT PASSWORD ──────────────────────────────── */
forgotLink.addEventListener('click', (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();

  if (!email || !isValidEmail(email)) {
    emailInput.focus();
    showErr(emailGroup, emailErr, 'Please enter your registered email, then click Forgot Password.');
    return;
  }

  // In production replace alert with a modal / toast
  alert(`Password reset instructions have been sent to:\n${email}\n\nPlease check your inbox.`);
});