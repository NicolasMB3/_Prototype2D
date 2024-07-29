import { params } from "../parameters/options/params.js";
import { Desktop } from "../../Application/System/Desktop.js";
import { Windows } from "../../Application/System/Windows.js";
import { Doom } from "../../Application/Games/Doom.js";

const windows = new Windows();
const desktop = new Desktop(windows);
const doom = new Doom();

export const shortcuts = [
    { title: 'Paramètres', path: params, icon: "./images/parameters.png", type: "system", showInDock: true },
    { title: 'Snake', path: desktop.launchSnake, icon: "./images/snake.png", type: "game", showInDock: true },
    { title: 'Doom', path: desktop.launchDoom, icon: "./images/doom.png", type: "game", showInDock: true },
    { title: 'Pacman', path: desktop.launchPacman, icon: "./images/pacman.png", type: "game", showInDock: true },
    { title: 'Corbeille', path: '', icon: "./images/bin.png", type: "system", showInDock: true },
];
