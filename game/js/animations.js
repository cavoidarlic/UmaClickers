// animations.js - floating money/carat animations and small utilities
// particle limits to avoid too many DOM elements causing lag
window.PARTICLE_LIMIT = 60; // max concurrent particles
window.activeParticles = 0;

window.createFallingMoney = function(x, y, count = 1) {
    const gamePanel = document.querySelector('.game-panel');
    // clamp requested count to available particle slots
    const requested = Math.max(1, Math.floor(count));
    const available = Math.max(0, window.PARTICLE_LIMIT - window.activeParticles);
    const spawnCount = Math.min(requested, available);
    if (spawnCount <= 0) return 0;

    for (let i = 0; i < spawnCount; i++) {
        const img = document.createElement('img');
        img.src = 'assets/images/items/Monies.png';
        img.className = 'falling-money';
        img.style.left = x + 'px';
        img.style.top = y + 'px';
        img.style.transform = 'translate(-50%, -50%)';
        document.body.appendChild(img);
        window.activeParticles++;

        const vx = (Math.random() * 160 - 80);
        const vy = -(260 + Math.random() * 140);
        const gravity = 1200;

        let posX = x;
        let posY = y;
        let velX = vx;
        let velY = vy;
        let last = performance.now();

        const charRect = (document.getElementById('haruUrara') || {getBoundingClientRect:() => ({left:x, width:40, bottom:y})}).getBoundingClientRect();
        const side = Math.random() < 0.5 ? -1 : 1;
        const landingX = charRect.left + charRect.width / 2 + side * (20 + Math.random() * (charRect.width / 3));
        const landingY = charRect.bottom - 10;

        function step(now) {
            const dt = (now - last) / 1000;
            last = now;

            velY += gravity * dt;
            posX += velX * dt;
            posY += velY * dt;

            img.style.left = posX + 'px';
            img.style.top = posY + 'px';

            if (posY >= landingY) {
                img.style.transition = 'left 220ms ease-out, top 220ms ease-out, transform 220ms ease-out, opacity 400ms ease-out';
                img.style.left = landingX + 'px';
                img.style.top = landingY + 'px';
                img.style.transform = 'translate(-50%, 0) scale(0.95)';
                img.style.opacity = '0.95';
                setTimeout(() => { if (img.parentElement) img.parentElement.removeChild(img); window.activeParticles = Math.max(0, window.activeParticles - 1); }, 600);
                return;
            }

            requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }
    return spawnCount;
};

window.createFallingCarat = function(x, y) {
    // respect global particle cap
    if (window.activeParticles >= window.PARTICLE_LIMIT) return false;

    const img = document.createElement('img');
    img.src = 'assets/images/items/Carats.png';
    img.className = 'falling-money';
    img.style.left = x + 'px';
    img.style.top = y + 'px';
    img.style.transform = 'translate(-50%, -50%) scale(0.8)';
    document.body.appendChild(img);
    window.activeParticles++;

    const vx = (Math.random() * 120 - 60);
    const vy = -(220 + Math.random() * 120);
    const gravity = 1200;

    let posX = x;
    let posY = y;
    let velX = vx;
    let velY = vy;
    let last = performance.now();

    const charRect = (document.getElementById('haruUrara') || {getBoundingClientRect:() => ({left:x, width:40, bottom:y})}).getBoundingClientRect();
    const side = Math.random() < 0.5 ? -1 : 1;
    const landingX = charRect.left + charRect.width / 2 + side * (10 + Math.random() * (charRect.width / 4));
    const landingY = charRect.bottom - 6;

    function step(now) {
        const dt = (now - last) / 1000;
        last = now;

        velY += gravity * dt;
        posX += velX * dt;
        posY += velY * dt;

        img.style.left = posX + 'px';
        img.style.top = posY + 'px';

        if (posY >= landingY) {
            img.style.transition = 'left 180ms ease-out, top 180ms ease-out, transform 180ms ease-out, opacity 300ms ease-out';
            img.style.left = landingX + 'px';
            img.style.top = landingY + 'px';
            img.style.transform = 'translate(-50%, 0) scale(0.75)';
            img.style.opacity = '0.95';
            setTimeout(() => { if (img.parentElement) img.parentElement.removeChild(img); window.activeParticles = Math.max(0, window.activeParticles - 1); }, 500);
            return;
        }

        requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
    return true;
};

// small helper for updating display
window.updateDisplay = function() {
    const moneyEl = document.getElementById('moneyCount');
    const caratEl = document.getElementById('caratCount');
    if (moneyEl) moneyEl.textContent = Math.floor(window.gameState.money);
    if (caratEl) caratEl.textContent = Math.floor(window.gameState.carats);
};

// style injection for animations
(function injectAnimationStyle(){
    const style = document.createElement('style');
    style.textContent = `
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}
`;
    document.head.appendChild(style);
})();

// prevent images from being selected or dragged via CSS
(function injectDragPrevention(){
        const style = document.createElement('style');
        style.textContent = `
img {
    -webkit-user-drag: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.falling-money {
    pointer-events: none; /* allow clicks through particle images */
}
`;
        document.head.appendChild(style);
})();
