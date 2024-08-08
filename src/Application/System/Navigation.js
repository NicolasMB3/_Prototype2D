export class Navigation {
    constructor() {
        this.dateElements = document.querySelectorAll('.date-time');
        this.notificationCenter = document.querySelector('.notification-center');
        this.startBtn = document.querySelector('.start-btn');
        this.startMenu = document.querySelector('.start-menu');
        this.isMenuOpen = false;
    }

    init() {
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 30000);
        this.dateElements.forEach(element => {
            element.addEventListener('click', this.showNotificationCenter.bind(this));
        });
        this.startBtn.addEventListener('click', this.toggleStartMenu.bind(this));
        document.addEventListener('click', this.handleDocumentClick.bind(this));
    }

    showNotificationCenter() {
        this.notificationCenter.style.display = 'block';
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

    handleDocumentClick(event) {
        if (this.isMenuOpen && !this.startBtn.contains(event.target) && !this.startMenu.contains(event.target)) {
            this.startMenu.style.display = 'none';
            this.isMenuOpen = false;
        }
    }
}



// <!--    <div class="switch-controller">-->
// <!--      <button id="turnOffButton">Turn Off</button>-->
// <!--      <img id="volume" src="/images/volume.svg" alt="Image de fermeture">-->
// <!--      <img id="power" src="/images/power.svg" alt="Image de fermeture">-->
// <!--    </div>-->