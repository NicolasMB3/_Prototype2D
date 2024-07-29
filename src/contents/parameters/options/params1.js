export const params1 = (className) => {
    return `
        <div id="param1_content" class="${ className }">
            <h2>Paramètres</h2>
            <div>
                <label for="theme">Fond d'écran</label>
                <select name="theme" id="theme">
                    <option value="pattern">Pattern 0</option>
                    <option value="pattern-1">Pattern 1</option>
                </select>
            </div>
            <div class="controller-settings">
                <p>Placement des boutons de contrôle des fenêtres</p>
                <label for="control-left">Gauche</label>
                <input type="radio" name="control" value="left" id="control-left" ${ localStorage.getItem('controllerPlacement') === "left" ? "checked" : "" }>
                <label for="control-right">Droite</label>
                <input type="radio" name="control" value="right" id="control-right" ${ localStorage.getItem('controllerPlacement') === "right" ? "checked" : "" }>
            </div>
        </div>
    `
}