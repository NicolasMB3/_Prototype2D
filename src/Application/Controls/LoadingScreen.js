export class LoadingScreen {
    constructor(totalSegments = 22, message = "Loading...") {
        this.totalSegments = totalSegments;
        this.progress = 0;
        this.message = message;

        this.createLoadingScreen();
        this.createSegments();
        this.updateProgress();
    }

    createLoadingScreen() {
        this.loadingElement = document.createElement('div');
        this.loadingElement.id = 'loading';

        this.loadingElement.innerHTML = `
            <div class="content">
                <p>${this.message}</p>
                <div class="progress-bar" id="progress-bar"></div>
                <button class="cancel-button">Cancel</button>
            </div>
        `;

        document.body.appendChild(this.loadingElement);

        this.loadingElement.querySelector('.cancel-button').addEventListener('click', () => {
            this.cancelLoading();
        });
    }

    createSegments() {
        const progressBar = this.loadingElement.querySelector('.progress-bar');

        for (let i = 0; i < this.totalSegments; i++) {
            const segment = document.createElement('div');
            segment.className = 'progress-segment';
            progressBar.appendChild(segment);
        }

        this.segments = this.loadingElement.querySelectorAll('.progress-segment');
    }

    updateProgress() {
        if (this.progress < this.totalSegments) {
            this.segments[this.progress].classList.add('visible');
            this.progress += 1;
            setTimeout(() => this.updateProgress(), 150);
        } else {
            this.finishLoading();
        }
    }

    finishLoading() {
        setTimeout(() => this.removeLoadingScreen(), 500);
    }

    removeLoadingScreen() {
        this.loadingElement.remove();
    }

    cancelLoading() {
        this.removeLoadingScreen();
        console.log("Loading cancelled");
    }
}
