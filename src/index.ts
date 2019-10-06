/**
 * TODO For Library:
 * Buttons and other interactable elements need more work in stage
 * individual stage update methods defined here?
 * 
 */

import { Scene, PerspectiveCamera, WebGLRenderer, MinEquation, Vector3, Sprite, Texture, SpriteMaterial } from "three";
import { Stage } from "./stage";
import { StaticImage } from "./staticImage";
import { Player } from "./player";
import { Platform } from "./platform";
// import { Enemy } from "./enemy";
// import { Platform } from "./platform";
import THREE = require("three");
import { Button } from "./button";
import { platform } from "os";
import { Mouse } from "./mouse";

var renderer: WebGLRenderer = new WebGLRenderer();
//renderer.setSize(window.innerWidth, window.innerHeight);//1:1 scale resolution
if (window.innerWidth / 16 > window.innerHeight / 9) {
    renderer.setSize(window.innerHeight * (16 / 9), window.innerHeight);//make constant
}
else {
    renderer.setSize(window.innerWidth, window.innerWidth * (9 / 16));
}

//document.getElementById("canvasContainer").append(renderer.domElement);
document.body.getElementsByClassName('centered-canvas')[0].appendChild(renderer.domElement);//boardhouse uses a captured canvas element, difference?

//globals
let stageList: { [key: string]: Stage; } = {};//dictionary of all stages
var currentStage: string = "splash";
var win = false;
var music = new Audio('assets/SFX/OceanSong.wav');
music.loop = true;
//var shootClip = new Audio('assets/SFX/bee_buzz_edit.wav');
//shootClip.volume = 0.8;
var ticks:number = 0;

stageList["main"] = new Stage();
stageList["splash"] = new Stage();
stageList["gameOver"] = new Stage();

stageList["gameOver"].update = function () {
    stageList["gameOver"].elementsList["game"].forEach(el => { el.update() });
}

//splash screen logic
stageList["splash"].update = function () {//actual splash screen update logic here
    stageList["splash"].elementsList["game"].forEach(el => { el.update() });
}

//backgrounds
stageList["main"].elementsList["ui"].push(new StaticImage(stageList["main"].sceneList["ui"], 0, 0, "assets/solidBlue.png", new Vector3(16, 9, 1)));
stageList["main"].elementsList["background"].push(new StaticImage(stageList["main"].sceneList["background"], 0, 4.5, "assets/waves1.png", new Vector3(16, 9, 1)));
stageList["main"].elementsList["background"].push(new StaticImage(stageList["main"].sceneList["background"], 0, 4.5, "assets/waves2.png", new Vector3(16, 9, 1)));
//stageList["gameOver"].elementsList["ui"].push(new StaticImage(stageList["gameOver"].sceneList["ui"], 0, 0, "assets/winScreen.png", new Vector3(16, 9, 1)));
stageList["splash"].elementsList["ui"].push(new StaticImage(stageList["splash"].sceneList["ui"], 0, 0, "assets/Magnet_guy.png", new Vector3(16, 9, 1)));


stageList["main"].elementsList["game"].push(new Player(stageList["main"].sceneList["game"], renderer.capabilities.getMaxAnisotropy()));
stageList["main"].elementsList["ui"].push(new Mouse(stageList["main"].sceneList["game"], renderer.capabilities.getMaxAnisotropy()));

