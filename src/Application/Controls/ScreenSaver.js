export class DVDLogoScreensaver {
    static instance = null; // Variable statique pour conserver l'unique instance

    constructor() {
        if (DVDLogoScreensaver.instance) {
            return DVDLogoScreensaver.instance;
        }

        this.logoWidth = 250;       // Largeur du logo
        this.logoHeight = 160;      // Hauteur du logo
        this.vx = 1.4;              // Vitesse en x
        this.vy = 1.4;              // Vitesse en y
        this.logo = null;
        this.screensaver = null;
        this.animationFrame = null;

        DVDLogoScreensaver.instance = this; // Sauvegarder l'instance dans la variable statique
    }

    createScreensaver() {
        if (!this.screensaver) {
            this.screensaver = document.createElement('div');
            this.screensaver.style.position = 'fixed';
            this.screensaver.style.top = '0';
            this.screensaver.style.left = '0';
            this.screensaver.style.width = '100vw';
            this.screensaver.style.height = '100vh';
            this.screensaver.style.backgroundColor = 'black';
            this.screensaver.style.overflow = 'hidden';
            this.screensaver.style.display = 'flex';
            this.screensaver.style.alignItems = 'center';
            this.screensaver.style.justifyContent = 'center';
            this.screensaver.style.zIndex = '9999';

            this.logo = document.createElement('img');
            this.logo.src = './images/EPAlogo.png';
            this.logo.style.position = 'absolute';
            this.logo.style.width = `${this.logoWidth}px`;

            this.screensaver.appendChild(this.logo);

            document.body.appendChild(this.screensaver);

            this.x = Math.random() * (window.innerWidth - this.logoWidth);
            this.y = Math.random() * (window.innerHeight - this.logoHeight);

            this.moveLogo();
        }
    }

    moveLogo() {

        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        const animate = () => {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x <= 0 || this.x >= window.innerWidth - this.logoWidth) {
                this.vx *= -1;
            }

            if (this.y <= 0 || this.y >= window.innerHeight - this.logoHeight) {
                this.vy *= -1;
            }

            this.logo.style.left = `${this.x}px`;
            this.logo.style.top = `${this.y}px`;
            this.animationFrame = requestAnimationFrame(animate);
        };

        animate();
    }

    show() {
        this.createScreensaver();
        if (this.screensaver) {
            this.screensaver.style.display = 'flex';
            this.moveLogo();
        }
    }

    hide() {
        if(this.screensaver) {
            this.screensaver.remove();
            cancelAnimationFrame(this.animationFrame);
            this.screensaver = null;
            this.animationFrame = null;
        }
    }
}