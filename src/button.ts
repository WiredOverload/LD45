import { Sprite, Scene, TextureLoader, SpriteMaterial, Vector3, Texture, WebGLRenderer, PlaneGeometry, Mesh, Geometry, MeshPhongMaterial} from "three";
import { Updateable } from "./stage";
var THREE = require('three');//only needed due to three type shenanigans

export class Button extends Updateable{
    sprite:Sprite;
    x:number;
    y:number;
    //plane:Mesh;
    newMesh:Mesh;

    constructor(scene:Scene, x:number, y:number, imageURL:string, text:string) {
        super();//needed?
        this.x = x;
        this.y = y;
        var spriteMap:Texture = new THREE.TextureLoader().load(imageURL);
        spriteMap.minFilter = THREE.NearestFilter;
        spriteMap.magFilter = THREE.NearestFilter;
        var spriteMaterial:SpriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );

        var planeGeo:PlaneGeometry = new PlaneGeometry(spriteMap.center.width, spriteMap.center.height);
        var plane:Mesh = new Mesh(planeGeo, spriteMaterial);

        //spriteMaterial.map.minFilter = THREE.LinearFilter;
        this.sprite = new Sprite( spriteMaterial );
        //this.sprite.scale.set(scale.x, scale.y, scale.z);

        var singleMaterial:MeshPhongMaterial = new MeshPhongMaterial({color: 0xFF0000});
        var singleMesh:Mesh;

        var loader = new THREE.FontLoader();

        

        loader.load( 'assets/helvetiker_regular.typeface.json', function ( font ) {
            var textGeometry = new THREE.TextGeometry( text, {
                font: font,
                size: 80,
                //height: 5,
                //curveSegments: 12,
                //bevelEnabled: true,
                //bevelThickness: 10,
                //bevelSize: 8,
                //bevelOffset: 0,
                //bevelSegments: 5
            } );
            var textMaterial = new MeshPhongMaterial({color: 0xFF0000, specular: 0xffffff});//new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
            var textMesh:Mesh = new Mesh(textGeometry, textMaterial);

            // var newGeo:Geometry = new Geometry();
            // textMesh.updateMatrix();
            // newGeo.merge(textGeometry, textMesh.matrix);
            
            // plane.updateMatrix();
            // newGeo.merge(planeGeo, plane.matrix);

            // singleMesh = new Mesh(newGeo, singleMaterial);

            //scene.add(singleMesh);
            scene.add(textMesh);

            var dirLight = new THREE.DirectionalLight( 0xffffff, 0.125 );
				dirLight.position.set( 0, 0, 1 ).normalize();
				scene.add( dirLight );
        } );

        this.sprite.position.set(x, y, 0);
        //scene.add(this.sprite);
        //scene.add(singleMesh);

    }

    render() {

    }

    update() {
        this.sprite.position.set(this.x, this.y, 0);
    }

    click() {

    }
}