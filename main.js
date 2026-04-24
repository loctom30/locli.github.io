import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls, model;

init();
animate();

function init() {
    // 1. Scène
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);

    // 2. Caméra
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(10, 5, 10);

    // 3. Rendu (Renderer)
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // 4. Lumières
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);

    // 5. Contrôles de souris
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 6. Chargement du modèle (Placez votre fichier 'module.glb' dans le même dossier)
    const loader = new GLTFLoader();
    loader.load('module.glb', function (gltf) {
        model = gltf.scene;
        scene.add(model);
        
        // Centrer le modèle automatiquement
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        
    }, undefined, function (error) {
        console.error('Erreur lors du chargement :', error);
        alert('Fichier "module.glb" non trouvé. Lisez le fichier README.');
    });

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Fonctions interactives appelées par les boutons HTML
window.changeColor = function(colorHex) {
    if (!model) return;
    model.traverse((child) => {
        if (child.isMesh) {
            child.material.color.setHex(colorHex);
        }
    });
};

window.toggleVisibility = function(objectName) {
    if (!model) return;
    // Recherche un objet par son nom défini dans Vectorworks/Blender
    const obj = model.getObjectByName(objectName);
    if (obj) {
        obj.visible = !obj.visible;
    } else {
        alert("Objet '" + objectName + "' non trouvé. Vérifiez les noms dans votre fichier 3D.");
    }
};
