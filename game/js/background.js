function setBackgroundByTime() {
    const now = new Date();
    const hour = now.getHours();
    const gamePanel = document.querySelector('.game-panel');
    
    let backgroundImage;
    
    if (hour >= 3 && hour < 6) {
        backgroundImage = 'assets/images/background/academy early morning.png';
    } else if (hour >= 6 && hour < 16) {
        backgroundImage = 'assets/images/background/academy day.png';
    } else if (hour >= 16 && hour < 19) {
        backgroundImage = 'assets/images/background/academy noon.png';
    } else {
        backgroundImage = 'assets/images/background/academy night.png';
    }
    
    if (gamePanel) gamePanel.style.backgroundImage = `url('${backgroundImage}')`;
    console.log(`Current time: ${hour}:${now.getMinutes()}, Background: ${backgroundImage}`);
}

window.startBackgroundAutoUpdate = function() {
    setBackgroundByTime();
    setInterval(setBackgroundByTime, 60000);
};
