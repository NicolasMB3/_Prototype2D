export class Doom {
    constructor(canvasId, windows) {
        this.canvasId = canvasId;
        this.windows = windows;
        this.emulator = null;

        this.addCloseButtonHandler();
    }

    addCloseButtonHandler() {
        if (!this.canvasId) return;

        const closeButton = document.querySelector('.close');
        if (!closeButton) {
            console.error("Element with class 'close' not found.");
            return;
        }

        closeButton.addEventListener('click', this.stop.bind(this));
    }

    launch() {
        const jsdosElement = document.getElementById(this.canvasId);
        if (!jsdosElement) {
            console.error(`Element with id '${this.canvasId}' not found.`);
            return;
        }

        emulators.pathPrefix = "./JS-DOS/";
        this.emulator = Dos(jsdosElement, {
            wdosboxUrl: "./JS-DOS/wdosbox.js",
        });

        this.removeFlexGrowElements(jsdosElement);

        this.emulator.run("./doom.jsdos").then(() => {
            console.log("Emulator is running.");
        }).catch(error => {
            console.error("Error running emulator:", error);
        });
    }

    removeFlexGrowElements(parentElement) {
        const elements = parentElement.getElementsByClassName('flex-grow-0');
        while (elements.length > 0) {
            elements[0].remove();
        }
    }

    stop() {
        if (this.emulator) {
            this.emulator.stop().then(() => {
                this.emulator = null;
                console.log("Emulator stopped and cleaned up.");
            }).catch(error => {
                console.error("Error stopping emulator:", error);
            });
        } else {
            console.error("No emulator instance to stop.");
        }
    }
}