export class Dock {
    constructor(shortcut, content, windows) {
        this.shortcut = shortcut;
        this.content = content;
        this.windows = windows;
    }

    createDockElement() {
        if (this.shortcut.showInDock) {
            const dockContent = document.querySelector('.dock_content');
            const dockIconDiv = document.createElement('div');
            const dockIconImg = document.createElement('img');

            dockIconImg.className = `items_dock`;
            dockIconImg.src = this.shortcut.icon;
            dockIconImg.alt = `Image de ${this.shortcut.title}`;
            dockIconDiv.appendChild(dockIconImg);
            dockContent.appendChild(dockIconDiv);

            dockIconDiv.addEventListener('click', () => {
                this.windows.createNewWindow('center', this.shortcut.icon, this.shortcut.title, this.content, true);
            });
        }
    }
}