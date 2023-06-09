import * as THREE from 'three';

import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AnimationClip, AnimationMixer } from "three";

import ThreeMeshUI from 'three-mesh-ui';
import VRControl from 'three-mesh-ui/examples/utils/VRControl.js';
import ShadowedLight from 'three-mesh-ui/examples/utils/ShadowedLight.js';

import FontJSON from 'three-mesh-ui/examples/assets/Roboto-msdf.json';
import FontImage from 'three-mesh-ui/examples/assets/Roboto-msdf.png';

import * as TextPanel from "./textPanel.js";
import * as NameRooms from "./roomInfo.js";
import * as dat from 'lil-gui'
import CANNON from 'cannon'


/**
 * Base
 */
// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color( 0x505050 );

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.name = "floor"
floor.castShadow = true;
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 50
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
// directionalLight.position.set(5, 5, 5)
directionalLight.position.set(5, 6, 3)
scene.add(directionalLight)

// gui.add(directionalLight.shadow.camera, 'far').min(0).max(50).step(0.01).name('Shadow camera far')
// gui.add(directionalLight.shadow.camera, 'left').min(0).max(50).step(0.01).name('Shadow camera left')
// gui.add(directionalLight.shadow.camera, 'top').min(0).max(50).step(0.01).name('Shadow camera top')
// gui.add(directionalLight.shadow.camera, 'right').min(0).max(50).step(0.01).name('Shadow camera right')
// gui.add(directionalLight.shadow.camera, 'bottom').min(0).max(50).step(0.01).name('Shadow camera bottom')
// gui.add(directionalLight.position, 'x').min(0).max(50).step(0.01).name('Light.position X')
// gui.add(directionalLight.position, 'y').min(0).max(50).step(0.01).name('Light.position Y')
// gui.add(directionalLight.position, 'z').min(0).max(50).step(0.01).name('Light.position Z')



const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

// const light = ShadowedLight( {
// 	z: 10,
// 	width: 6,
// 	bias: -0.0001
// } );

// const hemLight = new THREE.HemisphereLight( 0x808080, 0x606060 );

// scene.add( light, hemLight );

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
	renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = true;
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set( 0, 1.6, 0 );
scene.add(camera)

// Controls
const controls = new OrbitControls( camera, canvas );
controls.target = new THREE.Vector3( 0, 1, -1.8 );
// controls.minDistance = 1; 
// controls.maxDistance = 2;
controls.enableDamping = true

// controls.maxAzimuthAngle = Math.PI / 6;
// controls.minAzimuthAngle = - Math.PI / 6; 
// controls.maxPolarAngle = 1.5;
// controls.minPolarAngle = Math.PI / 5;

/**
 * Imported models
 */
// Room
const room = new THREE.LineSegments(
	new BoxLineGeometry( 60, 6, 6, 100, 10, 10 ).translate( 0, 3, 0 ),
	new THREE.LineBasicMaterial( { color: 0x808080 } )
);
room.receiveShadow = true
scene.add( room );

// Box ( jump )
const geometry = new THREE.BoxGeometry( 0.5, 1, 1 ); 
const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
const cube = new THREE.Mesh( geometry, material ); 
cube.name = "cube"
cube.position.set(3, 0, -1.9)
scene.add( cube );

// Box ( avatar )
const geometryTest = new THREE.BoxGeometry( 0.5, 1.9, 0.5 ); 
const materialTest = new THREE.MeshBasicMaterial( {
	color: 0x00ff00, 
	wireframe: true,
	// opacity: 0
} ); 
const cubeTest = new THREE.Mesh( geometryTest, materialTest ); 
cubeTest.position.set(0, 0.97, -1.9)
cubeTest.name = "cubetest"
scene.add( cubeTest );

// Personnage
let mixerPaul = null
let cvBook = null

// Instantiate a loader
const loader = new GLTFLoader();

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( '/examples/jsm/libs/draco/' );
loader.setDRACOLoader( dracoLoader );

let stay, run, jump;

let enterPressed = false;
let isJump = false;

