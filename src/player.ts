import { Sprite, TextureLoader, SpriteMaterial, Scene, Texture, Vector3, WebGLRenderer } from "three";
import { Updateable } from "./stage";
var THREE = require('three');

export class Player extends Updateable {
    scene: Scene;
    x: number;
    y: number;
    xVel: number;
    yVel: number;
    sprite: Sprite;
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    maxVel: number;
    health: number;
    isAlive: boolean;
    maxAnisotrophy: number;
    beemanIdleState: Texture;

    constructor(scene: Scene, maxAnisotrophy: number) {
        super();
        this.scene = scene;
        this.x = 0;
        this.y = 4.5;
        this.xVel = 0;
        this.yVel = 0;
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.maxVel = 0.05;
        this.health = 100;
        this.isAlive = true;
        this.maxAnisotrophy = maxAnisotrophy;
        this.beemanIdleState = new THREE.TextureLoader().load("assets/Tiny.png");

        var spriteMap: Texture = this.beemanIdleState;

        spriteMap.anisotropy = this.maxAnisotrophy;
        var spriteMaterial: SpriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffffff });
        spriteMaterial.map.minFilter = THREE.LinearFilter;
        this.sprite = new Sprite(spriteMaterial);
        this.sprite.scale.set(1/8, 1/8, 1/8);
        this.scene.add(this.sprite);
    }

    update(): void {
        
        if (this.right) {
            this.xVel = Math.min(this.xVel += 0.01, this.maxVel);
        }
        if (this.left) {
            this.xVel = Math.max(this.xVel -= 0.01, -this.maxVel);
        }
        if (this.up) {
            this.yVel = Math.max(this.yVel += 0.001, this.maxVel);//idk why, but otherwise it's too fast
        }
        if (this.down) {
            this.yVel = Math.max(this.yVel -= 0.01, -this.maxVel);
        }

        this.x += !this.isAlive || (this.x < -7.5 && this.xVel < 0) || (this.x > 7.5 && this.xVel > 0) ? 0 : this.xVel;
        this.y += !this.isAlive || (this.y < .5 && this.yVel < 0) || (this.y > 8.5 && this.yVel > 0) ? 0 : this.yVel;
        this.xVel *= 0.95;
        this.yVel *= 0.95;

        this.sprite.position.set(this.x, this.y, 0);
        

        if (this.health <= 0) {
            this.isAlive = false;
        } else {
            this.isAlive = true;
        }
    }

    render(): void {
        
    }
}