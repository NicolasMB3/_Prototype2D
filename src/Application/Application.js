import { Windows } from "./System/Windows.js";
import { shortcuts } from "../contents/paths/contents.js";
import { Desktop } from "./System/Desktop.js";
import { Dock } from "./System/Dock.js";

export default class Application {
    constructor() {
        this.windows = new Windows();
        this.desktop = new Desktop(this.windows);
        this.turnOffButton = document.getElementById('turnOffButton');

        this.startScreen = document.querySelector('.start');
        this.container = document.querySelector('.container');
        this.loadingScreen = document.querySelector('.loading-screen');
        this.loadingText = document.getElementById('loading-text');

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
        }, 3000000)
        // this.startComputer();
    }

    startComputer() {
        this.startScreen.style.display = 'none';
        this.showLoadingScreen();
    }

    showLoadingScreen() {
        const loadingMessages = [
            'Initialisation du système...',
            'Chargement des modules de base...',
            'Vérification de la mémoire...',
            'Connexion au réseau local...',
            'Téléchargement des dépendances...',
            'Téléchargement : [          ]',
            'Téléchargement : [*         ]',
            'Téléchargement : [**        ]',
            'Téléchargement : [***       ]',
            'Téléchargement : [****      ]',
            'Téléchargement : [*****     ]',
            'Téléchargement : [******    ]',
            'Téléchargement : [*******   ]',
            'Téléchargement : [********  ]',
            'Téléchargement : [********* ]',
            'Téléchargement : [**********]',
            'Téléchargement terminé.',
            'Configuration des paramètres du système...',
            'Initialisation des pilotes...',
            'Lancement des services de base...',
            'Lancement des services réseau...',
            'Vérification des mises à jour...',
            'Installation des mises à jour...',
            'Optimisation des performances...',
            'Démarrage des interfaces utilisateur...',
            'Chargement des préférences utilisateur...',
            'Préparation de l\'environnement de bureau...',
            'Finalisation du démarrage...'
        ];

        let index = 0;
        const intervalId = setInterval(() => {
            if (index < loadingMessages.length) {
                this.loadingText.textContent += loadingMessages[index] + '\n';
                index++;
            } else {
                clearInterval(intervalId);
                setTimeout(() => {
                    this.loadingScreen.style.display = 'none';
                    this.container.style.display = 'block';
                    this.container.classList.add('fade-out');
                    this.removeFadeOutClassAfterDelay();
                }, 500);
            }
        }, 200);
    }

    removeFadeOutClassAfterDelay() {
        setTimeout(() => {
            this.container.classList.remove('fade-out');
        }, 500);
    }

    setupTurnOffButton() {
        this.turnOffButton.addEventListener('click', () => {
            this.setupOffComputer();
            this.notifyParent();
        });
    }

    setupOffComputer() {
        document.body.classList.add('turn-off-animation');
        new Audio('./sounds/off.mp3').play().then(r => r).catch(e => e);
        setTimeout(() => {
            document.querySelectorAll('.crt-glitch').forEach(el => el.remove());
            document.body.classList.remove('fade-out');
            document.body.classList.remove('turn-off-animation');
            this.startScreen.style.display = 'flex';
            this.resetLoadingScreen();
        }, 550);
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
            this.desktop.createLN(shortcut.title, shortcut.path, shortcut.icon, shortcut.type);
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
