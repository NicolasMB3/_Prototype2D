export const params2 = (className) => {

    const keys = JSON.parse(localStorage.getItem('keys')) || {
        up: 'ArrowUp',
        down: 'ArrowDown',
        left: 'ArrowLeft',
        right: 'ArrowRight'
    };

    const snakeColor = localStorage.getItem('snakeColor') || '#38B35E';

    const keySymbols = {
        ArrowUp: '↑',
        ArrowDown: '↓',
        ArrowLeft: '←',
        ArrowRight: '→'
    };

    const upSymbol = keySymbols[keys.up] || keys.up;
    const downSymbol = keySymbols[keys.down] || keys.down;
    const leftSymbol = keySymbols[keys.left] || keys.left;
    const rightSymbol = keySymbols[keys.right] || keys.right;

    const pauseKey = localStorage.getItem('pauseKey') || 'p';
    const pauseSymbol = keySymbols[pauseKey] || pauseKey;

    return `
        <div id="param2_content" class="${className}">
            <div class="param-header">
                <img src="./images/pacman.png" alt="Snake Icon">
                <h2>Paramètres du jeu Snake</h2>
            </div>
            <p class="controller-text">Personnalisez les <span class="bold">touches</span> du serpent.</p>
            <div class="map-container">
                <div class="key-label"></div>
                <div class="key-input toucheH" id="up-key" tabindex="0">${upSymbol}</div>
                <div class="key-label"></div>
                <div class="key-input toucheG" id="left-key" tabindex="0">${leftSymbol}</div>
                <div class="key-input toucheB" id="down-key" tabindex="0">${downSymbol}</div>
                <div class="key-input toucheD" id="right-key" tabindex="0">${rightSymbol}</div>
            </div>
            <div class="pause-container">
                <span class="pause-label">Personnalisez la touche <span class="bold">Pause</span>.</span>
                <div class="key-input toucheP" id="pause-key" tabindex="0">${pauseSymbol}</div>
            </div>
            <div class="color-container">
                <label for="snake-color">Personnalisez la <span class="bold">couleur</span> du serpent.</label>
                <input type="color" id="snake-color" name="snake-color" value="${snakeColor}" class="color-picker">
            </div>
        </div>
    `;
}