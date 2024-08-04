export class Navigation {
    constructor() {
        this.dateElements = document.querySelectorAll('.date-time');
        this.notificationCenter = document.querySelector('.notification-center');
    }

    init() {
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 30000);
        this.dateElements.forEach(element => {
            element.addEventListener('click', this.showNotificationCenter.bind(this));
        });
    }

    showNotificationCenter() {
        this.notificationCenter.style.display = 'block';
    }

    updateDateTime() {
        const now = new Date();
        const options = { hour: '2-digit', minute: '2-digit' };
        const formattedDateTime = now.toLocaleTimeString('fr-FR', options);

        // Mettez à jour le texte de chaque élément date-time
        this.dateElements.forEach(element => {
            element.textContent = formattedDateTime;
        });
    }
}
