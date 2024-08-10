import { Windows } from "./System/Windows.js";
import { shortcuts } from "../contents/paths/contents.js";
import { Desktop } from "./System/Desktop.js";
import { Dock } from "./System/Dock.js";
import { BootUP } from "./Controls/BootUP.js";
import { Navigation } from "./System/Navigation.js";

export default class Application {
    constructor() {
        this.windows = new Windows();
        this.classNavigation = new Navigation().init();
        this.desktop = new Desktop(this.windows);
        this.turnOffButton = document.getElementById('turnOffButton');

        this.startScreen = document.querySelector('.start');
        this.container = document.querySelector('.container');
        this.loadingScreen = document.querySelector('.loading-screen');
        this.loadingText = document.getElementById('loading-text');

        this.bootup = new BootUP(this.loadingScreen, this.loadingText, this.container);

        this.setupHoverEffect();

        this.init();
    }

    init() {
        this.setupGlitchEffect();
        this.setupMessageListener();
        this.setupTurnOffButton();
        this.initializeShortcuts();
    }

    setupGlitchEffect() {
        const glitchEffect = () => {
            const glitchLine = document.createElement('div');
            glitchLine.className = 'crt-glitch';
            document.body.appendChild(glitchLine);

            setTimeout(() => {
                glitchLine.remove();
            }, 8000);
        };

        setInterval(glitchEffect, Math.random() * 6000 + 10000);
    }

    setupMessageListener() {
        window.addEventListener('message', (event) => {
            if (event.data === 'startPlaneClicked') {
                this.startComputer();
            } else if (event.data === 'stopPlaneClicked') {
                this.setupOffComputer();
            }
        }, false);
        document.querySelector('#startW95').addEventListener('click', () => {
            this.startComputer();
        });
        document.querySelector('#main-start').addEventListener('click', () => {
            this.startComputer();
        });
        setTimeout(() => {
            this.startComputer();
            window.parent.postMessage('startPlaneClicked', '*');
        }, 3000000);
        // this.startComputer();
    }

    startComputer() {
        document.body.style.backgroundImage = 'linear-gradient(to right bottom, #008080, #007979, #007272, #006c6c, #006565)';
        this.startScreen.style.display = 'none';
        this.bootup.start();
    }

    setupTurnOffButton() {
        this.turnOffButton.addEventListener('click', () => {
            this.setupOffComputer();
            this.notifyParent();
        });
    }

    setupOffComputer() {
        const codeContainer = document.getElementById('code-container');

        document.body.style.backgroundImage = 'linear-gradient(to right bottom, #131313, #1b1b1b, #232323, #2b2b2c, #343334)';

        document.body.classList.add('code-animation');
        codeContainer.style.display = 'flex';

        setTimeout(() => {
            codeContainer.style.display = 'none';
            document.body.classList.remove('code-animation');
            this.triggerTurnOffAnimation();
        }, 4000);
    }

    triggerTurnOffAnimation() {
        const scanline = document.createElement('div');
        scanline.classList.add('scanline');
        document.body.appendChild(scanline);

        document.body.classList.add('turn-off-animation');
        new Audio('./sounds/off.mp3').play().then(r => r).catch(e => e);

        setTimeout(() => {
            document.querySelectorAll('.crt-glitch').forEach(el => el.remove());
            document.body.classList.remove('fade-out');
            document.body.classList.remove('turn-off-animation');
            this.startScreen.style.display = 'flex';
            this.resetLoadingScreen();
            scanline.remove();
        }, 1500);
    }


    notifyParent() {
        window.parent.postMessage('stopPlaneClicked', '*');
    }

    resetLoadingScreen() {
        this.loadingText.textContent = '';
        this.loadingScreen.style.display = 'block';
    }

    initializeShortcuts() {
        shortcuts.forEach(shortcut => {
            const dock = new Dock(shortcut, shortcut.path, this.windows);
            dock.createDockElement();
            this.desktop.createLN(shortcut.title, shortcut.path, shortcut.icon, shortcut.type, shortcut.text1, shortcut.text2);
        });
    }

    setupHoverEffect() {
        const buttons = document.querySelectorAll('.menu-button');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.clearArrow();
                button.textContent = '-> ' + button.textContent.trim();
                button.classList.add('active');
            });
        });
    }

    clearArrow() {
        const buttons = document.querySelectorAll('.menu-button');
        buttons.forEach(button => {
            if (button.textContent.startsWith('-> ')) {
                button.textContent = button.textContent.substring(3);
                button.classList.remove('active');
            }
        });
    }
}