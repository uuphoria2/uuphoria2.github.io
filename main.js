import * as THREE from "./assets/lib/three.module.js"
import { GLTFLoader } from "./assets/lib/model_loader.js"

window.hideText = function() {
  document.getElementById("texts").hidden = !document.getElementById("texts").hidden
}
window.redirect = function(site) {
  window.location.href = `https://${site}`
}

window.addEventListener("keydown", e => {
  if (e.key == "Escape") window.hideText()
})

const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
let index = 0;

setInterval(() => {
  console.clear();
  console.log(
    `%ch%ci`, 
    `color: ${colors[index % colors.length]}; font-size: 35px;`, 
    `color: ${colors[(index + 1) % colors.length]}; font-size: 35px;`
  );
  index++;
}, 500);

// CREDITS TO AGENT-11 FOR THIS CODE AND THE LIBRARY.GLB FILE IN HIS CLASSIC GITHUB.IO
// Setup
const scene = new THREE.Scene()
scene.fog = new THREE.Fog(0x00, 1, 3700)

window.cameraObj = {
  fov: 60,
  rotation: 1.55
}

const speed = 1.5

const camera = new THREE.PerspectiveCamera(window.cameraObj.fov, window.innerWidth / window.innerHeight, 1, 5000)
camera.position.x = -800
camera.position.y = -120

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

//Dynamic scaling for widescreen
//Taken from maze95-js and modified a bit
window.addEventListener('resize', () =>
{
  // Update sizes
  const width = window.innerWidth
  const height = window.innerHeight

    // Update camera
  camera.aspect = width / height
  camera.updateProjectionMatrix()

    // Update renderer
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
scene.add(ambientLight)

//Variable for keeping track of library placement
let increment = 0

//Loads in a library model
function loadMap(xIncrement) {
  const loader = new GLTFLoader()
  loader.load("./resources/library.glb", function (gltf) {
    gltf.scene.position.y = -250
    gltf.scene.position.x = xIncrement
    scene.add(gltf.scene)
  })
}
loadMap()

//Places a library -949 intervals from the previous one on the X axis
function loadMapAhead() {
  increment += -949
  loadMap(increment)
}

//Initial loading
for (let i = 0; i < 4; i++) {
  loadMapAhead()
}

//Spawns in 2 new library geometries in front of you every 10 seconds
setInterval(function() {
  for (let i = 0; i < 1; i++) {
    loadMapAhead()
  }
}, 10000)

function animate() {
  requestAnimationFrame(animate)

  camera.position.x += -speed
  camera.rotation.y = window.cameraObj.rotation
  camera.fov = window.cameraObj.fov
  camera.updateProjectionMatrix()

  renderer.render(scene, camera)
}
animate()
