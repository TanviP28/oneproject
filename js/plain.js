import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Register GSAP plugins (assumes they are included globally)
gsap.registerPlugin(ScrollTrigger);

// Create and configure the Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// Setup lights
const topLight = new THREE.DirectionalLight(0xffffff, 5);
topLight.position.set(500, 500, 500);
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 1);
scene.add(ambientLight);

// Load and add 3D model to the scene
const loader = new GLTFLoader();
let object;

loader.load(
  'models/eye/scene.gltf',
  gltf => {
    object = gltf.scene;
    object.position.set(0,-10,0);
    scene.add(object);
    setupAnimation(); // Setup animations once the model is loaded
  },
  xhr => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
  error => console.error('An error happened', error)
);

// Configure camera controls
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 500;


// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Track mouse position
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

document.addEventListener("mousemove", e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

let startTime = Date.now(); // Record the start time
const rotationDuration = 10; // Duration for each rotation in seconds

function animate() {
  requestAnimationFrame(animate);
  
  const elapsedTime = (Date.now() - startTime) / 1000; // Time in seconds
  
  if (object) {
    // Determine the current rotation phase
    const phase = (elapsedTime % (3 * rotationDuration)) / rotationDuration;
    
    if (phase < 1) {
      // Rotate around the x-axis
      object.rotation.x = -1.2 + Math.sin(phase * Math.PI) * 2.5;
      object.rotation.y = -3;
      object.rotation.z = 0;
    } else if (phase < 2) {
      // Rotate around the y-axis
      const timeInPhase = phase - 1;
      object.rotation.x = -1.2;
      object.rotation.y = -3 + Math.sin(timeInPhase * Math.PI) * 3;
      object.rotation.z = 0;
    } else {
      // Continuous rotation around the z-axis
      const timeInPhase = phase - 2;
      object.rotation.x = -1.2;
      object.rotation.y = -3;
      object.rotation.z = timeInPhase * Math.PI / 2; // Adjust rotation speed as needed
    }
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();


// GSAP animations
function setupAnimation() {
  if (!object) {
    console.error("The 3D object is not loaded yet.");
    return;
  }

  gsap.fromTo('canvas', { x: "50%", autoAlpha: 0 }, { duration: 1, x: "0%", autoAlpha: 1 });
  gsap.to('.loading', { autoAlpha: 0 });
  gsap.to('.scroll-cta', { opacity: 1 });
  gsap.set('svg', { autoAlpha: 1 });


  gsap.to('.ground', {
    y: "30%",
    scrollTrigger: { trigger: ".ground-container", scrub: true, start: "top bottom", end: "bottom top" }
  });

  gsap.from('.clouds', {
    y: "25%",
    scrollTrigger: { trigger: ".ground-container", scrub: true, start: "top bottom", end: "bottom top" }
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".content",
      scrub: true,
      start: "top top",
      end: "bottom bottom"
    },
    defaults: { duration: 1, ease: 'power2.inOut' }
  });

  let delay = 0;

  tl.to('.scroll-cta', { duration: 0.25, opacity: 0 }, delay)
    .to(object.position, { x: -30, ease: 'power1.in' }, delay)
    .to(object.rotation, { x: Math.PI * 0.25, y: 0, z: -Math.PI * 0.05, ease: 'power1.inOut' }, delay)
    .to(object.position, { x: -90, y: 0, z: -60, ease: 'power1.inOut' }, delay)
    .to(object.rotation, { x: Math.PI * 0.25, y: 0, z: Math.PI * 0.05, ease: 'power3.inOut' }, delay + 1)
    .to(object.position, { x: 40, y: 0, z: -60, ease: 'power2.inOut' }, delay + 1)
    .to(object.rotation, { x: Math.PI * 0.2, y: 0, z: -Math.PI * 0.1, ease: 'power3.inOut' }, delay + 2)
    .to(object.position, { x: -40, y: 0, z: -30, ease: 'power2.inOut' }, delay + 2)
    .to(object.rotation, { x: 0, z: 0, y: Math.PI * 0.25 }, delay + 3)
    .to(object.position, { x: 0, y: -10, z: 50 }, delay + 3)
    .to(object.rotation, { x: Math.PI * 0.25, y: Math.PI * 0.5, z: 0, ease: 'power4.inOut' }, delay + 5)
    .to(object.position, { z: 30, ease: 'power4.inOut' }, delay + 5)
    .to(object.rotation, { x: Math.PI * 0.25, y: Math.PI * 0.5, z: 0, ease: 'power4.inOut' }, delay + 6)
    .to(object.position, { z: 60, x: 30, ease: 'power4.inOut' }, delay + 6)
    .to(object.rotation, { x: Math.PI * 0.35, y: Math.PI * 0.75, z: Math.PI * 0.6, ease: 'power4.inOut' }, delay + 7)
    .to(object.position, { z: 100, x: 20, y: 0, ease: 'power4.inOut' }, delay + 7)
    .to(object.rotation, { x: Math.PI * 0.15, y: Math.PI * 0.85, z: -Math.PI * 0.0, ease: 'power1.in' }, delay + 8)
    .to(object.position, { z: -150, x: 0, y: 0, ease: 'power1.inOut' }, delay + 8)
    .to(object.rotation, { duration: 1, x: -Math.PI * 0.05, y: Math.PI, z: -Math.PI * 0.1, ease: 'none' }, delay + 9)
    .to(object.position, { duration: 1, x: 0, y: 30, z: 200, ease: 'power1.in' }, delay + 9);
}
