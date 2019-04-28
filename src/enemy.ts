import { Sprite, TextureLoader, SpriteMaterial, Scene, Texture, Vector3 } from "three";
import { Updateable } from "./stage";
var THREE = require('three');

export class Enemy extends Updateable {
    scene: Scene;
    x: number;
    y: number;
    xVel: number;
    yVel: number;
    sprite: Sprite;
    health:number;
    isAlive: boolean;

    constructor(scene: Scene, type: number, x, y, xVel, yVel) {
        super();
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.xVel = xVel;
        this.yVel = yVel;
        this.health = 100;
        this.isAlive = true;

        var spriteMap: Texture;

        switch(type)
        {
            case 0: {//wasp
                this.health = 50;
                spriteMap = new THREE.TextureLoader().load("assets/wasp1.png");
            }
            case 1: {//exterminator
                this.health = 100;
                spriteMap = new THREE.TextureLoader().load("assets/exterminator.png");
            }
            case 2: {//NPCs?

            }
        }
        
        spriteMap.anisotropy = 2;
        var spriteMaterial: SpriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffffff });
        spriteMaterial.map.minFilter = THREE.LinearFilter;
        this.sprite = new Sprite(spriteMaterial);
        this.sprite.scale.set(45/81, 1, 1);
        this.scene.add(this.sprite);
    }

    update(): void {
        this.x += this.xVel;
        this.y += this.yVel;
        this.sprite.position.set(this.x, this.y, 0);

        if (this.health <= 0) {
            this.isAlive = false;
        }
    }

    render(): void {
        
    }
}