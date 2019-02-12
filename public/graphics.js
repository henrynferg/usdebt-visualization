let angle = 0;

const pennyThickness = 1.52e-6; // In km
const nickelThickness = 2e-6;
const dimeThickness = 1e-6;
const quarterThickness = 1.75e-6;

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
var lineLength = 0;
var lineColor = [0, 0, 0];

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

// Axial tilts (degrees)
const sunAT = 7.25;
const mercuryAT = 0.01;
const venusAT = 177.36;
const earthAT = 23.45;
const marsAT = 25.19;
const jupiterAT = 3.13;
const saturnAT = 26.73;
const uranusAT = 97.77;
const neptuneAT = 28.32;

const axialTilts = [sunAT, mercuryAT, venusAT, earthAT, marsAT, jupiterAT, saturnAT, uranusAT, neptuneAT];

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

class Coin {
	constructor(value, color, thickness) {
		this.value = value;
		this.color = color;
		this.thickness = thickness;
	}
	getDebtHeight(debtDollars) {
		return this.thickness * (1 / this.value) * debtDollars;
	}
}

class Planet {
	constructor(orbitsAround, distance, diameter, texture, rotationalVel, axialTilt) {
		this.orbitsAround = orbitsAround;
		this.distance = distance;
		this.diameter = diameter;
		this.texture = texture;
		this.rv = rotationalVel;
		this.at = axialTilt;
		this.rotation = 0;
	}
}

class Sun {
	constructor(diameter, texture, rv, at) {
		this.diameter = diameter;
		this.texture = texture;
		this.distance = 20;
		this.rv = rv;
		this.at = at;
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

var getDebt = function() {
	return new Promise(function(resolve, reject) { 
		fetch("/height").then(function(res) {
			res.json().then(function(data) {
				resolve(data.debt);
			});
		});
	});
}

var coinDebtHeight = function(coin) {
	return new Promise(function(resolve, reject) {
		getDebt().then(function(res) {
			resolve(coin.getDebtHeight(res));
		});
	});
}

var goButtonFn = function() {
	var e = document.getElementById("selection");
	var opt = e.options[e.selectedIndex].value;
	var coin;
	if(opt === "pennies") {
		coin = new Coin(0.01, [184, 115, 51], pennyThickness);
	}
	else if(opt === "nickels") {
		coin = new Coin(0.05, [70, 70, 70], nickelThickness);
	}
	else if(opt === "dimes") {
		coin = new Coin(0.1, [70, 70, 70], dimeThickness);
	}
	else if(opt === "quarters") {
		coin = new Coin(0.25, [70, 70, 70], quarterThickness);
	}
	else {
		coin = new Coin(0, [0, 0, 0], 0);
	}

	if(coin.value != 0) {
		coinDebtHeight(coin).then(function(res) {
			lineLength = res;
		});
	}
	else {
		lineLength = 0;
	}

	lineColor = coin.color;
}

var calculateNumQuarters = function(numDollars) {
	return numDollars * 4;
}

var calculateNumPennies = function(numDollars) {
	return numDollars * 100;
}

window.onload = function() {
	var goButton = document.getElementById("go");
	goButton.onclick = goButtonFn;
}

var setup = function() {
	createCanvas(window.screen.width, 720, WEBGL);
	sun = new Sun(0.1 * diameters[0], loadImage(texturePaths[0]), rotationalVelocities[0], axialTilts[0]);
	planets.push(sun);
	for(var i=1; i<diameters.length; i++) {
		var texture = loadImage(texturePaths[i]);
		planet = new Planet(sun, distances[i], diameters[i], texture, rotationalVelocities[i], axialTilts[i]);
		planets.push(planet);
	}
}

var draw = function() {
	if(mouseIsPressed) {
		cameraX -= currentX;
	}
	background(0);
	rectMode(CENTER);
	for(var planet of planets) {
		push();
		noStroke();
		fill(0, 0, 255);
		translate(dScale * (planet.distance-800) - cameraX, 0, 0);
		rotateZ(radians(planet.at));
		rotateY(planet.rotation);
		planet.rotation += planet.rv * rvScale;
		planet.rotation %= 360;
		texture(planet.texture);
		sphere(planet.diameter * sScale);
		pop();
	}

	push();
	fill(lineColor[0], lineColor[1], lineColor[2]);
	noStroke();
	translate(dScale * lineLength / 2 - cameraX, 0, 0);
	box(dScale * lineLength, 5, 5);
	pop();
}