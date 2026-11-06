// ==========================================================================
// HRISHIKESH S SHETTY — PORTFOLIO INTERACTIONS & HIGH-IMPACT EFFECTS
// ==========================================================================

// --- 1. WEB AUDIO API SOUND ENGINE (SUBTLE PROCEDURAL SFX) ---
class SoundFX {
    constructor() {
        this.ctx = null;
        this.isMuted = localStorage.getItem('sound_muted') === 'true';
    }

    init() {
        if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
    }

    playChime() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const now = this.ctx.currentTime;
        // Dual-tone harmonic celebration chime (E6 & B6)
        [1318.51, 1975.53].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);

            gain.gain.setValueAtTime(0.12, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.45);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.5);
        });
    }

    playClick() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('sound_muted', this.isMuted ? 'true' : 'false');
        return !this.isMuted;
    }
}

const sfx = new SoundFX();

// --- 2. THEME ENGINE (DARK / LIGHT DUAL MODE) ---
const themeBtn = document.getElementById('theme-toggle');
const body = document.body;
const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.replace('dark-mode', 'light-mode');
    if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
}

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        sfx.playClick();
        if (body.classList.contains('dark-mode')) {
            body.classList.replace('dark-mode', 'light-mode');
            if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.replace('light-mode', 'dark-mode');
            if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// Sound mute toggle button
const soundBtn = document.getElementById('sound-toggle');
if (soundBtn) {
    const soundIcon = soundBtn.querySelector('i');
    if (sfx.isMuted && soundIcon) {
        soundIcon.classList.replace('fa-volume-high', 'fa-volume-xmark');
    }
    soundBtn.addEventListener('click', () => {
        const unmuted = sfx.toggleMute();
        if (soundIcon) {
            if (unmuted) {
                soundIcon.classList.replace('fa-volume-xmark', 'fa-volume-high');
                sfx.playClick();
            } else {
                soundIcon.classList.replace('fa-volume-high', 'fa-volume-xmark');
            }
        }
    });
}

// --- 3. CURSOR GLOW TRAILER & 3D CARD TILT ---
const cursorGlow = document.querySelector('.cursor-glow');
window.addEventListener('mousemove', (e) => {
    if (cursorGlow) {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
    }
});

document.querySelectorAll('.bento-card, .stat-card, .skill-category-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        if (window.innerWidth > 900) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -3.5;
            const rotateY = ((x - centerX) / centerX) * 3.5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        }
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
    });
});

// --- 4. PROCEDURAL CANVAS PARTICLES ---
const canvas = document.getElementById('bg-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const particles = [];
    let mousePos = { x: -1000, y: -1000 };

    window.addEventListener('resize', () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.vx = (Math.random() - 0.5) * 0.65;
            this.vy = (Math.random() - 0.5) * 0.65;
            this.radius = Math.random() * 2 + 0.8;
            this.isChaiColor = Math.random() > 0.6;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off boundaries
            if (this.x < 0 || this.x > w) this.vx *= -1;
            if (this.y < 0 || this.y > h) this.vy *= -1;

            // Subtle mouse repulsion
            const dx = this.x - mousePos.x;
            const dy = this.y - mousePos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                this.x += (dx / dist) * 1.5;
                this.y += (dy / dist) * 1.5;
            }
        }

        draw(isLight) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            if (this.isChaiColor) {
                ctx.fillStyle = isLight ? 'rgba(245, 158, 11, 0.55)' : 'rgba(245, 158, 11, 0.65)';
            } else {
                ctx.fillStyle = isLight ? 'rgba(0, 180, 216, 0.45)' : 'rgba(0, 180, 216, 0.55)';
            }
            ctx.fill();
        }
    }

    const count = window.innerWidth < 768 ? 35 : 70;
    for (let i = 0; i < count; i++) particles.push(new Particle());

    function animateCanvas() {
        ctx.clearRect(0, 0, w, h);
        const isLight = body.classList.contains('light-mode');

        particles.forEach(p => {
            p.update();
            p.draw(isLight);
        });

        // Interconnecting lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    const alpha = 1 - (dist / 120);
                    ctx.strokeStyle = particles[i].isChaiColor
                        ? `rgba(245, 158, 11, ${alpha * 0.18})`
                        : `rgba(0, 180, 216, ${alpha * 0.15})`;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateCanvas);
    }
    animateCanvas();
}

// --- 5. CANVAS CONFETTI CANNON (BUILT-IN PROCEDURAL PARTICLE SYSTEM) ---
class ConfettiCannon {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9999';
        document.body.appendChild(this.canvas);

