export const params3 = (className) => {
    return `
        <div id="param3_content" class="${className}">
            <div class="credits-title">
                <img src="./images/book.png" alt="Credits Icon">
                <h1>Crédits</h1>
            </div>
            <div class="credits-content">
                <p><strong>Modèle de l'écran/ordinateur :</strong> <a href="https://sketchfab.com/dr.badass2142" target="_blank">Dr.Badass2142</a></p>
                <p><strong>Modèles low poly par Google :</strong> <a href="https://poly.pizza/" target="_blank">Poly Pizza</a></p>
                <p><strong>Icônes :</strong> <a href="https://win98icons.alexmeub.com/" target="_blank">Win98 Icons</a></p>
                <p><strong>ThreeJS Journey :</strong> <a href="https://threejs-journey.com/" target="_blank">ThreeJS Journey</a></p>
                <p>Si vous remarquez que l'un de vos modèles est utilisé, n'hésitez pas à me contacter pour être ajouté dans les crédits.</p>
            </div>
        </div>
    `
}