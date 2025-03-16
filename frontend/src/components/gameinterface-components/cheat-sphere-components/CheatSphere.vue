<<<<<<< HEAD
<template>
  <!-- This container can be inserted anywhere and is sized to 200vh x 200vh -->
  <div ref="container" class="three-container"></div>
</template>

<script setup>
import { defineProps, ref, onMounted, onUnmounted } from "vue";
import * as THREE from "three";

// Accept keymap as a prop with a default value
const props = defineProps({
  keymap: {
    type: Object,
    default: () => ({
      "a": "a",
      "b": "b",
      "c": "c",
      "d": "d",
      "e": "e",
      "f": "f",
      "g": "g",
      "h": "h",
      "i": "i",
      "j": "j",
      "k": "k",
      "l": "l",
      "m": "m",
      "n": "n",
      "o": "o",
      "p": "p",
      "q": "q",
      "r": "r",
      "s": "s",
      "t": "t",
      "u": "u",
      "v": "v",
      "w": "w",
      "x": "x",
      "y": "y",
      "z": "z"
    })
  }
});

// Constants
const CHAR_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUM_POINTS = CHAR_SET.length;

const SPHERE_RADIUS = 1;
const SPHERE_WIDTH_SEGMENTS = 8;
const SPHERE_HEIGHT_SEGMENTS = 8;

const CAMERA_FOV = 50;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 1000;
const CAMERA_Z_POSITION = 3;

const TEXT_COLOR = 0x000000; // base text color (black)
const SELECTED_TEXT_COLOR = 0xffffff; // white

const TEXT_CANVAS_WIDTH = 128;
const TEXT_CANVAS_HEIGHT = 128;
const FONT_STYLE = "bold 40px Arial";
const TEXT_FILL_STYLE = "white";
const TEXT_POSITION_SCALE = 1.1;

// Timing constants
const SWAP_INTERVAL_MS = 10000;
const FADE_DURATION_MS = 1000;         // used for letter swap fade
const LINE_FADE_DURATION = 20000;        // duration for line fade (ms)
const LABEL_FADE_DURATION = 20000;       // duration for label color fade (ms)

const ROTATION_INTERPOLATION_FACTOR = 0.05;
const ROTATION_THRESHOLD = 0.001;

const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

// Variables
const container = ref(null);
let scene, camera, renderer, sphereContainer;
const points = [];
let targetQuaternion = null; // for sphere rotation when a key is pressed
let swapInterval = null;
let swapInProgress = false;
// Object to track active label fade animations; key is letter (uppercase) and value is the timestamp when activated.
const activeLabelFades = {};

// Initialize the scene
const init = () => {
  scene = new THREE.Scene();

  // Setup renderer with transparent background
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  container.value.appendChild(renderer.domElement);

  // Setup camera with aspect ratio based on container
  camera = new THREE.PerspectiveCamera(
    CAMERA_FOV,
    container.value.clientWidth / container.value.clientHeight,
    CAMERA_NEAR,
    CAMERA_FAR
  );
  camera.position.set(0, 0, CAMERA_Z_POSITION);
  camera.lookAt(0, 0, 0);

  // Create a container that holds the sphere and its labels
  sphereContainer = new THREE.Object3D();
  scene.add(sphereContainer);

  // Create a wireframe sphere in light grey
  const geometry = new THREE.SphereGeometry(SPHERE_RADIUS, SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS);
  const wireframe = new THREE.WireframeGeometry(geometry);
  const lineMaterial = new THREE.LineBasicMaterial({ color: TEXT_COLOR });
  const sphere = new THREE.LineSegments(wireframe, lineMaterial);
  sphereContainer.add(sphere);

  // Generate equidistant points and add letter sprites
  for (let i = 0; i < NUM_POINTS; i++) {
    const y = 1 - (i / (NUM_POINTS - 1)) * 2; // y goes from 1 to -1
    const radius = Math.sqrt(1 - y * y);
    const theta = 2 * Math.PI * i * GOLDEN_RATIO;
    const x = radius * Math.cos(theta);
    const z = radius * Math.sin(theta);
    // Position the label slightly outside the sphere using the scale factor
    const pos = new THREE.Vector3(x * TEXT_POSITION_SCALE, y * TEXT_POSITION_SCALE, z * TEXT_POSITION_SCALE);

    const sprite = createTextSprite(CHAR_SET[i]);
    sprite.position.copy(pos);
    // Store the corresponding character for later reference
    sprite.userData.char = CHAR_SET[i];
    sphereContainer.add(sprite);

    points.push({ char: CHAR_SET[i], position: pos.clone(), sprite });
  }

  animate();
};

const createTextSprite = (text) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = TEXT_CANVAS_WIDTH;
  canvas.height = TEXT_CANVAS_HEIGHT;

  // Draw the text in white so that the material's color tint is applied
  ctx.fillStyle = TEXT_FILL_STYLE;
  ctx.font = FONT_STYLE;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  // Use the material's color to tint the texture (default is base text color)
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 1,
    color: TEXT_COLOR,
  });
  return new THREE.Sprite(spriteMaterial);
};

