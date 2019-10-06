import { Sprite, Scene, TextureLoader, SpriteMaterial, Vector3, Texture, WebGLRenderer} from "three";
import { Updateable } from "./stage";
var THREE = require('three');//only needed due to three type shenanigans

export class Mouse extends Updateable{
    sprite:Sprite;
    spriteHalo:Sprite;
    x:number;
    y:number;
    clickedDown:boolean;
    clickedUp:boolean;

    constructor(scene:Scene, maxAnisotropy:number) {
        super();//needed?
        this.x = 0;
        this.y = 5;
        var spriteMap:Texture = new THREE.TextureLoader().load("assets/magnet.png");
        var field:Texture = new THREE.TextureLoader().load("assets/magneticField.png");
        field.anisotropy = maxAnisotropy;
        spriteMap.anisotropy = maxAnisotropy;//renderer.capabilities.getMaxAnisotropy()
        // spriteMap.minFilter = THREE.NearestFilter;
        // spriteMap.magFilter = THREE.NearestFilter;
        var spriteMaterial:SpriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
        var spriteFieldMaterial:SpriteMaterial = new THREE.SpriteMaterial( { map: field, color: 0xffffff } );
        //spriteMaterial.map.minFilter = THREE.LinearFilter;
        this.sprite = new Sprite( spriteMaterial );
        this.sprite.scale.set(1/8, 1/8, 1/8);
        this.sprite.position.set(this.x, this.y, 0);
        scene.add(this.sprite);

        this.spriteHalo = new Sprite(spriteFieldMaterial);
        this.sprite.scale.set(1/8, 1/8, 1/8);
        this.sprite.position.set(0, 10, 0);//above screen
        //scene.add(this.sprite);
    }

    render(scene:Scene) {
        if(this.clickedDown)
        {
            scene.add(this.spriteHalo);
        }

        if(this.clickedUp)
        {
            scene.remove(this.spriteHalo);
        }
    }

    update() {
        this.sprite.position.set(this.x, this.y, 0);
        this.spriteHalo.position.set(this.x, this.y, 0);
    }
}