//game screen logic
stageList["main"].update = function () {//actual splash screen update logic here
    var localStage: Stage = stageList["main"];

    //wave logic
    localStage.elementsList["background"][0].x = Math.sin(ticks/16)/4;
    localStage.elementsList["background"][1].x = -Math.sin(ticks/16)/4;

    //platform spawning
    if(ticks % 120 == 0)//test this rate
    {
        var spawnLocation = Math.random();
        if(spawnLocation < .25)
        {
            localStage.elementsList["game"].push(new Platform(localStage.sceneList["game"], (Math.random() * 14) + 1, 9.5, (Math.random() * .04) - .02, -Math.random() * .02, 0, 0));
        }
        else if (spawnLocation >= .25 && spawnLocation < .5)
        {
            localStage.elementsList["game"].push(new Platform(localStage.sceneList["game"], (Math.random() * 14) + 1, -.05, (Math.random() * .04) - .02, Math.random() * .02, 0, 0));
        }
        else if (spawnLocation >= .5 && spawnLocation < .75)
        {
            localStage.elementsList["game"].push(new Platform(localStage.sceneList["game"], -8.5, (Math.random() * 7) + 1, Math.random() * .02, (Math.random() * .04) - .02, 0, 0));
        }
        else if (spawnLocation >= .75)
        {
            localStage.elementsList["game"].push(new Platform(localStage.sceneList["game"], 8.5, (Math.random() * 7) + 1, -Math.random() * .02, (Math.random() * .04) - .02, 0, 0));
        }
    }

    localStage.elementsList["game"].forEach(el => {
        if (el.isAlive != undefined && !el.isAlive) {
            localStage.sceneList["game"].remove(el.sprite);
        }
    });

    var localPlayer: Player = localStage.elementsList["game"].find(el => el instanceof Player);
    
    // filter out dead entities
    localStage.elementsList["game"] = localStage.elementsList["game"].filter(el => el.isAlive || el instanceof Player || el.isAlive == undefined);

    localStage.elementsList["game"].forEach(element => {
        if (element.isAlive != undefined && element.x < localPlayer.x - 16) {
            element.isAlive = false;
        }
    });

    localStage.elementsList["game"].forEach(el => { el.update() });
    //localStage.cameraList["game"].position.set(localPlayer ? localPlayer.x : localStage.cameraList["game"].position.x, localStage.cameraList["game"].position.y, localStage.cameraList["game"].position.z);

    //collision logic
    stageList["main"].elementsList["game"].forEach(el => {
        stageList["main"].elementsList["game"].forEach(el2 => {
            if (el !== el2) { // only check for collision between two different objects
                if (collision(el, el2)) {
                    // if player collides with an enemy projectile, take damage   
                    if (el instanceof Player && el.isAlive && el2 instanceof Platform && (el2.type === 2 || el2.type === 3)) {
                        el2.isAlive = false;
                    }
                    
                }
            }
        });
    });
}

//main update
var interval = setInterval(update, 1000 / 60);//60 ticks per second
function update() {
    ticks++;
    stageList[currentStage].baseUpdate();
    stageList[currentStage].update();
}

// check if two items are colliding
function collision(a, b) {
    return (
        a.x - (a.sprite.scale.x / 2) < b.x + (b.sprite.scale.x / 2) &&
        a.x + (a.sprite.scale.x / 2) > b.x - (b.sprite.scale.x / 2) &&
        a.y - (a.sprite.scale.y / 2) < b.y + (b.sprite.scale.y / 2) &&
        a.y + (a.sprite.scale.y / 2) > b.y - (b.sprite.scale.y / 2)
    )
}

var animate = function () {
    requestAnimationFrame(animate);

    stageList[currentStage].render(renderer);
}
animate();

window.addEventListener("resize", e => {
    if (window.innerWidth / 16 > window.innerHeight / 9) {
        renderer.setSize(window.innerHeight * (16 / 9), window.innerHeight);//make constant
    }
    else {
        renderer.setSize(window.innerWidth, window.innerWidth * (9 / 16));
    }
});

/* movement controls for the player */
window.addEventListener("keydown", e => {
    e.preventDefault();
    e.stopPropagation();
    if(music.played != null) {
        music.play();
    }
    if (currentStage == "main") {
        const player: Player = stageList["main"].elementsList["game"].find(el => el instanceof Player);
        if (player.isAlive) {
            if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */) {
                player.right = true;
            }
            if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */) {
                player.left = true;
            }
            if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */) {
                player.up = true;
            }
            if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */) {//check this lol
                player.down = true;
            }
        }
    }
});

/* movement controls for the player */
window.addEventListener("keyup", e => {
    if (currentStage == "main") {
        const player = stageList["main"].elementsList["game"].find(el => el instanceof Player);
        if (player.isAlive) {
            if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */) {
                player.right = false;
            }
            if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */) {
                player.left = false;
            }
            if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */) {
                player.up = false;
            }
            if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */) {//check this lol
                player.down = false;
            }
        }
    }
});

var respawn = function () {
    // respawn player to starting position
    const player: Player = stageList["main"].elementsList["game"].find(el => el instanceof Player);
    if (player) {
        player.x = 0;
        player.y = 0;
        player.isAlive = true;
    }
}

window.addEventListener("click", e => { 
    if(currentStage == "splash") {
        currentStage = "main"
    }
});

window.addEventListener("mousemove", e => { 
    const mouse:Mouse = stageList["main"].elementsList["ui"].find(el => el instanceof Mouse);
    mouse.x = ((e.clientX / window.innerWidth) * 16) - 8;
    mouse.y = 9 - ((e.clientY / window.innerHeight) * 9);
});

window.addEventListener("mouseup", e => { 
    const mouse:Mouse = stageList["main"].elementsList["ui"].find(el => el instanceof Mouse);
    mouse.clickedUp = true;
    mouse.clickedDown = false;
});

window.addEventListener("mousedown", e => { 
    const mouse:Mouse = stageList["main"].elementsList["ui"].find(el => el instanceof Mouse);
    mouse.clickedUp = false;
    mouse.clickedDown = true;
});