const animate = () => {
  requestAnimationFrame(animate);

  // Smoothly interpolate toward a target rotation if set
  if (targetQuaternion) {
    sphereContainer.quaternion.slerp(targetQuaternion, ROTATION_INTERPOLATION_FACTOR);
    if (sphereContainer.quaternion.angleTo(targetQuaternion) < ROTATION_THRESHOLD) {
      sphereContainer.quaternion.copy(targetQuaternion);
      targetQuaternion = null;
    }
  }

  // Update sprite colors based on active label fades.
  // If a sprite is currently fading, interpolate its color from white to the base color.
  points.forEach(point => {
    const char = point.char;
    if (activeLabelFades[char]) {
      const elapsed = performance.now() - activeLabelFades[char];
      let t = Math.min(elapsed / LABEL_FADE_DURATION, 1);
      const newColor = new THREE.Color(SELECTED_TEXT_COLOR).lerp(new THREE.Color(TEXT_COLOR), t);
      point.sprite.material.color.set(newColor);
      if (t >= 1) {
        delete activeLabelFades[char];
      }
    } else {
      point.sprite.material.color.set(TEXT_COLOR);
    }
  });

  renderer.render(scene, camera);
};

/**
 * Animate an object's opacity from a start value to an end value over the given duration.
 */
const animateOpacity = (object, start, end, duration, callback) => {
  const startTime = performance.now();
  const update = () => {
    const elapsed = performance.now() - startTime;
    let t = elapsed / duration;
    if (t > 1) t = 1;
    object.material.opacity = start + (end - start) * t;
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

  // Fade out both sprites over FADE_DURATION_MS
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

      // Fade in both sprites over FADE_DURATION_MS
      let fadeInCompleted = 0;
      const onFadeInComplete = () => {
        fadeInCompleted++;
        if (fadeInCompleted === 2) {
          swapInProgress = false;
        }
      };
      animateOpacity(sprite1, 0, 1, FADE_DURATION_MS, onFadeInComplete);
      animateOpacity(sprite2, 0, 1, FADE_DURATION_MS, onFadeInComplete);
    }
  };

  animateOpacity(sprite1, 1, 0, FADE_DURATION_MS, onFadeOutComplete);
  animateOpacity(sprite2, 1, 0, FADE_DURATION_MS, onFadeOutComplete);
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
 * Additionally, if a mapping exists in the keymap prop, draw a line between the pressed letter and its corresponding letter,
 * and animate both labels so that they turn white and then fade back to the base color.
 */
const onKeyPress = (event) => {
  const key = event.key.toUpperCase();
  if (!CHAR_SET.includes(key)) return;

  const keyLower = event.key.toLowerCase();
  if (props.keymap.hasOwnProperty(keyLower)) {
    const targetKeyLower = props.keymap[keyLower];
    const targetKeyUpper = targetKeyLower.toUpperCase();
    // Find the sprite for the pressed key and its corresponding key
    const pressedPoint = points.find(p => p.char === key);
    const targetPoint = points.find(p => p.char === targetKeyUpper);
    if (pressedPoint && targetPoint) {
      // Create a line geometry between the two sprite positions
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        pressedPoint.sprite.position.clone(),
        targetPoint.sprite.position.clone()
      ]);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: SELECTED_TEXT_COLOR,
        transparent: true,
        opacity: 1
      });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      sphereContainer.add(line);
      // Fade out the line over LINE_FADE_DURATION and then remove it
      animateOpacity(line, 1, 0, LINE_FADE_DURATION, () => {
        sphereContainer.remove(line);
        lineGeometry.dispose();
        lineMaterial.dispose();
      });
      // Mark both labels to fade: they will start at white and fade back to the base color.
      activeLabelFades[pressedPoint.char] = performance.now();
      activeLabelFades[targetPoint.char] = performance.now();
    }
  }

  // Rotate sphere so that the pressed letter faces the camera
  const chosenLocal = getClosestVisiblePoint(key);
  if (chosenLocal) {
    // Get the current world position of the chosen letter
    const currentWorld = chosenLocal.clone().applyQuaternion(sphereContainer.quaternion);
    // We want that letter to face the camera; with a camera at (0,0,3) looking at (0,0,0),
    // the desired world direction is (0,0,1)
    const desiredWorld = new THREE.Vector3(0, 0, 1);
    const qDelta = new THREE.Quaternion().setFromUnitVectors(currentWorld, desiredWorld);
    targetQuaternion = qDelta.multiply(sphereContainer.quaternion);
  }
};

onMounted(() => {
  init();
  window.addEventListener("keydown", onKeyPress);
  // Trigger a random letter swap every SWAP_INTERVAL_MS
  swapInterval = setInterval(swapLettersRandom, SWAP_INTERVAL_MS);
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKeyPress);
  clearInterval(swapInterval);
  if (container.value && renderer.domElement.parentNode === container.value) {
    container.value.removeChild(renderer.domElement);
  }
});
</script>

<style>
/* The container is sized to 40vh by 40vh */
.three-container {
  width: 40vh;
  height: 40vh;
  position: relative;

  display:flex;
  justify-content: center;
  align-items: center;
}
</style>
=======
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
>>>>>>> jojorioch-frontend
