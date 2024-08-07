import { Snake } from "../Games/Snake.js";
import { Doom } from "../Games/Doom.js";
import { hierarchy } from "../Controls/Hierarchy.js";
import {Pacman} from "../Games/Pacman.js";

export class Desktop {

    constructor(windows) {
        this.windows = windows;
        this.selectedFolders = [];
        this.originalPositions = {};
        this.content = {};
        this.isSelecting = false;
        this.selectionBox = null;
        this.gridSize = 90;
        this.gap = 10;
        this.startX = 0;
        this.startY = 0;
        this.iconSize = 42;
        this.draggedFolderName = null;
        this.windowsArea = document.querySelector('.windows_area');
        this.navigation = document.querySelector('.navigation');
        this.grid = this.createGrid();
        this.hierarchy = new hierarchy(this);
        this.snakeGameCounter = 0;
        this.doomGameCounter = 0;
        this.pacmanGameCounter = 0;
        this.setLocalStorageKeys();
        this.init();
    }

    init() {
        this.windowsArea.addEventListener('mousedown', (e) => {
            this.removeSelection(e);
            this.startSelection(e);
        });
        this.windowsArea.addEventListener('mousemove', (e) => this.updateSelection(e));
        this.windowsArea.addEventListener('mouseup', (e) => this.endSelection(e));
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));

        this.launchSnakeOnWindowOpen();
        this.setupDragAndDrop();
    }

    createLN(folderName, contentFunction, icon, type, texDesc1, texDesc2) {
        const folderElement = this.createFolderElement(folderName, icon, type);
        this.setFolderPosition(folderElement);
        this.addDragEvents(folderElement, folderName);
        this.content[folderName] = contentFunction;
        if (folderName === 'Poubelle') {
            this.addDoubleClickEventTrash(folderElement, folderName, contentFunction, icon, texDesc1, texDesc2);
            this.addContextMenuEvent(folderElement);
            folderElement.addEventListener('drop', (e) => this.hierarchy.onTrashDrop(e));
            document.addEventListener('trashUpdated', () => {
                this.hierarchy.updateTrashWindowContent();
            });
        } else {
            this.addDoubleClickEvent(folderElement, folderName, contentFunction, icon, texDesc1, texDesc2);
        }
        document.querySelector('.windows_area').appendChild(folderElement);
        this.hierarchy.moveToTrash(folderElement);
    }

    createFolderElement(folderName, icon, type) {
        const folderElement = document.createElement('div');
        const folderIcon = document.createElement('img');
        const folderTitle = document.createElement('div');

        folderElement.classList.add('desktop-folder', 'block_highlights');
        folderElement.dataset.name = folderName;
        folderElement.dataset.type = type;
        folderElement.childrenFolders = {};

        folderIcon.src = icon;
        folderIcon.alt = folderName;
        folderIcon.style.width = `${this.iconSize}px`;
        folderIcon.style.height = `${this.iconSize}px`;
        folderElement.appendChild(folderIcon);

        folderTitle.textContent = folderName;
        folderElement.appendChild(folderTitle);

        return folderElement;
    }

    addDoubleClickEvent(folderElement, folderName, contentFunction, icon, textDesc1, textDesc2) {
        folderElement.addEventListener('dblclick', () => {
            folderElement.childrenFolders = folderElement.childrenFolders || {};
            if (folderElement.dataset.type === 'folder' || folderElement.dataset.type === 'game') {
                const childFolders = Object.values(folderElement.childrenFolders);
                if (childFolders.length > 0) {
                    let folderContent = '';
                    childFolders.forEach(childFolder => {
                        const childFolderElement = this.createFolderElement(childFolder.dataset.name, childFolder.querySelector('img').src, childFolder.dataset.type);
                        folderContent += childFolderElement.outerHTML;
                    });
                    const childWindow = this.windows.createNewWindow("center", icon, folderName, folderContent, textDesc1, textDesc2);
                    childFolders.forEach((childFolder, index) => {
                        const childFolderElementInWindow = childWindow.querySelector(`.desktop-folder:nth-child(${index + 1})`);
                        this.addDoubleClickEvent(childFolderElementInWindow, childFolderElementInWindow.dataset.name, this.content[childFolderElementInWindow.dataset.name], 'icon_du_dossier');
                    });
                } else {
                    let content;
                    if (typeof contentFunction === 'function') {
                        content = contentFunction();
                    } else {
                        content = contentFunction;
                    }
                    this.windows.createNewWindow("center", icon, folderName, content, textDesc1, textDesc2);
                }
            } else {
                let content;
                if (typeof contentFunction === 'function') {
                    content = contentFunction();
                } else {
                    content = contentFunction;
                }
                this.windows.createNewWindow("center", icon, folderName, content, textDesc1, textDesc2);
            }
        });
    }

    addDoubleClickEventTrash(folderElement, folderName, content, icon, textDesc1, textDesc2) {
        folderElement.addEventListener('dblclick', () => {
            const trashContent = this.hierarchy.trash.map(folder => {
                const folderElement = this.createFolderElement(folder.dataset.name, folder.querySelector('img').src);
                return folderElement.outerHTML;
            }).join('');
            const trashWindow = this.windows.createNewWindow("center", icon, folderName, trashContent, textDesc1, textDesc2);
            this.hierarchy.trash.forEach((folder, index) => {
                const folderElementInWindow = trashWindow.querySelector(`.desktop-folder:nth-child(${index + 1})`);
                this.hierarchy.addRestoreEvent(folderElementInWindow);
            });
        });
    }

    setLocalStorageKeys() {
        const keys = {
            up: 'ArrowUp',
            down: 'ArrowDown',
            left: 'ArrowLeft',
            right: 'ArrowRight'
        };
        localStorage.setItem('keys', JSON.stringify(keys));
        localStorage.setItem('pauseKey', "p");
    }

    createGrid() {
        const windowsAreaRect = this.windowsArea.getBoundingClientRect();
        const navigationHeight = this.navigation.offsetHeight;
        const dockHeight = document.querySelector('.dock').offsetHeight;
        const maxY = window.innerHeight - dockHeight - navigationHeight;

        const numGridsX = Math.floor(windowsAreaRect.width / (this.gridSize + this.gap));
        const numGridsY = Math.floor(maxY / (this.gridSize + this.gap));

        return Array(numGridsX).fill(undefined).map(() => Array(numGridsY).fill(0));
    }

    handleKeyDown(e) {
        if (e.key === 'Delete') {
            this.hierarchy.moveSelectedFoldersToTrash();
        }
    }

    addContextMenuEvent(element) {
        element.addEventListener('contextmenu', (e) => {
            this.createContextMenu(e, element);
        });
    }

    updateGrid(folderElement) {
        const folderName = folderElement.dataset.name;
        const oldPosition = this.getFolderPosition(folderElement);

        if (oldPosition) {
            const [oldX, oldY] = oldPosition;
            this.grid[oldX][oldY] = 0;
        }

        const folderRect = folderElement.getBoundingClientRect();
        const navigationHeight = document.querySelector('.navigation').offsetHeight;

        const newX = Math.floor(folderRect.left / (this.gridSize + this.gap));
        const newY = Math.floor((folderRect.top - navigationHeight) / (this.gridSize + this.gap));

        if (newX >= 0 && newX < this.grid.length && newY >= 0 && newY < this.grid[newX].length) this.grid[newX][newY] = folderName;
    }

    launchDoom() {
        const doomCanvas = document.createElement('div');
        doomCanvas.id = 'jsdos';
        doomCanvas.classList.add('jsdos');
        return doomCanvas.outerHTML;
    }

    launchPacman() {
        const pacmanCanvas = document.createElement('div');
        pacmanCanvas.id = 'jsdospac';
        pacmanCanvas.classList.add('jsdos');
        return pacmanCanvas.outerHTML;
    }

    launchSnake() {
        const snakeCanvas = document.createElement('canvas');
        snakeCanvas.id = 'snake';
        snakeCanvas.classList.add('snake');
        return snakeCanvas.outerHTML;
    }

    launchSnakeOnWindowOpen() {
        const windowsArea = document.querySelector('.windows_area');

        const observer = new MutationObserver(mutationsList => {
            for(let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    for(let node of mutation.addedNodes) {
                        if(node.nodeType === Node.ELEMENT_NODE && node.classList.contains('window') && node.dataset.name === 'Snake') {
                            this.initializeSnakeGame(node);
                        }
                        if(node.nodeType === Node.ELEMENT_NODE && node.classList.contains('window') && node.dataset.name === 'Doom') {
                            this.initializeDoomGame(node);
                        }
                        if(node.nodeType === Node.ELEMENT_NODE && node.classList.contains('window') && node.dataset.name === 'Pacman') {
                            this.initializePacmanGame(node);
                        }
                    }
                }
            }
        });

        observer.observe(windowsArea, { childList: true });
    }

    initializeDoomGame(node) {
        const doomCanvas = node.querySelector('#jsdos');
        if (doomCanvas) {
            doomCanvas.id = `doom-${this.doomGameCounter++}`;
            doomCanvas.width = node.offsetWidth;
            doomCanvas.height = node.offsetHeight - node.querySelector('.controller').offsetHeight;

            const doomGame = new Doom(doomCanvas.id, this.windows);
            doomGame.launch();
        }
    }

    initializePacmanGame(node) {
        const pacmanCanvas = node.querySelector('#jsdospac');
        if (pacmanCanvas) {
            pacmanCanvas.id = `pacman-${this.pacmanGameCounter++}`;
            pacmanCanvas.width = node.offsetWidth;
            pacmanCanvas.height = node.offsetHeight - node.querySelector('.controller').offsetHeight;

            const pacmanGame = new Pacman(pacmanCanvas.id, this.windows);
            pacmanGame.launch();
        }
    }

    initializeSnakeGame(node) {
        const snakeCanvas = node.querySelector('#snake');
        if (snakeCanvas) {
            snakeCanvas.id = `snake-${this.snakeGameCounter++}`;
            snakeCanvas.width = node.offsetWidth;
            snakeCanvas.height = node.offsetHeight - node.querySelector('.controller').offsetHeight;
            if (snakeCanvas.getContext) {
                const snakeGame = new Snake(snakeCanvas.id, this.windows);
                snakeGame.init();
                snakeCanvas.snakeGame = snakeGame;
            }
        }
    }

    createContextMenu(e, folderElement) {
        e.preventDefault();

        this.removeExistingContextMenu();

        const contextMenu = this.createContextMenuElement(e);

        if (folderElement.dataset.name === 'Poubelle') {
            this.addTrashOptions(contextMenu);
        } else {
            this.addDefaultOptions(contextMenu);
        }

        document.body.appendChild(contextMenu);
        this.addRemoveContextMenuEvent(contextMenu);

        return contextMenu;
    }

    removeExistingContextMenu() {
        const existingMenu = document.querySelector('.context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }
    }

    createContextMenuElement(e) {
        const contextMenu = document.createElement('div');
        contextMenu.style.position = 'absolute';
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.top = `${e.pageY}px`;
        contextMenu.classList.add('context-menu');
        return contextMenu;
    }

    addTrashOptions(contextMenu) {
        contextMenu.innerHTML = '<button class="empty-trash">Vider la corbeille</button>';
        contextMenu.querySelector('.empty-trash').addEventListener('click', () => {
            this.hierarchy.emptyBin();
            contextMenu.remove();
        });
    }

    addDefaultOptions(contextMenu) {
        contextMenu.innerHTML = '<button class="delete">Supprimer</button><button class="restore">Restaurer</button>';
    }

    addRemoveContextMenuEvent(contextMenu) {
        document.addEventListener('mousedown', function removeContextMenu(event) {
            if (!event.target.closest('.context-menu')) {
                contextMenu.remove();
                document.removeEventListener('mousedown', removeContextMenu);
            }
        });
    }

    setFolderPosition(folderElement) {
        let freePosition = this.findFreePosition();
        while (freePosition && this.grid[freePosition[0]][freePosition[1]] !== 0) {
            freePosition = this.findFreePosition();
        }
        if (freePosition) {
            const [x, y] = freePosition;
            this.grid[x][y] = folderElement.dataset.name;

            const gridY = y * (this.gridSize + this.gap) + document.querySelector('.navigation').offsetHeight;
            const gridX = x * (this.gridSize + this.gap);
            const windowsAreaRect = this.windowsArea.getBoundingClientRect();
            const adjustedGridX = Math.min(gridX, windowsAreaRect.width - this.gridSize);
            const adjustedGridY = Math.min(gridY, windowsAreaRect.height - this.gridSize);

            folderElement.style.position = 'absolute';
            folderElement.style.left = `${adjustedGridX}px`;
            folderElement.style.top = `${adjustedGridY}px`;
        } else {
            console.error('Aucune position de disponible sur le bureau.');
        }
    }

    getFolderPosition(folderElement) {
        const folderName = folderElement.dataset.name;

        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                if (this.grid[i][j] === folderName) {
                    return [i, j];
                }
            }
        }

        return null;
    }

    findFreePosition() {
        const dockHeight = document.querySelector('.dock').offsetHeight;
        const maxY = window.innerHeight - dockHeight;

        const startX = this.lastFreePosition ? this.lastFreePosition[0] : 0;
        const startY = this.lastFreePosition ? this.lastFreePosition[1] : 0;

        for (let i = startX; i < this.grid.length; i++) {
            for (let j = startY; j < this.grid[i].length; j++) {
                const gridY = j * (this.gridSize + this.gap) + document.querySelector('.navigation').offsetHeight;
                if (this.grid[i][j] === 0 && gridY < maxY) {
                    return [i, j];
                }
            }
        }

        const newY = this.grid.length;
        const gridY = newY * (this.gridSize + this.gap) + document.querySelector('.navigation').offsetHeight;
        if (gridY < maxY) {
            this.grid.push(Array(this.gridSize).fill(0));
            return [this.grid.length - 1, 0];
        }

        console.error('Aucune position de disponible sur le bureau.');
        return null;
    }

    setFolderToFreePosition(folder, desktopAreaRect) {
        let freePosition = this.findFreePosition();
        if (freePosition) {
            const [x, y] = freePosition;
            this.grid[x][y] = folder.dataset.name;

            const gridY = y * (this.gridSize + this.gap) + document.querySelector('.navigation').offsetHeight;
            const gridX = x * (this.gridSize + this.gap);

            const adjustedGridX = Math.min(Math.max(gridX, 0), desktopAreaRect.width - this.gridSize);
            const adjustedGridY = Math.min(Math.max(gridY, 0), desktopAreaRect.height - this.gridSize);

            folder.style.left = `${adjustedGridX}px`;
            folder.style.top = `${adjustedGridY}px`;

            // Update the last free position
            this.lastFreePosition = freePosition;
        }
    }

    addDragEvents(folderElement, folderName) {
        folderElement.draggable = true;

        if (folderElement.closest('.window')) return;

        this.preventPropagationOnMouseDown(folderElement);
        this.handleDragStart(folderElement, folderName);
        this.handleDragOver(folderElement);
        this.handleDragLeave(folderElement);
        this.handleDrop(folderElement, folderName);
        this.handleDragEnd(folderElement);
    }

    preventPropagationOnMouseDown(folderElement) {
        const folderIcon = folderElement.querySelector('img');
        folderIcon.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });
    }

    handleDragStart(folderElement, folderName) {
        folderElement.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', folderName);
            this.draggedFolderName = folderName;
            folderElement.classList.add('dragging');
            this.draggedFolder = folderElement;

            if (!folderElement.classList.contains('selected')) {
                this.selectedFolders.forEach(folder => {
                    folder.classList.remove('selected');
                });
                this.selectedFolders = [];
            }

            this.previewElement = folderElement.cloneNode(true);
            this.previewElement.classList.add('folder-preview');
            this.previewElement.style.position = 'absolute';
            document.querySelector('.windows_area').appendChild(this.previewElement);
        });
    }

    handleDragOver(folderElement) {
        folderElement.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (folderElement.dataset.type === 'folder' || folderElement.dataset.type === 'game') {
                folderElement.classList.add('over');
            }
        });
    }

    handleDragLeave(folderElement) {
        folderElement.addEventListener('dragleave', () => {
            folderElement.classList.remove('over');
        });
    }

    handleDrop(folderElement, folderName) {
        folderElement.addEventListener('drop', (e) => {
            e.preventDefault();
            const childFolderName = e.dataTransfer.getData('text/plain');
            const childFolderElement = document.querySelector(`.desktop-folder[data-name="${childFolderName}"]`);

            if (folderName === childFolderName) {
                folderElement.classList.remove('over');
                return;
            }

            if ((folderElement.dataset.type === 'folder' || folderElement.dataset.type === 'game') && (childFolderElement.dataset.type !== 'system' || childFolderName === 'Snake')) {
                folderElement.childrenFolders[childFolderName] = childFolderElement;
                childFolderElement.style.display = 'none';
            }
            folderElement.classList.remove('over');
        });
    }

    handleDragEnd(folderElement) {
        folderElement.addEventListener('dragend', () => {
            folderElement.classList.remove('dragging');
            this.updateGrid(folderElement);
            if (this.previewElement) {
                this.previewElement.remove();
                this.previewElement = null;
            }
        });
    }

    setupDragAndDrop() {
        this.setupDragOver();
        this.setupDrop();
    }

    setupDragOver() {
        const desktopArea = document.querySelector('.windows_area');

        desktopArea.addEventListener('dragover', (e) => {
            e.preventDefault();

            const folderName = this.draggedFolderName;
            const folderElement = document.querySelector(`.desktop-folder[data-name="${folderName}"]`);

            if (!folderElement || folderElement.closest('.window')) {
                return;
            }

            if (!this.previewElement) {
                this.previewElement = folderElement.cloneNode(true);
                this.previewElement.classList.add('folder-preview');
                this.previewElement.style.position = 'absolute';
                desktopArea.appendChild(this.previewElement);
            }

            let gridX = Math.floor(e.clientX / (this.gridSize + this.gap)) * (this.gridSize + this.gap);
            let gridY = Math.floor(e.clientY / (this.gridSize + this.gap)) * (this.gridSize + this.gap);

            const desktopAreaRect = desktopArea.getBoundingClientRect();

            gridX = Math.min(Math.max(gridX, 0), desktopAreaRect.width - this.gridSize);
            gridY = Math.min(Math.max(gridY, 0), desktopAreaRect.height - this.gridSize);

            gridY += document.querySelector('.navigation').offsetHeight;

            if (this.selectedFolders.length > 1) {
                const deltaX = gridX - parseInt(this.draggedFolder.style.left);
                const deltaY = gridY - parseInt(this.draggedFolder.style.top);

                this.selectedFolders.forEach(folder => {
                    folder.style.left = `${parseInt(folder.style.left) + deltaX}px`;
                    folder.style.top = `${parseInt(folder.style.top) + deltaY}px`;
                });
            } else {
                folderElement.style.left = `${gridX}px`;
                folderElement.style.top = `${gridY}px`;
            }

            this.previewElement.style.left = `${gridX}px`;
            this.previewElement.style.top = `${gridY}px`;
        });
    }

    setupDrop() {
        const desktopArea = document.querySelector('.windows_area');

        desktopArea.addEventListener('drop', (e) => {
            e.preventDefault();

            const folderName = this.draggedFolderName;
            const folderElement = document.querySelector(`.desktop-folder[data-name="${folderName}"]`);

            if (folderElement) {
                this.selectedFolders.forEach(folder => {
                    const folderRect = folder.getBoundingClientRect();
                    const desktopAreaRect = desktopArea.getBoundingClientRect();
                    if (folderRect.left < desktopAreaRect.left || folderRect.right > desktopAreaRect.right || folderRect.top < desktopAreaRect.top || folderRect.bottom > desktopAreaRect.bottom) {
                        this.setFolderToFreePosition(folder, desktopAreaRect);
                    } else {
                        // Check if the grid position is already occupied
                        const gridX = Math.floor(folderRect.left / (this.gridSize + this.gap));
                        const gridY = Math.floor((folderRect.top - document.querySelector('.navigation').offsetHeight) / (this.gridSize + this.gap));
                        if (this.grid[gridX][gridY] !== 0) {
                            this.setFolderToFreePosition(folder, desktopAreaRect);
                        }
                    }
                    this.updateGrid(folder);
                });
                this.draggedFolderName = null;
                if (this.previewElement) {
                    this.previewElement.remove();
                    this.previewElement = null;
                }
                this.draggedFolder = null;
            }
        });
    }

    startSelection(e) {
        if (e.target.closest('.desktop-folder')) return;
        if (e.button !== 0) return;

        const navigationHeight = document.querySelector('.navigation').offsetHeight;
        const dockHeight = document.querySelector('.dock').offsetHeight;
        const maxY = window.innerHeight - dockHeight;

        if (e.clientY < navigationHeight || e.clientY > maxY) return;

        const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
        if (elementUnderCursor.closest('.window') || elementUnderCursor.closest('.window-menu')) return;

        this.isSelecting = true;
        this.startX = e.clientX;
        this.startY = e.clientY;

        this.selectionBox = document.createElement('div');
        this.selectionBox.style.position = 'absolute';
        this.selectionBox.style.left = `${this.startX}px`;
        this.selectionBox.style.top = `${this.startY}px`;
        this.selectionBox.classList.add('selection-box');

        const windows = document.querySelectorAll('.window');
        windows.forEach(window => window.classList.add('no-select'));

        document.addEventListener('mousemove', this.updateSelection.bind(this), { passive: true });
        document.addEventListener('mouseup', this.endSelection.bind(this), { once: true });

        document.body.appendChild(this.selectionBox);
    }

    updateSelection(e) {
        if (!this.isSelecting) return;

        const dockHeight = document.querySelector('.dock').offsetHeight;
        const maxY = window.innerHeight - dockHeight;

        const currentY = Math.min(Math.max(e.clientY, this.navigation.offsetHeight), maxY);
        const currentX = e.clientX;

        const newWidth = Math.abs(currentX - this.startX);
        const newHeight = Math.abs(currentY - this.startY);
        const newLeft = Math.min(currentX, this.startX);
        const newTop = Math.min(currentY, this.startY);

        this.selectionBox.style.width = `${newWidth}px`;
        this.selectionBox.style.height = `${newHeight}px`;
        this.selectionBox.style.left = `${newLeft}px`;
        this.selectionBox.style.top = `${newTop}px`;

        const folders = document.querySelectorAll('.desktop-folder');
        folders.forEach(folder => {
            const folderRect = folder.getBoundingClientRect();
            const overlaps = !(folderRect.right < this.selectionBox.offsetLeft ||
                folderRect.left > this.selectionBox.offsetLeft + this.selectionBox.offsetWidth ||
                folderRect.bottom < this.selectionBox.offsetTop ||
                folderRect.top > this.selectionBox.offsetTop + this.selectionBox.offsetHeight);

            if (overlaps) {
                if (!this.selectedFolders.includes(folder)) {
                    folder.classList.add('selected');
                    this.selectedFolders.push(folder);
                    this.originalPositions[folder.dataset.name] = { left: folder.style.left, top: folder.style.top };
                }
            } else {
                folder.classList.remove('selected');
                this.selectedFolders = this.selectedFolders.filter(selectedFolder => selectedFolder !== folder);
                delete this.originalPositions[folder.dataset.name];
            }
        });
    }

    removeSelection(e) {
        if (!e.target.closest('.desktop-folder')) {
            this.selectedFolders.forEach(folder => {
                folder.classList.remove('selected');
            });
            this.selectedFolders = [];
        }
    }

    endSelection() {
        if (!this.isSelecting) return;

        document.removeEventListener('mousemove', this.updateSelection.bind(this));
        const windows = document.querySelectorAll('.window');
        windows.forEach(window => window.classList.remove('no-select'));

        this.isSelecting = false;
        document.body.removeChild(this.selectionBox);
        this.selectionBox = null;
    }

}