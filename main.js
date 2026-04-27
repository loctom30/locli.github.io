import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls, model;

init();
animate();

function init() {
    const container = document.getElementById('container3d');

    // Scène & Caméra
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf1f1f1);

    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(8, 5, 8);

    // Rendu
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lumières
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(5, 10, 7.5);
    scene.add(sunLight);

    // Contrôles
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Chargement du modèle GLB
    const loader = new GLTFLoader();
    loader.load('module.glb', (gltf) => {
        model = gltf.scene;
        model.rotation.x = Math.PI; // Pivote de 180 degrés
        model.rotation.y = Math.PI; // Pivote de 180 degrés
        scene.add(model);
        
        // Centrer l'objet
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
    });

    // Gestion de la taille (Scale)
    document.getElementById('sizeSelector').addEventListener('change', (e) => {
        const scale = parseFloat(e.target.value);
        if (model) model.scale.set(scale, 1, 1); // On étire sur l'axe X
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

// Fonction universelle pour changer la couleur d'une partie spécifique
window.changePartColor = (keyword, colorHex) => {
    if (!model) return;
    
    model.traverse((child) => {
        // On vérifie si l'objet est un Mesh et si son nom contient le mot-clé
        if (child.isMesh && child.name.includes(keyword)) {
            // Création d'un nouveau matériau pour ne pas modifier les autres objets
            // qui partageraient éventuellement le même matériau
            child.material = child.material.clone();
            child.material.color.setHex(colorHex);
        }
        if (child.name.includes('Menuiserie')) {
            child.material.metalness = 0.7; // Aspect métallique
            child.material.roughness = 0.2; // Aspect lisse/brillant
        }
    });
};

// On garde l'ancienne pour les murs en la redirigeant vers la nouvelle
window.changeColor = (colorHex) => {
    changePartColor('Paroi', colorHex);
};

window.toggleOption = (name) => {
    if (!model) return;
    model.traverse((child) => {
        if (child.name.includes(name)) {
            child.visible = !child.visible;
        }
    });
};
