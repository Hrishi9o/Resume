// --- 1. THEME TOGGLE LOGIC ---
const themeBtn = document.getElementById('theme-toggle');
const body = document.body;
const icon = themeBtn.querySelector('i');

// Check local storage for saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.replace('dark-mode', 'light-mode');
    icon.classList.replace('fa-moon', 'fa-sun');
}

themeBtn.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
        body.classList.replace('dark-mode', 'light-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.replace('light-mode', 'dark-mode');
        icon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'dark');
    }
});

// --- 2. 3D TILT & SPOTLIGHT EFFECT ---
document.querySelectorAll('.bento-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        // Spotlight calculation
        const rect = card.getBoundingClientRect(),
              x = e.clientX - rect.left,
              y = e.clientY - rect.top;
        
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);

        // 3D Tilt calculation (subtle effect on desktop)
        if (window.innerWidth > 768) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -3.5; // Max rotation 3.5deg
            const rotateY = ((x - centerX) / centerX) * 3.5;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        }
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) translateY(0)`;
    });
});

// --- 3. DYNAMIC CANVAS NETWORK BACKGROUND ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;
const particles = [];

// Handle Resize
window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
});

class Particle {
    constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;
    }
    draw(color) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }
}

// Initialize particles
for (let i = 0; i < 65; i++) particles.push(new Particle());

function animate() {
    ctx.clearRect(0, 0, w, h);
    
    const isLight = body.classList.contains('light-mode');
    const pColor = isLight ? 'rgba(0, 180, 216, 0.45)' : 'rgba(0, 180, 216, 0.55)';
    
    particles.forEach(p => {
        p.update();
        p.draw(pColor);
    });

    // Draw connecting lines between particles
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 125) {
                ctx.beginPath();
                const alpha = 1 - (dist / 125);
                ctx.strokeStyle = isLight 
                    ? `rgba(0, 180, 216, ${alpha * 0.25})` 
                    : `rgba(0, 180, 216, ${alpha * 0.18})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}
animate();

// --- 4. SCROLL REVEAL ANIMATIONS ---
const observerOptions = { threshold: 0.08, rootMargin: "0px 0px -40px 0px" };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            const staggerItems = entry.target.querySelectorAll('.stagger-item');
            if (staggerItems.length > 0) {
                staggerItems.forEach((item, index) => {
                    setTimeout(() => item.classList.add('active'), index * 120);
                });
            }
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Trigger reveal for top hero element on load
setTimeout(() => {
    const hero = document.getElementById('about');
    if (hero) {
        hero.classList.add('active');
        hero.querySelectorAll('.stagger-item').forEach((item, index) => {
            setTimeout(() => item.classList.add('active'), index * 120);
        });
    }
}, 80);

// --- 5. COPY EMAIL TO CLIPBOARD ---
function copyEmail() {
    const email = "hrishikeshshetty9o@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
        const emailText = document.getElementById("email-text");
        const emailBtn = document.getElementById("email-btn");
        
        const originalText = emailText.innerText;
        emailText.innerText = "Copied!";
        emailBtn.style.backgroundColor = "#10b981";
        emailBtn.style.borderColor = "#10b981";
        
        setTimeout(() => {
            emailText.innerText = originalText;
            emailBtn.style.backgroundColor = ""; 
            emailBtn.style.borderColor = "";
        }, 2200);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}
