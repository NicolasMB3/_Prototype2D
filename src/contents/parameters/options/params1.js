export const params1 = (className) => {
    return `
        <div id="param1_content" class="${className} win95-window">
            <div class="win95-header">
                <h2>Paramètres</h2>
            </div>
            <div class="win95-body">
                <div class="win95-section controller-settings">
                    <p>Placement des boutons de contrôle des fenêtres</p>
                    <label for="control-left">Gauche</label>
                    <input type="radio" name="control" value="left" id="control-left" ${localStorage.getItem('controllerPlacement') === "left" ? "checked" : ""}>
                    <label for="control-right">Droite</label>
                    <input type="radio" name="control" value="right" id="control-right" ${localStorage.getItem('controllerPlacement') === "right" ? "checked" : ""}>
                </div>
            </div>
        </div>
    `;
}