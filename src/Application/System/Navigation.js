export class Navigation {
    constructor() {
        this.dateElements = document.querySelectorAll('.date-time');
        this.startBtn = document.querySelector('.start-btn');
        this.startMenu = document.querySelector('.start-menu');
        this.volumeController = document.querySelector('.volume-controller');
        this.volumeButton = document.querySelector('#volume');
        this.isMenuOpen = false;
    }

    init() {
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 30000);
        this.startBtn.addEventListener('click', this.toggleStartMenu.bind(this));
        document.addEventListener('click', this.handleDocumentClick.bind(this));
        this.volumeButton.addEventListener('click', this.toggleVolumeController.bind(this));
    }

    updateDateTime() {
        const now = new Date();
        const options = { hour: '2-digit', minute: '2-digit' };
        const formattedDateTime = now.toLocaleTimeString('fr-FR', options);

        this.dateElements.forEach(element => {
            element.textContent = formattedDateTime;
        });
    }

    toggleStartMenu(event) {
        event.stopPropagation();
        this.isMenuOpen = !this.isMenuOpen;
        this.startMenu.style.display = this.isMenuOpen ? 'flex' : 'none';
    }

    toggleVolumeController(event) {
        event.stopPropagation();

        if (this.volumeController) {
            const isVolumeVisible = this.volumeController.style.display === 'block';
            this.volumeController.style.display = isVolumeVisible ? 'none' : 'block';
        }
    }

    handleDocumentClick(event) {
        if (this.isMenuOpen && !this.startBtn.contains(event.target) && !this.startMenu.contains(event.target)) {
            this.startMenu.style.display = 'none';
            this.isMenuOpen = false;
        }
    }
}
