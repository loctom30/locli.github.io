import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls, model;

init();
animate();

function init() {
    const container = document.getElementById('container3d');

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f8f8);

    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(10, 6, 10);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lumières
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(5, 10, 7.5);
    scene.add(sun);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Chargement
    const loader = new GLTFLoader();
    loader.load('module.glb', (gltf) => {
        model = gltf.scene;
        
        // Ajustement si l'objet arrive à l'envers (décommentez si besoin)
        // model.rotation.x = 0; 

        scene.add(model);
        
        // Centrage
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
    });

    // Event Dimensions
    document.getElementById('sizeSelector').addEventListener('change', (e) => {
        if (model) model.scale.set(parseFloat(e.target.value), 1, 1);
    });

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    const container = document.getElementById('container3d');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    renderer.render(scene, camera);
}

// FONCTION DE COULEUR PAR MOT-CLÉ
window.changePartColor = (keyword, hexColor) => {
    if (!model) return;
    model.traverse((child) => {
        if (child.isMesh && child.name.toLowerCase().includes(keyword.toLowerCase())) {
            // On clone le matériau pour ne pas affecter les autres objets
            child.material = child.material.clone();
            child.material.color.setHex(hexColor);
            
            // Si c'est une menuiserie, on ajoute un petit effet "Alu"
            if (keyword === 'Menuiserie') {
                child.material.metalness = 0.6;
                child.material.roughness = 0.2;
            }
        }
    });
};

window.toggleOption = (name) => {
    if (!model) return;
    model.traverse((child) => {
        if (child.name.includes(name)) child.visible = !child.visible;
    });
};
