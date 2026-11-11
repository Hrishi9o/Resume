// ==========================================================================
// HRISHIKESH S SHETTY — PORTFOLIO INTERACTIONS & ADVANCED EFFECTS
// ==========================================================================

// --- 1. PROCEDURAL SOUND FX (WEB AUDIO API) ---
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

    playChime() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const now = this.ctx.currentTime;
        [1318.51, 1975.53].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.07);

            gain.gain.setValueAtTime(0.08, now + idx * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + idx * 0.07);
            osc.stop(now + idx * 0.07 + 0.4);
        });
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

// Sound FX Mute Toggle
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

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
const mobileDrawer = document.getElementById('mobile-drawer');
if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
        sfx.playClick();
        mobileDrawer.classList.toggle('open');
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileDrawer.classList.remove('open');
        });
    });
}

// --- 3. PROJECT FILTER TABS ---
const filterTabs = document.querySelectorAll('.filter-tab');
const projectCards = document.querySelectorAll('.project-card, .featured-showcase-card');

filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        sfx.playClick();
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const category = tab.getAttribute('data-filter');

        projectCards.forEach(card => {
            const cardCat = card.getAttribute('data-category');
            if (category === 'all' || cardCat === category || card.classList.contains(category)) {
                card.style.display = '';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// --- 4. CURSOR GLOW TRAILER & 3D PERSPECTIVE CARD TILT ---
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

// --- 5. PROCEDURAL CANVAS PARTICLES ---
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
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > w) this.vx *= -1;
            if (this.y < 0 || this.y > h) this.vy *= -1;

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
            ctx.fillStyle = isLight ? 'rgba(0, 180, 216, 0.45)' : 'rgba(0, 180, 216, 0.55)';
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

        // Interconnecting constellation lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    const alpha = 1 - (dist / 120);
                    ctx.strokeStyle = `rgba(0, 180, 216, ${alpha * 0.16})`;
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

// --- 6. DEVELOPER CLI TERMINAL WITH COMMAND HISTORY ---
const termInput = document.getElementById('term-input');
const termOutput = document.getElementById('term-output');
const cmdHistory = [];
let historyIndex = -1;

if (termInput && termOutput) {
    termInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = termInput.value.trim().toLowerCase();
            if (cmd) {
                cmdHistory.push(cmd);
                historyIndex = cmdHistory.length;
            }
            termInput.value = '';
            handleTermCommand(cmd);
        } else if (e.key === 'ArrowUp') {
            if (cmdHistory.length > 0 && historyIndex > 0) {
                historyIndex--;
                termInput.value = cmdHistory[historyIndex];
            }
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            if (historyIndex < cmdHistory.length - 1) {
                historyIndex++;
                termInput.value = cmdHistory[historyIndex];
            } else {
                historyIndex = cmdHistory.length;
                termInput.value = '';
            }
            e.preventDefault();
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
            printTermLine('  <span style="color: var(--primary);">about</span>      - Bio & academic standing at RIT');
            printTermLine('  <span style="color: var(--primary);">experience</span> - Work history at HPE & hackathons');
            printTermLine('  <span style="color: var(--primary);">projects</span>   - List all flagship projects and live URLs');
            printTermLine('  <span style="color: var(--primary);">skills</span>     - Core technical competencies');
            printTermLine('  <span style="color: var(--primary);">education</span>  - Academic background & distinctions');
            printTermLine('  <span style="color: var(--primary);">contact</span>    - Contact details & links');
            printTermLine('  <span style="color: var(--primary);">resume</span>     - Open ATS-optimized resume PDF');
            printTermLine('  <span style="color: var(--primary);">theme</span>      - Toggle dark/light theme');
            printTermLine('  <span style="color: var(--primary);">clear</span>      - Clear terminal history');
            printTermLine('  <span style="color: var(--primary);">sudo</span>       - Run superuser command');
            break;

        case 'about':
            printTermLine('🎓 <strong>Hrishikesh S Shetty:</strong> Information Science Engineering undergraduate at Ramaiah Institute of Technology, Bangalore (9.53 CGPA) & Intern at Hewlett Packard Enterprise (HPE).');
            printTermLine('⭐ <strong>Academic Standing:</strong> 9.53 CGPA (Top Performer in ISE @ RIT).');
            printTermLine('🏆 <strong>Honors:</strong> Finalist in BLACKBOX AI Hackathon 2026, Google x DeepStation Hackathon participant.');
            break;

        case 'experience':
            printTermLine('💼 <strong>Hewlett Packard Enterprise (HPE):</strong> CPP2 Intern (July 2026 – Present, Bangalore) — Enterprise SDLC & edge-to-cloud architecture.');
            printTermLine('🚀 <strong>Google x DeepStation Hackathon:</strong> May 2026 — Dept. of CSE (AI&ML / Cyber Security) @ MSRIT.');
            printTermLine('🏆 <strong>BLACKBOX AI Hackathon:</strong> Finalist at RIT TechFest 2026.');
            break;

        case 'projects':
            printTermLine('1. ☕ <strong>Get-Me-Chai:</strong> Creator Crowdfunding Platform (Next.js 14, Razorpay HMAC, MongoDB Atlas, NextAuth).');
            printTermLine('   Live: <a href="https://get-me-chai-tawny-five.vercel.app/" target="_blank" style="color: var(--primary);">https://get-me-chai-tawny-five.vercel.app/</a>');
            printTermLine('2. 🛡️ <strong>SurakshaSetu:</strong> Digital Identity & Trust Management System (Java, 15-Table Normalized PostgreSQL, JDBC, Multithreading, RBAC).');
            printTermLine('   Docs: Verified on ATS Resume PDF & GitHub (<a href="Hrishi.pdf" target="_blank" style="color: var(--primary);">Hrishi.pdf</a>)');
            printTermLine('3. 🎵 <strong>Spotify Clone:</strong> Web Audio streaming player with seekbar scrubbing & queue management.');
            printTermLine('   Live: <a href="https://spotify-pi-six-14.vercel.app/" target="_blank" style="color: var(--primary);">https://spotify-pi-six-14.vercel.app/</a>');
            printTermLine('4. 🐦 <strong>Twitter Clone:</strong> Pixel-perfect responsive Tailwind UI.');
            printTermLine('   Live: <a href="https://twitter-red.vercel.app/" target="_blank" style="color: var(--primary);">https://twitter-red.vercel.app/</a>');
            break;

        case 'skills':
            printTermLine('💻 <strong>Languages:</strong> Java, JavaScript (ES6+), TypeScript, C/C++, SQL, HTML5, CSS3');
            printTermLine('🌐 <strong>Frameworks:</strong> Next.js 14, React.js 18, Node.js, Express.js, Java Swing GUI, Tailwind CSS');
            printTermLine('🗄️ <strong>Databases & Systems:</strong> PostgreSQL (15-table 3NF), MongoDB Atlas, Mongoose, JDBC, ACID Transactions');
            printTermLine('🔐 <strong>Tools & Security:</strong> Razorpay API, NextAuth.js (OAuth 2.0), RBAC, Rolling-Hash Security, Multithreading, Git & GitHub');
            break;

        case 'education':
            printTermLine('🏫 <strong>Ramaiah Institute of Technology:</strong> B.E. in Information Science & Engg (2024–2028) | CGPA: 9.53');
            printTermLine('🏫 <strong>Jnana Sudha PU College:</strong> Class XII PCMB (2022–2024) | Aggregate: 97.83%');
            printTermLine('🏫 <strong>Don Bosco School:</strong> Class X (2022) | Aggregate: 90.8%');
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
            printTermLine('Visual theme toggled.');
            break;

        case 'clear':
            if (termOutput) termOutput.innerHTML = '';
            break;

        case 'sudo':
            printTermLine('User is not in the sudoers file. This incident will be reported to Hrishikesh. 😉', 'text-spotify');
            break;

        default:
            printTermLine(`Command not found: "${escapeHTML(cmd)}". Type <span style="color: var(--primary);">help</span> for available commands.`);
    }
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

// --- 7. COPY EMAIL CLIPBOARD HANDLER ---
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

// --- 8. SCROLL REVEAL OBSERVER ---
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