// Load a glTF 
loader.load(
	'https://paulmarechal.xyz/test/paulFbx/paulMixAnim.gltf',

	function ( gltf ) {
		gltf.animations; 
		gltf.scene; 
		gltf.scenes; 
		gltf.cameras;
		gltf.asset; 
		// gltf.scene.scale.set(0.9, 0.9, 0.9); 
		gltf.scene.position.set( 0, 0, -1.9 );
		mixerPaul = new THREE.AnimationMixer(gltf.scene)
		stay = mixerPaul.clipAction(gltf.animations[2])
		run = mixerPaul.clipAction(gltf.animations[1])
		jump = mixerPaul.clipAction(gltf.animations[0])
		gltf.receiveShadow = true;
		gltf.castShadow = true;
		gltf.name = "Paul"

		gltf.scene.traverse( function( node ) {

			if ( node.isMesh ) { node.castShadow = true; }
	
		} );
	
		scene.add( gltf.scene );

		// console.log(gltf)
		stay.play()

		const log = document.getElementById('log');

		document.addEventListener('keypress', logKey);

		function logKey(e) {
			enterPressed = true;
			// Touche enter pressed
			if (e.keyCode === 13) { 
				enterPressed = true;
				run.play();
			// Else if space is pressed
			} else if (enterPressed && e.keyCode === 32) { 

				function updateJump(){
					run.stop();
					jump.play();
					const startTime = clock.getElapsedTime();
					const jumpDuration = 0.9; // Jump time in second
					function animateJump() {
					  	const timeElapsed = clock.getElapsedTime() - startTime;
						isJump = true;

						const jumpHeight = Math.max(0, Math.sin(timeElapsed / jumpDuration * Math.PI) * 1.3);
						gltf.scene.position.y = jumpHeight;
					  	cubeTest.position.y = jumpHeight + 1
	
					 	if (timeElapsed >= jumpDuration) {
							jump.stop();
							run.play();
							isJump = false
							return;
					  	}
					 	requestAnimationFrame(animateJump);
					}
					animateJump();
				}
				updateJump();
				  
			} else {
				// Else stay
				stay.play();
			}
		}
		  
	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);

// CV book
loader.load(
	// resource URL
	'https://paulmarechal.xyz/test/paulFbx/book3.glb',
	// called when the resource is loaded
	function ( gltf ) {
		gltf.scene.position.set(1, 0, -1.9)
		gltf.scene.scale.set(0.2, 0.2, 0.2);
		gltf.receiveShadow = true;
		gltf.castShadow = true;

		// gui.add(gltf.scene.rotation, 'x').min(0).max(50).step(0.01).name('Light.position X')
		// gui.add(gltf.scene.rotation, 'y').min(0).max(50).step(0.01).name('Light.position Y')
		// gui.add(gltf.scene.rotation, 'z').min(0).max(50).step(0.01).name('Light.position Z')

		gltf.scene.traverse( function( node ) {

			if ( node.isMesh ) { node.castShadow = true; }
	
		} );
		
		cvBook = gltf.scene
		scene.add(gltf.scene);
	}
);


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas, 
	antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()
let previousTime = 0
let sceneObjects = null
let gltfXPosition = 0


const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
	
	// console.log(scene.child[7])

	function handleKeyPress(e) {
		sceneObjects = scene.children.filter(child => child.name === "Scene" || child.name === "cubetest");

		// console.log(sceneObjects[1].position)

		if (cvBook !== null && e.keyCode === 13) {
	  
			let rotationY = 0;
			let posXs = sceneObjects.map(obj => obj.position.x); 
			let camPos = 5
			let stopMovement = false;

			function updatePosition() {
				if (cvBook.position.y >= 0.4950) {
					cvBook.position.y = Math.sin(clock.getElapsedTime()) * 0.3 + 0.8;
				} else {
					cvBook.position.y = Math.sin(clock.getElapsedTime()) * 0.5 + 0.5;
				}
				
				// Rotation 3D models ( book + avatar)
				rotationY += 0.01;
				if (rotationY * 1.55 < 1.55) {
					sceneObjects.forEach((obj, index) => {
						obj.rotation.y = Math.min(rotationY * 1.55, 1.55);
					});
				} else {
					
					if (cubeTestBox.max.x >= cubeBox.min.x && cubeTestBox.min.x <= cubeBox.max.x) {
						// console.log("yo touché")
						stopMovement = true;

						// return
						//run.stop();
						// Ajouter ça dans la boucle Tick ( stopMovement)

						
						// Si avatar touche le cube sur l'axe des X bloque le déplacement
					} else if(!stopMovement) {
						posXs = posXs.map(posX => posX + 0.03); 
						// console.log(posXs);
						// console.log(cubeTest)
						// cubeTest.position.x = cvBook.position.x - 1
						sceneObjects.forEach((obj, index) => {
							// console.log(obj)
							// Define new x position for each obj
							
							obj.position.x = posXs[index]; 
							// camera.position.set((posXs - 0.5), 1, 1);

							
							/*
							if(gltfXPosition != 0){
								// sceneObjects[1].position.x = gltfXPosition
								return
							}
							*/
							
						})
						
						if(gltfXPosition != 0){
							sceneObjects[2].position.x = gltfXPosition
							
						}
						
					}
				}
				
				controls.target.set((cvBook.position.x - 0.5), 1, - 1.8);
				camera.position.set((cvBook.position.x - 0.5), 1, 1);

				requestAnimationFrame(updatePosition);
			}
			updatePosition();
		}
	}
	  
	document.addEventListener('keypress', handleKeyPress);
	  
	if(mixerPaul !== null){
        mixerPaul.update(deltaTime)
    }

	const cubeBox = new THREE.Box3().setFromObject(cube);
	const cubeTestBox = new THREE.Box3().setFromObject(cubeTest);

	if(enterPressed == true){
		if (cubeTestBox.intersectsBox(cubeBox)) {
			if (cubeTestBox.max.y >= cubeBox.min.y && cubeTestBox.min.y <= cubeBox.max.y) {
				sceneObjects[2].position.y = cubeBox.max.y;
				if (!cubeTestBox.max.y >= cubeBox.min.y && !cubeTestBox.min.y <= cubeBox.max.y && sceneObjects[2].position.y !== 0.5) {
					sceneObjects[2].position.y = 0.5;
				}
			} if (cubeTestBox.max.x >= cubeBox.min.x && cubeTestBox.min.x <= cubeBox.max.x) {
				run.stop();
				stay.play();
				
				gltfXPosition = sceneObjects[2].position.x  
				console.log(gltfXPosition)
				
				// console.log(sceneObjects[2].position.x)
				// Si avatar touche le cube sur l'axe des X bloque le déplacement 
			} else {
				previousTime = elapsedTime;
				sceneObjects.splice(2, 1);
				gltfXPosition = sceneObjects[2].position.x
				run.stop();

				if(gltfXPosition > 0){
					sceneObjects[2].position.x = gltfXPosition
				}
			} 

			stay.play();
		} else {
			if (!isJump) {
				sceneObjects[2].position.y = 0;
			}	
		}
		
	}

	console.log(gltfXPosition)
	

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

