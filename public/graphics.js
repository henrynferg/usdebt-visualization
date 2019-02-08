let angle = 0;

const pennyThickness = 1.52e-6; // In km
var debtDollars = 0;
var called = false;

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
var pennyHeight = 0;
var drawPennies = false;

// initial diameter scale: Earth = 10
var sScale = 1.276e-3;
const originalSScale = 1.276e-3;

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

// distance scale: Sun->Earth = 100
var dScale = 1.472e-5;
const originalDScale = 1.472e-5;

const distances = [posSun, dMercury, dVenus, dEarth, dMars, dJupiter, dSaturn, dUranus, dNeptune];

// Rotational velocity (km/s)
const sunRV = 2.02;
const mercuryRV = 0.0030253;
const venusRV = 0.001811;
const earthRV = 0.4651;
const marsRV = 0.24073;
const jupiterRV = 12.572;
const saturnRV = 9.871;
const uranusRV = 2.5875;
const neptuneRV = 2.6829;

const rvScale = 2.15008e-4; // Earth = 0.0001

const rotationalVelocities = [sunRV, mercuryRV, venusRV, earthRV, marsRV, jupiterRV, saturnRV,
	uranusRV, neptuneRV];

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

var planets = [];

var cameraX = 0;

var lastX = 0;

var currentX = 0;

var clicking = false;

class Planet {
	constructor(orbitsAround, distance, diameter, texture, rv) {
		this.orbitsAround = orbitsAround;
		this.distance = distance;
		this.diameter = diameter;
		this.texture = texture;
		this.rv = rv;
		this.rotation = 0;
	}
}

class Sun {
	constructor(diameter, texture, rv) {
		this.diameter = diameter;
		this.texture = texture;
		this.distance = 20;
		this.rv = rv;
		this.rotation = 0;
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
}

var pennyRequest = function() {
	if(!called) {
		return fetch("/height").then(function(res) {
			res.json().then(function(data) {
				debtDollars = data.debt;
				pennyHeight = calculateDebtHeightPennies(data.debt);
				drawPennies = true;
				called = true;
			});
		});
	}
	else {
		return debtDollars;
	}
}

var calculateDebtHeightPennies = function(numDollars) {
    return pennyThickness * calculateNumPennies(numDollars);
}

var calculateNumPennies = function(numDollars) {
	return numDollars * 100;
}

var setup = function() {
	var goButton = document.getElementById("go");
	goButton.onclick = pennyRequest;
	createCanvas(window.screen.width, 720, WEBGL);
	sun = new Sun(0.1 * diameters[0], loadImage(texturePaths[0]), rotationalVelocities[0]);
	planets.push(sun);
	for(var i=1; i<diameters.length; i++) {
		var texture = loadImage(texturePaths[i]);
		planet = new Planet(sun, distances[i], diameters[i], texture, rotationalVelocities[i]);
		planets.push(planet);
	}
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
		rotateY(planet.rotation);
		planet.rotation += planet.rv * rvScale;
		planet.rotation %= 360;
		texture(planet.texture);
		sphere(planet.diameter * sScale);
		pop();
	}

	if(drawPennies) {
		push();
		fill(184, 115, 51);
		noStroke();
		translate(dScale * pennyHeight / 2 - cameraX, 0, 0);
		box(dScale * pennyHeight, 5, 5);
		pop();
	}
}