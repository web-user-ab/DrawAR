import * as THREE from 'https://cdn.skypack.dev/three';
import { ARButton } from 'https://cdn.skypack.dev/three/examples/jsm/webxr/ARButton.js';

let camera, scene, renderer;
let controller;
let drawingPoints = [];
let line;

document.getElementById('startAR').addEventListener('click', () => {
  startAR();
  document.getElementById('startAR').style.display = 'none';
});

function startAR() {
  const container = document.body;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera();

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);

  // Request camera + AR permission through XRSession
  document.body.appendChild(ARButton.createButton(renderer, {
    requiredFeatures: ['hit-test']
  }));

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  light.position.set(0.5, 1, 0.25);
  scene.add(light);

  controller = renderer.xr.getController(0);
  controller.addEventListener('select', onSelect);
  scene.add(controller);

  animate();
}

function onSelect() {
  const position = new THREE.Vector3();
  position.setFromMatrixPosition(controller.matrixWorld);
  drawingPoints.push(position.clone());

  if (drawingPoints.length > 1) {
    if (line) scene.remove(line);
    const geometry = new THREE.BufferGeometry().setFromPoints(drawingPoints);
    const material = new THREE.LineBasicMaterial({ color: 0xffa500 });
    line = new THREE.Line(geometry, material);
    scene.add(line);
  }
}

function animate() {
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
}
