export class BootUP {
    constructor(loadingScreen, loadingText, container) {
        this.loadingScreen = loadingScreen;
        this.loadingText = loadingText;
        this.container = container;
    }

    start() {
        this.showLoadingScreen();
    }

    async showLoadingScreen() {

        const loadingMessages = [
            'Initialisation du système...\n',
            'Chargement des modules de base...\n',
            'Vérification de la mémoire...\n',
            'Connexion au réseau local...\n',
            'Vérification du matériel...\n',
            'Chargement des périphériques...\n',
            'Configuration du BIOS...\n'
        ];

        const finalMessages = [
            'Téléchargement terminé.\n',
            'Configuration des paramètres du système...\n',
            'Initialisation des pilotes...\n',
            'Lancement des services de base...\n',
            'Lancement des services réseau...\n',
            'Vérification des mises à jour...\n',
            'Installation des mises à jour...\n',
            'Optimisation des performances...\n',
            'Démarrage des interfaces utilisateur...\n',
            'Chargement des préférences utilisateur...\n',
            'Préparation de l\'environnement de bureau...\n',
            'Finalisation du démarrage...\n'
        ];

        await this.typeMessages(loadingMessages, 5);
        await this.simulateDownload();
        await this.typeMessages(finalMessages, 5);
        document.body.classList.remove('fade-out');

        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
            this.container.style.display = 'block';
            this.container.classList.add('fade-out');
            this.removeFadeOutClassAfterDelay();
            setTimeout(() => {
                const welcome = new Audio('./sounds/welcome.mp3');
                welcome.volume = 0.07;
                welcome.play();
            }, 500);
        }, 500);
    }

    async typeMessages(messages, delay) {
        for (let messageIndex = 0; messageIndex < messages.length; messageIndex++) {
            const message = messages[messageIndex];

            if (messageIndex > 0 && Math.random() > 1.5) {
                this.loadingText.textContent += '\n';
            }

            for (let charIndex = 0; charIndex < message.length; charIndex++) {
                this.loadingText.textContent += message[charIndex];
                await this.sleep(delay);
            }

            if (Math.random() > 0.7) {
                await this.sleep(Math.random() * 200 + 100);
            }

            if (Math.random() < 0.02 && messageIndex < messages.length - 1) {
                await this.injectErrorMessage();
            }
        }
    }

    injectErrorMessage() {
        return new Promise(resolve => {
            const errorMessage = 'Erreur critique : Échec de l\'initialisation du module X\n';
            const errorElement = document.createElement('span');
            errorElement.textContent = errorMessage;
            errorElement.style.color = 'red';
            this.loadingText.appendChild(errorElement);

            setTimeout(() => {
                this.loadingText.removeChild(errorElement);
                const resolveMessage = 'Résolution de l\'erreur : Module X réinitialisé\n';
                this.loadingText.textContent += resolveMessage;
                resolve();
            }, Math.random() * 2000 + 1000);
        });
    }

    simulateDownload() {
        return new Promise(resolve => {
            const downloadMessage = 'Téléchargement : ';
            let progressBar = '[          ]\n';
            this.loadingText.textContent += downloadMessage + progressBar;

            let progress = 0;
            const intervalId = setInterval(() => {
                if (progress < 10) {
                    const randomDelay = Math.random() * 200 + 100;
                    setTimeout(() => {
                        progress++;
                        progressBar = '[' + '*'.repeat(progress) + ' '.repeat(10 - progress) + ']\n';
                        this.loadingText.textContent = this.loadingText.textContent.slice(0, -13) + progressBar;
                    }, randomDelay);
                } else {
                    clearInterval(intervalId);
                    resolve();
                }
            }, 500);
        });
    }

    removeFadeOutClassAfterDelay() {
        setTimeout(() => {
            this.container.classList.remove('fade-out');
        }, 500);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}