        this.particles = [];
        this.animating = false;
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    fire(originX, originY) {
        const colors = ['#f59e0b', '#fbbf24', '#00b4d8', '#38bdf8', '#10b981', '#ec4899', '#8b5cf6'];
        const count = 90;

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI / 180) * (Math.random() * 360);
            const speed = Math.random() * 12 + 6;
            this.particles.push({
                x: originX || window.innerWidth / 2,
                y: originY || window.innerHeight / 2,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 4,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 14,
                life: 1,
                decay: Math.random() * 0.015 + 0.01
            });
        }

        if (!this.animating) {
            this.animating = true;
            this.animate();
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.35; // Gravity
            p.vx *= 0.98; // Friction
            p.rotation += p.rotationSpeed;
            p.life -= p.decay;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
            this.ctx.restore();
        }

        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.animating = false;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

const confetti = new ConfettiCannon();

// --- 6. GET-ME-CHAI INTERACTIVE SIMULATOR ---
let selectedChaiAmount = 50;
let totalChaisCount = 142;
let totalAmountRaised = 7100;

const amountChips = document.querySelectorAll('.amount-chip');
amountChips.forEach(chip => {
    chip.addEventListener('click', () => {
        sfx.playClick();
        amountChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        selectedChaiAmount = parseInt(chip.getAttribute('data-amount'), 10) || 50;
    });
});

const sendChaiBtn = document.getElementById('sim-send-btn');
const simNameInput = document.getElementById('sim-name');
const simMsgInput = document.getElementById('sim-msg');
const streamList = document.getElementById('sim-stream-list');
const totalChaisElem = document.getElementById('total-chais-count');

if (sendChaiBtn) {
    sendChaiBtn.addEventListener('click', () => {
        const name = (simNameInput && simNameInput.value.trim()) || 'Generous Supporter';
        const msg = (simMsgInput && simMsgInput.value.trim()) || 'Keep building great apps! 🚀';

        // Play celebratory chime & confetti cannon
        sfx.playChime();
        const rect = sendChaiBtn.getBoundingClientRect();
        confetti.fire(rect.left + rect.width / 2, rect.top + rect.height / 2);

        // Update stats
        totalChaisCount += (selectedChaiAmount / 50);
        totalAmountRaised += selectedChaiAmount;
        if (totalChaisElem) {
            totalChaisElem.innerText = `₹${totalAmountRaised.toLocaleString('en-IN')}`;
        }

        // Add to simulated live stream
        if (streamList) {
            const newItem = document.createElement('div');
            newItem.className = 'stream-item';
            newItem.innerHTML = `
                <div>
                    <span class="stream-name">${escapeHTML(name)}</span>
                    <div style="font-size: 0.74rem; color: var(--text-secondary); margin-top: 2px;">"${escapeHTML(msg)}"</div>
                </div>
                <span class="stream-amount">+₹${selectedChaiAmount}</span>
            `;
            streamList.insertBefore(newItem, streamList.firstChild);

            // Limit list to last 5
            if (streamList.children.length > 5) {
                streamList.removeChild(streamList.lastChild);
            }
        }

        // Button feedback
        const origText = sendChaiBtn.innerHTML;
        sendChaiBtn.innerHTML = '<i class="fa-solid fa-heart" style="color: #ec4899;"></i> Chai Sent!';
        sendChaiBtn.style.background = '#10b981';

        setTimeout(() => {
            sendChaiBtn.innerHTML = origText;
            sendChaiBtn.style.background = '';
            if (simMsgInput) simMsgInput.value = '';
        }, 2200);
    });
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag] || tag));
}

// --- 7. INTERACTIVE DEVELOPER TERMINAL / CLI ---
const termInput = document.getElementById('term-input');
const termOutput = document.getElementById('term-output');

if (termInput && termOutput) {
    termInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = termInput.value.trim().toLowerCase();
            termInput.value = '';
            handleTermCommand(cmd);
        }
    });
}

function printTermLine(text, className = '') {
    if (!termOutput) return;
    const line = document.createElement('div');
    line.className = `term-line ${className}`;
    line.innerHTML = text;
    termOutput.appendChild(line);
    termOutput.scrollTop = termOutput.scrollHeight;
}

