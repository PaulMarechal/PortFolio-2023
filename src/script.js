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


/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color( 0x505050 );

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
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
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls( camera, canvas );
camera.position.set( 0, 1.6, 0 );
controls.target = new THREE.Vector3( 0, 1, -1.8 );
controls.minDistance = 1; 
controls.maxDistance = 2;
controls.enableDamping = true

controls.maxAzimuthAngle = Math.PI / 6;
controls.minAzimuthAngle = - Math.PI / 6; 
controls.maxPolarAngle = 1.5;
controls.minPolarAngle = Math.PI / 5;

/**
 * Imported models
 */
// Room
const room = new THREE.LineSegments(
	new BoxLineGeometry( 6, 6, 6, 10, 10, 10 ).translate( 0, 3, 0 ),
	new THREE.LineBasicMaterial( { color: 0x808080 } )
);
room.receiveShadow = true
scene.add( room );

// Personnage
let mixerPaul = null
let cvBook = null

// Instantiate a loader
const loader = new GLTFLoader();

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( '/examples/jsm/libs/draco/' );
loader.setDRACOLoader( dracoLoader );

// Load a glTF 
loader.load(
	'https://paulmarechal.xyz/test/paulFbx/paulMixAnim.gltf',

	function ( gltf ) {
		gltf.animations; 
		gltf.scene; 
		gltf.scenes; 
		gltf.cameras;
		gltf.asset; 
		gltf.scene.scale.set(0.9, 0.9, 0.9); 
		gltf.scene.position.set( 0, 0, -1.9 );
		mixerPaul = new THREE.AnimationMixer(gltf.scene)
		const stay = mixerPaul.clipAction(gltf.animations[2])
		const run = mixerPaul.clipAction(gltf.animations[1])
		const jump = mixerPaul.clipAction(gltf.animations[0])
		gltf.receiveShadow = true;
		gltf.castShadow = true;

		gltf.scene.traverse( function( node ) {

			if ( node.isMesh ) { node.castShadow = true; }
	
		} );
	
		scene.add( gltf.scene );

		console.log(gltf)
		stay.play()

		const log = document.getElementById('log');

		document.addEventListener('keypress', logKey);

		let enterPressed = false;

		function logKey(e) {
			// Touche enter pressed
			if (e.keyCode === 13) { 
				enterPressed = true;
				run.play();
			// Else if space is pressed
			} else if (enterPressed && e.keyCode === 32) { 
				run.stop();
				jump.play();
				setTimeout(() => {
				jump.stop();
				}, 1930);
				run.play();
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
		scene.add( gltf.scene);
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

console.log(cvBook)

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

	// cube.position.y = Math.sin(clock.getElapsedTime()) * 0.5 + 0.5;

	function handleKeyPress(e) {
		if (cvBook !== null && e.keyCode === 13) {
			let rotationY = 0;
			function updatePosition() {
				cvBook.position.y = Math.sin(clock.getElapsedTime()) * 0.5 + 0.5;

				rotationY += 0.01;
				if (rotationY * 1.55 < 1.55) {
					cvBook.rotation.y = Math.min(rotationY * 1.55, 1.55);

				}
				requestAnimationFrame(updatePosition);
			}
			updatePosition();
		}
	}
	  
	document.addEventListener('keypress', handleKeyPress);
	  
	  
	  
	if(mixerPaul !== null){
        mixerPaul.update(deltaTime)
    }


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

