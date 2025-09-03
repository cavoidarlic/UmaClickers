// animations.js - floating money/carat animations and small utilities

window.createFallingMoney = function(x, y, count = 1) {
    const gamePanel = document.querySelector('.game-panel');

    for (let i = 0; i < Math.max(1, count); i++) {
        const img = document.createElement('img');
        img.src = 'assets/images/items/Monies.png';
        img.className = 'falling-money';
        img.style.left = x + 'px';
        img.style.top = y + 'px';
        img.style.transform = 'translate(-50%, -50%)';
        document.body.appendChild(img);

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
                setTimeout(() => { if (img.parentElement) img.parentElement.removeChild(img); }, 600);
                return;
            }

            requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }
};

window.createFallingCarat = function(x, y) {
    const img = document.createElement('img');
    img.src = 'assets/images/items/Carats.png';
    img.className = 'falling-money';
    img.style.left = x + 'px';
    img.style.top = y + 'px';
    img.style.transform = 'translate(-50%, -50%) scale(0.8)';
    document.body.appendChild(img);

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
            setTimeout(() => { if (img.parentElement) img.parentElement.removeChild(img); }, 500);
            return;
        }

        requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
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
