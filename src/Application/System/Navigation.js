export class Navigation {
    constructor() {
        this.dateElement = document.querySelector('.navigation .date-time');
        this.notificationCenter = document.querySelector('.notification-center');
    }

    init() {
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 30000);
        this.dateElement.addEventListener('click', this.showNotificationCenter.bind(this));
    }

    showNotificationCenter() {
        this.notificationCenter.style.display = 'block';
    }

    updateDateTime() {
        const now = new Date();
        const options = { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' };
        const dateTimeElement = document.querySelector('.navigation .date-time');
        let formattedDateTime = now.toLocaleDateString('fr-FR', options);

        formattedDateTime = formattedDateTime.replace('à', ' ');
        dateTimeElement.textContent = formattedDateTime;
    }
}