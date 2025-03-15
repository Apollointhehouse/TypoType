<script setup>
import { onMounted, onUnmounted } from "vue";
import * as THREE from "three";

let scene, camera, renderer, sphereContainer;
const points = [];
const charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numPoints = charSet.length;
let targetQuaternion = null; // for sphere rotation when a key is pressed
let swapInterval = null;
let swapInProgress = false;

const init = () => {
  scene = new THREE.Scene();

  // Setup renderer with transparent background
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Setup camera
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 3);
  camera.lookAt(0, 0, 0);

  // Create a container that holds the sphere and its labels
  sphereContainer = new THREE.Object3D();
  scene.add(sphereContainer);

  // Create a wireframe sphere with reduced density
  const geometry = new THREE.SphereGeometry(1, 8, 8);
  const wireframe = new THREE.WireframeGeometry(geometry);
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
  const sphere = new THREE.LineSegments(wireframe, lineMaterial);
  sphereContainer.add(sphere);

  // Generate equidistant points and add letter sprites (no red markers)
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  for (let i = 0; i < numPoints; i++) {
    const y = 1 - (i / (numPoints - 1)) * 2; // y goes from 1 to -1
    const radius = Math.sqrt(1 - y * y);
    const theta = 2 * Math.PI * i * goldenRatio;
    const x = radius * Math.cos(theta);
    const z = radius * Math.sin(theta);
    // Position the label slightly outside the sphere
    const pos = new THREE.Vector3(x * 1.1, y * 1.1, z * 1.1);

    const sprite = createTextSprite(charSet[i]);
    sprite.position.copy(pos);
    sphereContainer.add(sprite);

    // Save each point with its letter, its position, and its sprite
    points.push({ char: charSet[i], position: pos.clone(), sprite });
  }

  animate();
};

const createTextSprite = (text) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 128;
  canvas.height = 128;

  ctx.fillStyle = "white";
  ctx.font = "bold 40px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  // Enable transparency for fade animations
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 1,
  });
  return new THREE.Sprite(spriteMaterial);
};

const animate = () => {
  requestAnimationFrame(animate);

  // Smoothly interpolate toward a target rotation if set
  if (targetQuaternion) {
    sphereContainer.quaternion.slerp(targetQuaternion, 0.05);
    if (sphereContainer.quaternion.angleTo(targetQuaternion) < 0.001) {
      sphereContainer.quaternion.copy(targetQuaternion);
      targetQuaternion = null;
    }
  }

  renderer.render(scene, camera);
};

/**
 * Animate a sprite's opacity from a start value to an end value over the given duration.
 */
const animateOpacity = (sprite, start, end, duration, callback) => {
  const startTime = performance.now();
  const update = () => {
    const elapsed = performance.now() - startTime;
    let t = elapsed / duration;
    if (t > 1) t = 1;
    sprite.material.opacity = start + (end - start) * t;
    if (t < 1) {
      requestAnimationFrame(update);
    } else {
      if (callback) callback();
    }
  };
  requestAnimationFrame(update);
};

/**
 * Swap the positions of two letter sprites (and update their stored positions) with fade out/in animations.
 */
const swapLettersIndices = (i, j) => {
  if (swapInProgress) return;
  swapInProgress = true;

  const sprite1 = points[i].sprite;
  const sprite2 = points[j].sprite;

  // Fade out both sprites over 250ms
  let fadeOutCompleted = 0;
  const onFadeOutComplete = () => {
    fadeOutCompleted++;
    if (fadeOutCompleted === 2) {
      // After fade-out, swap positions
      const pos1 = sprite1.position.clone();
      const pos2 = sprite2.position.clone();

      sprite1.position.copy(pos2);
      sprite2.position.copy(pos1);

      // Swap the stored positions in the points array
      const tempPos = points[i].position.clone();
      points[i].position.copy(points[j].position);
      points[j].position.copy(tempPos);

      // Fade in both sprites over 250ms
      let fadeInCompleted = 0;
      const onFadeInComplete = () => {
        fadeInCompleted++;
        if (fadeInCompleted === 2) {
          swapInProgress = false;
        }
      };
      animateOpacity(sprite1, 0, 1, 250, onFadeInComplete);
      animateOpacity(sprite2, 0, 1, 250, onFadeInComplete);
    }
  };

  animateOpacity(sprite1, 1, 0, 250, onFadeOutComplete);
  animateOpacity(sprite2, 1, 0, 250, onFadeOutComplete);
};

const swapLettersRandom = () => {
  if (swapInProgress) return;
  if (points.length < 2) return;
  const i = Math.floor(Math.random() * points.length);
  let j = Math.floor(Math.random() * points.length);
  while (j === i) {
    j = Math.floor(Math.random() * points.length);
  }
  swapLettersIndices(i, j);
};

/**
 * Returns the local position (unit vector) of the letter (matching the key) that is most visible to the camera.
 */
const getClosestVisiblePoint = (char) => {
  const relevantPoints = points.filter((p) => p.char === char);
  let chosen = null;
  let highestDot = -Infinity;

  relevantPoints.forEach((point) => {
    // Compute the world position by applying the sphere container's rotation to the stored local position
    const worldPos = point.position.clone().applyQuaternion(sphereContainer.quaternion);
    const cameraPos = new THREE.Vector3();
    camera.getWorldPosition(cameraPos);

    const camToPoint = worldPos.sub(cameraPos).normalize();
    const cameraForward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    const dot = camToPoint.dot(cameraForward);
    if (dot > highestDot) {
      highestDot = dot;
      chosen = point;
    }
  });

  return chosen ? chosen.position.clone().normalize() : null;
};

/**
 * When an alphabet key is pressed, rotate the sphere so that the corresponding letter comes in front.
 */
const onKeyPress = (event) => {
  const key = event.key.toUpperCase();
  if (!charSet.includes(key)) return;

  const chosenLocal = getClosestVisiblePoint(key);
  if (chosenLocal) {
    // Get the current world position of the chosen letter
    const currentWorld = chosenLocal.clone().applyQuaternion(sphereContainer.quaternion);
    // We want that letter to face the camera; with a camera at (0,0,3) looking at (0,0,0),
    // the desired world direction is (0,0,1)
    const desiredWorld = new THREE.Vector3(0, 0, 1);
    const qDelta = new THREE.Quaternion().setFromUnitVectors(
      currentWorld,
      desiredWorld
    );
    targetQuaternion = qDelta.multiply(sphereContainer.quaternion);
  }
};

onMounted(() => {
  init();
  window.addEventListener("keydown", onKeyPress);
  // Trigger a random letter swap every 500 milliseconds
  swapInterval = setInterval(swapLettersRandom, 500);
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKeyPress);
  clearInterval(swapInterval);
  document.body.removeChild(renderer.domElement);
});
</script>

<style>
body {
  margin: 0;
  overflow: hidden;
  background: transparent;
}
</style>
