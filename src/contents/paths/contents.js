import { params } from "../parameters/options/params.js";
import { Desktop } from "../../Application/System/Desktop.js";
import { Windows } from "../../Application/System/Windows.js";
import { Doom } from "../../Application/Games/Doom.js";

const windows = new Windows();
const desktop = new Desktop(windows);
const doom = new Doom();

export const shortcuts = [
    { title: 'Paramètres', path: params, icon: "./images/parameters.png", type: "system", showInDock: true, text1: "Paramètres", text2: "Personnalisez votre expérience" },
    { title: 'Snake', path: desktop.launchSnake, icon: "./images/pacman.png", type: "game", showInDock: true, text1: "03/02/1998", text2: "Snake par NicolasB" },
    { title: 'Doom', path: desktop.launchDoom, icon: "./images/doom.png", type: "game", showInDock: true, text1: "10 décembre 1993", text2: "Doom I par id Software" },
    { title: 'Pacman', path: desktop.launchPacman, icon: "./images/pacman.png", type: "game", showInDock: true, text1: "22 mai 1980", text2: "Pac-man par Tōru Iwatani" },
    { title: 'Corbeille', path: '', icon: "./images/bin.png", type: "system", showInDock: false, text1: "Paramètres", text2: "Personnalisez votre expérience" },
];
