let angle = 0;
let earthTexture;

// diameters in km
const sSun = 1.391016e6;
const sMercury = 4.88e3;
const sVenus = 1.21e4;
const sEarth = 1.276e4;
const sMars = 6.79e3;
const sJupiter = 1.43e5;
const sSaturn = 1.2e5;
const sUranus = 5.2e4;
const sNeptune = 4.84e4;

const diameters = [sSun, sMercury, sVenus, sEarth, sMars, sJupiter, sSaturn, sUranus, sNeptune];

// distance from Sun in km
const posSun = 0;
const dMercury = 5.22e7;
const dVenus = 1.081e8;
const dEarth = 1.472e8;
const dMars = 2.279e8;
const dJupiter = 7.785e8;
const dSaturn = 1.427e9;
const dUranus = 2.87e9;
const dNeptune = 4.497e9;

const distances = [posSun, dMercury, dVenus, dEarth, dMars, dJupiter, dSaturn, dUranus, dNeptune];

// Textures
const sunTexturePath = 'sun.jpg';
const mercuryTexturePath = 'mercury.jpg';
const venusTexturePath = 'venus.jpg';
const earthTexturePath = 'earth.jpg';
const marsTexturePath = 'mars.jpg';
const jupiterTexturePath = 'jupiter.jpg';
const saturnTexturePath = 'saturn.jpg';
const uranusTexturePath = 'uranus.jpg';
const neptuneTexturePath = 'neptune.jpg';

const texturePaths = [sunTexturePath, mercuryTexturePath, venusTexturePath, earthTexturePath, marsTexturePath, 
	jupiterTexturePath, saturnTexturePath, uranusTexturePath, neptuneTexturePath];

// diameter scale: Earth = 10
const sunScale = 1.276e-4;

var sScale = 1.276e-3;
const originalSScale = 1.276e-3;

// distance scale: Sun->Earth = 100
var dScale = 1.472e-5;
const originalDScale = 1.472e-5;

var planets = [];

var cameraX = 0;

var lastX = 0;

var currentX = 0;

var clicking = false;

class Planet {
	constructor(orbitsAround, distance, diameter, texture) {
		this.orbitsAround = orbitsAround;
		this.distance = distance;
		this.diameter = diameter;
		this.texture = texture;
	}
}

class Sun {
	constructor(diameter, texture) {
		this.diameter = diameter;
		this.texture = texture;
		this.distance = 20;
	}
}

var setup = function() {
	createCanvas(window.screen.width, 720, WEBGL);
	sun = new Sun(diameters[0] * 0.1, loadImage(texturePaths[0])); // Sun's too large, need to scale down ~.1
	planets.push(sun);
	for(var i=1; i<diameters.length; i++) {
		var texture = loadImage(texturePaths[i]);
		console.log(texture);
		planet = new Planet(sun, distances[i], diameters[i], texture);
		planets.push(planet);
	}
}

var mousePressed = function(event) {
	clicking = true;
	lastX = event.x;
}

var mouseDragged = function(event) {
	if(clicking) {
		currentX = (event.x - lastX) / 5;
	}
}

var mouseWheel = function(event) {
	const delta = event.delta > 0 ? 1 : -1;
	sScale *= 1 - delta * 0.1;
	dScale *= 1 - delta * 0.1;
	cameraX *= 1 - delta * 0.1;
	//sScale = sScale - event.delta * originalSScale / 800;
	//dScale = dScale - event.delta * originalDScale / 800;
	//cameraX += event.x * (dScale / originalDScale);
}

var draw = function() {
	if(mouseIsPressed) {
		cameraX -= currentX;
	}
	background(220);
	rectMode(CENTER);
	for(var planet of planets) {
		push();
		noStroke();
		fill(0, 0, 255);
		translate(dScale * (planet.distance-800) - cameraX, 0, 0);
		rotateY(angle);
		rotateY(90);
		texture(planet.texture);
		sphere(planet.diameter * sScale);
		angle += 0.0001;
		pop();
	}
}