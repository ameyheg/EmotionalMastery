/**
 * Emotional Mastery - 10x Executive Leadership UI
 * Premium interactions, scroll reveals, and 3D effects.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Icons
    lucide.createIcons();

    // 2. Custom Cursor Glow
    const cursor = document.getElementById('cursor-glow');
    if (cursor && window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            });
        });

        // Interactive cursor state
        const interactables = document.querySelectorAll('a, button, .tilt-element');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.style.transform += ' scale(1.5)');
            el.addEventListener('mouseleave', () => cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', ''));
        });
    } else if (cursor) {
        cursor.style.display = 'none'; // Disable on mobile
    }

    // 3. Navbar Scrolled State
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 4. Smooth Scrolling & Active State
    document.querySelectorAll('.nav-links a[href^="#"], .hero-actions a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 5. Scroll Reveal Engine (Framer Motion equivalent)
    const revealElements = document.querySelectorAll('.reveal');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Trigger counter animation if it exists inside
                const counters = entry.target.querySelectorAll('.count-up');
                counters.forEach(counter => animateCounter(counter));

                // Optional: stop observing once revealed
                // observer.unobserve(entry.target); 
            }
        });
    };

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    revealElements.forEach(el => revealObserver.observe(el));

    // 6. Animated Number Counters
    function animateCounter(el) {
        if (el.classList.contains('counted')) return;
        el.classList.add('counted');

        const target = parseFloat(el.getAttribute('data-target'));
        const suffixHTML = el.querySelector('span') ? `<span>${el.querySelector('span').innerText}</span>` : '';
        const duration = 2000; // ms
        const steps = 60;
        const stepTime = Math.abs(Math.floor(duration / steps));

        // Determine precision (decimals)
        const isDecimal = target % 1 !== 0;

        let current = 0;
        const increment = target / steps;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.innerHTML = (isDecimal ? target.toFixed(1) : target) + suffixHTML;
                clearInterval(timer);
            } else {
                el.innerHTML = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffixHTML;
            }
        }, stepTime);
    }

    // 7. Vanilla Tilt Initialization for 3D Cards
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".tilt-element"), {
            max: 10,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
            transition: true
        });
    }

    // 8. Terminal Typing Effect
    const typingLines = document.querySelectorAll('.typing-line');
    const terminalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'none'; // reset
                setTimeout(() => {
                    entry.target.style.animation = ''; // trigger reflow
                    entry.target.style.opacity = '1';
                }, 10);
            }
        });
    }, { threshold: 0.5 });

    typingLines.forEach(line => terminalObserver.observe(document.querySelector('.terminal-window')));

    // 9. 10x Magnetic Button Interactions
    const magnets = document.querySelectorAll('.btn');
    magnets.forEach(magnet => {
        magnet.addEventListener('mousemove', function (e) {
            const position = magnet.getBoundingClientRect();
            const x = e.clientX - position.left - position.width / 2;
            const y = e.clientY - position.top - position.height / 2;

            // Apply physics: pull the button towards the cursor
            magnet.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;

            // Also shift the pseudo element glow slightly
            const icon = magnet.querySelector('i');
            if (icon) {
                icon.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            }
        });

        magnet.addEventListener('mouseout', function () {
            magnet.style.transform = 'translate(0px, 0px)';
            const icon = magnet.querySelector('i');
            if (icon) {
                icon.style.transform = 'translate(0px, 0px)';
            }
        });
    });

    // 10. Ultimate 10x Neural Network Canvas Particle System
    const canvas = document.getElementById('neural-net');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        // Settings
        const properties = {
            particleColor: 'rgba(59, 130, 246, 0.4)',
            lineColor: 'rgba(59, 130, 246, 0.15)',
            particleAmount: 60,
            defaultRadius: 1.5,
            variantRadius: 2,
            defaultSpeed: 0.3,
            variantSpeed: 0.3,
            linkRadius: 150, // Distance to link particles
            mouseRadius: 200 // Distance mouse attracts particles
        };

        let mouse = { x: -1000, y: -1000 };

        function initCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            particles = [];
            for (let i = 0; i < properties.particleAmount; i++) {
                particles.push(new Particle());
            }
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.speed = properties.defaultSpeed + Math.random() * properties.variantSpeed;
                this.directionAngle = Math.floor(Math.random() * 360);
                this.color = properties.particleColor;
                this.radius = properties.defaultRadius + Math.random() * properties.variantRadius;
                this.vector = {
                    x: Math.cos(this.directionAngle) * this.speed,
                    y: Math.sin(this.directionAngle) * this.speed
                };
            }
            update() {
                this.border();
                this.x += this.vector.x;
                this.y += this.vector.y;
            }
            border() {
                if (this.x >= width || this.x <= 0) this.vector.x *= -1;
                if (this.y >= height || this.y <= 0) this.vector.y *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        function drawLines() {
            let x1, y1, x2, y2, x3, y3, length, mouseLength, opacity;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    x1 = particles[i].x;
                    y1 = particles[i].y;
                    x2 = particles[j].x;
                    y2 = particles[j].y;
                    length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

                    if (length < properties.linkRadius) {
                        opacity = 1 - length / properties.linkRadius;
                        ctx.lineWidth = 0.5;
                        ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.3})`;
                        ctx.beginPath();
                        ctx.moveTo(x1, y1);
                        ctx.lineTo(x2, y2);
                        ctx.closePath();
                        ctx.stroke();
                    }
                }

                // Mouse Interaction Links
                x3 = mouse.x;
                y3 = mouse.y;
                mouseLength = Math.sqrt(Math.pow(x3 - x1, 2) + Math.pow(y3 - y1, 2));

                if (mouseLength < properties.mouseRadius) {
                    opacity = 1 - mouseLength / properties.mouseRadius;
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.8})`; // Purple link near mouse
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x3, y3);
                    ctx.closePath();
                    ctx.stroke();

                    // slight attraction to mouse
                    particles[i].x -= (x1 - x3) * 0.01;
                    particles[i].y -= (y1 - y3) * 0.01;
                }
            }
        }

        function loop() {
            requestAnimationFrame(loop);
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            drawLines();
        }

        document.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('resize', initCanvas);
        initCanvas();
        loop();
    }
});
