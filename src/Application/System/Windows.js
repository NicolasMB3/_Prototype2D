import { WindowController } from '../Controller.js';
import { Navigation } from "./Navigation.js";

import { KEY_SYMBOLS } from '../../contents/parameters/key_symbols.js';
import { paramsController } from "../../contents/parameters/controller.js";

export class Windows {

    constructor() {
        this.windows = [];
        this.highestZIndex = 0;
        this.contentParams = paramsController;
        localStorage.setItem('controllerPlacement', 'right');
        this.classNavigation = new Navigation();
        this.init();
    }

    init() {
        this.classNavigation.init();
    }

    addWindow(windowController) {
        this.windows.push(windowController);
    }

    createWindowElement(position, icon, title, content) {
        return `
            <div class="window position-${ position } ${title === 'Snake' ? 'snake-window' : ''}" data-name="${ title }" style="--random-color: ${this.getRandomColor()}">
                <div class="controller block_highlights ${ localStorage.getItem("controllerPlacement") === "left" ? 'row-reverse' : '' }">
                    <p>${ title }</p>
                    <div class="icon_controller">
                        <span class="minus"></span>
                        <span class="expand"></span>
                        <span class="close"></span>
                    </div>
                </div>
                <div class="content">
                    ${ content }
                </div>
            </div>
        `;
    }

    getRandomColor() {
        let color = Math.floor(Math.random()*16777215).toString(16);
        while (color.length < 6) {
            color = '0' + color;
        }
        return '#' + color;
    }

    createNewWindow(position, icon, title, contentFunction) {
        const content = typeof contentFunction === 'function' ? contentFunction() : contentFunction;
        const windowsElement = this.createWindowElement(position, icon, title, content);

        document.querySelector('.windows_area').insertAdjacentHTML('beforeend', windowsElement);
        const newWindowElement = document.querySelector('.windows_area').lastElementChild;
        const newWindowController = new WindowController(this, newWindowElement, icon);
        this.addWindow(newWindowController);

        newWindowElement.id = `window-${Date.now()}`;
        newWindowController.init(newWindowElement);

        newWindowElement.addEventListener('click', () => {
            this.bringToFront(newWindowController);
        });

        this.bringToFront(newWindowController);
        this.addNavigationClickHandler(newWindowElement);
        return newWindowElement;
    }

    addNavigationClickHandler(newWindowElement) {
        const navItems = newWindowElement.querySelector('.param_nav');
        const contentContainer = newWindowElement.querySelector('.param_content');
        let activeInput = null;

        if (navItems) {
            navItems.addEventListener('click', (e) => {
                if(e.target.tagName === 'LI') {
                    this.handleNavigationClick(e, contentContainer, newWindowElement, activeInput);
                }
            });
        }
    }

    handleNavigationClick(e, contentContainer, newWindowElement, activeInput) {
        const id = e.target.getAttribute('id');
        contentContainer.innerHTML = this.contentParams[id] || '';
        this.addBackgroundChangeHandler(newWindowElement);

        const controlLeftRadio = newWindowElement.querySelector('#control-left');
        const controlRightRadio = newWindowElement.querySelector('#control-right');

        if (controlLeftRadio && controlRightRadio) {
            controlLeftRadio.addEventListener('change', () => this.changeControllerPlacement('left'));
            controlRightRadio.addEventListener('change', () => this.changeControllerPlacement('right'));
        }

        const snakeColorInput = newWindowElement.querySelector('#snake-color');
        if (snakeColorInput) {
            this.addSnakeColorChangeHandler(snakeColorInput);
        }

        const keyInputs = newWindowElement.querySelectorAll('.key-input');
        keyInputs.forEach(input => {
            this.addKeyInputHandlers(input, activeInput, newWindowElement);
        });
    }

    addSnakeColorChangeHandler(snakeColorInput) {
        snakeColorInput.addEventListener('change', (e) => {
            this.changeSnakeColor(e.target.value);
        });
    }

    addKeyInputHandlers(input, activeInput, newWindowElement) {
        input.addEventListener('click', () => {
            if (activeInput) {
                activeInput.classList.remove('active');
            }
            input.classList.add('active');
            activeInput = input;
        });
        input.addEventListener('keydown', (e) => {
            this.handleKeydownOnInput(e, input, newWindowElement);
        });
    }

    handleKeydownOnInput(e, input, newWindowElement) {
        e.preventDefault();
        const newKey = e.key;
        input.textContent = KEY_SYMBOLS[newKey] || newKey;

        if(input.classList.contains('toucheP')) {
            this.changeSnakePause(input.textContent);
        }

        const newKeys = {
            up: newWindowElement.querySelector('#up-key').textContent === '↑' ? 'ArrowUp' : newWindowElement.querySelector('#up-key').textContent,
            down: newWindowElement.querySelector('#down-key').textContent === '↓' ? 'ArrowDown' : newWindowElement.querySelector('#down-key').textContent,
            left: newWindowElement.querySelector('#left-key').textContent === '←' ? 'ArrowLeft' : newWindowElement.querySelector('#left-key').textContent,
            right: newWindowElement.querySelector('#right-key').textContent === '→' ? 'ArrowRight' : newWindowElement.querySelector('#right-key').textContent
        };
        this.changeKeySnake(newKeys);
    }

    changeControllerPlacement(placement) {
        const controllers = document.querySelectorAll('.controller');

        controllers.forEach(controller => {
            if (placement === 'left') {
                controller.style.flexDirection = 'row-reverse';
                controller.querySelector('.icon_controller').style.flexDirection = 'row-reverse';
            } else {
                controller.style.flexDirection = 'row';
                controller.querySelector('.icon_controller').style.flexDirection = 'row';
            }
        });

        localStorage.setItem('controllerPlacement', placement);
    }

    changeSnakeColor(newColor) {
        localStorage.setItem('snakeColor', newColor);
    }

    changeSnakePause(newKey) {
        localStorage.setItem('pauseKey', newKey);
    }

    changeBackground(theme) {
        document.body.style.backgroundImage = `url('/${theme}.svg')`;
    }

    changeKeySnake(newKeys) {
        localStorage.setItem('keys', JSON.stringify(newKeys));
    }

    addBackgroundChangeHandler(newWindowElement) {
        const themeSelector = newWindowElement.querySelector('#theme');
        if (themeSelector) {
            themeSelector.addEventListener('change', (e) => {
                this.changeBackground(e.target.value);
            });
        }
    }

    bringToFront(windowController) {
        windowController.zIndex = ++this.highestZIndex;
        windowController.windowElement.style.zIndex = this.highestZIndex;
    }

    createPopup(message, buttonText1, buttonText2) {
        const blurBackground = document.createElement('div');
        blurBackground.classList.add('blur-background');

        const popup = document.createElement('div');
        popup.classList.add('popup');

        const text = document.createElement('p');
        text.textContent = message;
        popup.appendChild(text);

        if (buttonText1) {
            const button1 = document.createElement('button');
            button1.textContent = buttonText1;
            popup.appendChild(button1);
        }

        if (buttonText2) {
            const button2 = document.createElement('button');
            button2.textContent = buttonText2;
            popup.appendChild(button2);
        }

        blurBackground.appendChild(popup);
        document.body.appendChild(blurBackground);
    }
}