function handleTermCommand(cmd) {
    if (!cmd) return;
    printTermLine(`<span class="term-prompt">guest@hrishi:~$</span> ${escapeHTML(cmd)}`);

    switch (cmd) {
        case 'help':
            printTermLine('Available commands:');
            printTermLine('  <span style="color: var(--chai-amber);">chai</span>      - Learn about Get-Me-Chai & trigger test donation');
            printTermLine('  <span style="color: var(--primary);">projects</span>  - List all flagship projects and live links');
            printTermLine('  <span style="color: var(--primary);">skills</span>    - View full-stack technical competencies');
            printTermLine('  <span style="color: var(--primary);">contact</span>   - Get direct contact details');
            printTermLine('  <span style="color: var(--primary);">resume</span>    - Download the ATS-optimized resume PDF');
            printTermLine('  <span style="color: var(--primary);">theme</span>     - Toggle dark/light visual theme');
            printTermLine('  <span style="color: var(--primary);">clear</span>     - Clear terminal window');
            printTermLine('  <span style="color: var(--primary);">sudo</span>      - Run superuser command');
            break;

        case 'chai':
        case 'getmechai':
            printTermLine('☕ <strong>Get-Me-Chai:</strong> Full-Stack Creator Crowdfunding Platform (Next.js 14, Razorpay, MongoDB Atlas, NextAuth).');
            printTermLine('🔗 Live URL: <a href="https://get-me-chai-tawny-five.vercel.app/" target="_blank" style="color: var(--chai-amber);">https://get-me-chai-tawny-five.vercel.app/</a>');
            sfx.playChime();
            confetti.fire(window.innerWidth / 2, window.innerHeight / 2);
            break;

        case 'projects':
            printTermLine('1. ☕ <strong>Get-Me-Chai:</strong> Next.js 14 SaaS with Razorpay payment gateway.');
            printTermLine('2. 💧 <strong>Aquajaal POS:</strong> Production water distribution POS (Flutter, Hive, Firebase RTDB).');
            printTermLine('3. 📱 <strong>Task Buddy:</strong> Flutter productivity suite with OTP auth & gamification.');
            printTermLine('4. 🎵 <strong>Spotify Clone:</strong> Web Audio streaming player in Vanilla JS.');
            printTermLine('5. 🐦 <strong>Twitter / X Clone:</strong> Pixel-perfect responsive Tailwind UI.');
            break;

        case 'skills':
            printTermLine('💻 <strong>Frontend:</strong> Next.js 14, React.js, Flutter, Tailwind CSS, JavaScript (ES6+), Dart');
            printTermLine('🗄️ <strong>Backend:</strong> Node.js, Express, MongoDB Atlas, Mongoose, Hive NoSQL, Firebase RTDB');
            printTermLine('💳 <strong>APIs:</strong> Razorpay Payment Gateway, NextAuth.js (OAuth 2.0)');
            printTermLine('🎓 <strong>CS Core:</strong> DSA, OOP, DBMS, SQL, C/C++, Java (9.65 CGPA @ RIT)');
            break;

        case 'contact':
            printTermLine('📧 Email: <a href="mailto:hrishikeshshetty9o@gmail.com" style="color: var(--primary);">hrishikeshshetty9o@gmail.com</a>');
            printTermLine('💼 LinkedIn: <a href="https://www.linkedin.com/in/hrishikesh-shetty-86779o/" target="_blank" style="color: var(--primary);">linkedin.com/in/hrishikesh-shetty-86779o</a>');
            printTermLine('🐙 GitHub: <a href="https://github.com/Hrishi9o" target="_blank" style="color: var(--primary);">github.com/Hrishi9o</a>');
            printTermLine('📞 Phone: +91-82174 82716');
            break;

        case 'resume':
            printTermLine('📄 Opening Hrishi.pdf download...');
            window.open('Hrishi.pdf', '_blank');
            break;

        case 'theme':
            if (themeBtn) themeBtn.click();
            printTermLine('Theme mode toggled.');
            break;

        case 'clear':
            if (termOutput) termOutput.innerHTML = '';
            break;

        case 'sudo':
            printTermLine('User is not in the sudoers file. This incident will be reported to Hrishikesh. 😉', 'text-spotify');
            break;

        default:
            printTermLine(`Command not found: "${escapeHTML(cmd)}". Type <span style="color: var(--chai-amber);">help</span> for available commands.`);
    }
}

// --- 8. COPY EMAIL CLIPBOARD HANDLER ---
function copyEmail() {
    sfx.playClick();
    const email = "hrishikeshshetty9o@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
        const emailText = document.getElementById("email-text");
        const emailBtn = document.getElementById("email-btn");

        if (emailText && emailBtn) {
            const orig = emailText.innerText;
            emailText.innerText = "Copied to Clipboard!";
            emailBtn.style.backgroundColor = "#10b981";
            emailBtn.style.borderColor = "#10b981";

            setTimeout(() => {
                emailText.innerText = orig;
                emailBtn.style.backgroundColor = "";
                emailBtn.style.borderColor = "";
            }, 2200);
        }
    }).catch(err => {
        console.error('Failed to copy email:', err);
    });
}

// --- 9. SCROLL REVEAL OBSERVER ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Reveal top hero immediately
setTimeout(() => {
    const hero = document.getElementById('about');
    if (hero) hero.classList.add('active');
}, 60);
