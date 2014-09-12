
var Game = function() {
	this.init();
};


Game.prototype = {

	audio: '',
	color: '#ffffff',
	activeType: '',
	canvas: {
		width: 600,
		height: 400,
		elem: document.querySelector('#canvas')
	},
	ctx: '',
	enemyProps: {
		width: 30,
		height: 30,
		types: ['sine', 'triangle', 'square', 'sawtooth'],
		number: 20
	},
	enemies: [],
	player: {
		x: 20,
		y: 40,
		width: 30,
		height: 30,
		color: '#000000',
		speed: 1
	},
	rAFid: null,

	init: function() {
		this.audio = new AudioHack();
		//this.audio.setGain(0.8);

		this.canvas.elem.width = this.canvas.width;
		this.canvas.elem.height = this.canvas.height;
		this.ctx = this.canvas.elem.getContext('2d');
		// handy fillCircle function
		this.ctx.fillCircle = function(x, y, radius, fillColor) {
			this.fillStyle = fillColor;
			this.beginPath();
			this.moveTo(x, y);
			this.arc(x, y, radius, 0, Math.PI*2, false);
			this.fill();
		};
		this.populateEnemies();

		this.gameLoop();
	},
	populateEnemies: function() {
		var self = this;
		for (var i = 0; i < self.enemyProps.number; i++) {
			self.enemies[i] = [];
			self.enemies[i].push(self.canvas.width + self.randomNumber(40, 600));
			self.enemies[i].push(self.randomNumber(80, 320));
			self.enemies[i].push(self.pickRandom(self.enemyProps.types));
			self.enemies[i].push(true);
		};
		console.log(self.enemies);
	},
	gameLoop: function() {
		var self = this;
		this.rAFid = window.requestAnimationFrame(function() {
			self.gameLoop();
		});
		//this.updatePanel(); // update HUB
		this.draw(); // drawing
		this.compute();
	},
	draw: function() {
		this.clear();
		this.drawStage();
		this.drawEnemies();
		this.drawPlayer();
	},
	clear: function() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	drawStage: function() {
		this.ctx.strokeStyle = '#986864';
		this.ctx.beginPath();
		this.ctx.moveTo(0, 40);
		this.ctx.lineTo(this.canvas.width, 40);
		this.ctx.stroke();
		this.ctx.moveTo(0, this.canvas.height - 40);
		this.ctx.lineTo(this.canvas.width, this.canvas.height - 40);
		this.ctx.stroke();
	},
	drawPlayer: function() {
		this.ctx.strokeStyle = this.player.color;
		this.ctx.fillStyle = this.player.color;

		this.ctx.beginPath();
		this.ctx.moveTo(this.player.x, this.player.y);
		this.ctx.lineTo(this.player.x, this.player.y + this.player.height);
		this.ctx.lineTo(this.player.x + this.player.width, this.player.y + (this.player.height * 0.5));
		this.ctx.lineTo(this.player.x, this.player.y);
		this.ctx.fill();
	},
	drawEnemies: function() {
		var self = this;
		for (var i = 0; i < self.enemies.length; i++) {

			self.ctx.lineWidth = 5;
			this.ctx.lineJoin = 'round';
			if (self.enemies[i][2] === 'square') {
				self.drawSquare(self.enemies[i][0], self.enemies[i][1], self.enemyProps.width, self.enemyProps.height);
			} else if (self.enemies[i][2] === 'triangle') {
				self.drawTriangle(self.enemies[i][0], self.enemies[i][1], self.enemyProps.width, self.enemyProps.height);
			} else if (self.enemies[i][2] === 'sawtooth') {
				self.drawSawtooth(self.enemies[i][0], self.enemies[i][1], self.enemyProps.width, self.enemyProps.height);
			} else if (self.enemies[i][2] === 'sine') {
				self.drawSine(self.enemies[i][0], self.enemies[i][1], self.enemyProps.width, self.enemyProps.height);
			}
		};
	},
	drawSquare: function(x, y, w, h) {
		this.ctx.beginPath();
		this.ctx.moveTo(x, y);
		this.ctx.lineTo(x, y - h);
		this.ctx.lineTo(x - w, y - h);
		this.ctx.lineTo(x - w, y);
		this.ctx.stroke();
	},
	drawTriangle: function(x, y, w, h) {
		this.ctx.beginPath();
		this.ctx.moveTo(x, y);
		this.ctx.lineTo(x - (w / 2), y - h);
		this.ctx.lineTo(x - w, y);
		this.ctx.stroke();
	},
	drawSawtooth: function(x, y, w, h) {
		this.ctx.beginPath();
		this.ctx.moveTo(x, y);
		this.ctx.lineTo(x, y - h);
		this.ctx.lineTo(x - w, y);
		this.ctx.stroke();
	},
	drawSine: function(x, y, w, h) {
		this.ctx.beginPath();
		this.ctx.moveTo(x, y);
		this.ctx.bezierCurveTo(x - 10, y - 40, (x - w) + 10, y - 40, x - w, y);
		this.ctx.stroke();
	},
	compute: function() {

		this.updateActiveType();
		this.updateColors();
		this.updatePlayer();
		this.updateEnemies();
	},
	updateColors: function() {

		if (this.activeType !== false) {
			if (this.activeType === 'sine') {
				this.ctx.strokeStyle = '#ff00ff';
			} else if (this.activeType === 'triangle') {
				this.ctx.strokeStyle = '#ff0000';
			} else if (this.activeType === 'sawtooth') {
				this.ctx.strokeStyle = '#ffff00';
			} else if (this.activeType === 'square') {
				this.ctx.strokeStyle = '#ff0000';
			}
		}
	},
	updateActiveType: function() {
		var type = this.audio.getType();
		this.activeType = type;
	},
	updatePlayer: function() {
		if (this.player.y > this.canvas.height - 40 - this.player.height) {
			this.player.speed = -1;
		}
		if (this.player.y < 40) {
			this.player.speed = 1;
		}
		this.player.y = this.player.y + (this.player.speed * 1);
	},
	updateEnemies: function() {
		var self = this;

		for (var i = 0; i < self.enemies.length; i++) {

			if (self.enemies[i][0] < 0) {
				self.enemies[i][3] = false;
			}
			if (self.enemies[i][3] === true) {
				self.enemies[i][0] = self.enemies[i][0] - 1;
			} else {
				self.enemies[i][0] = self.canvas.width + self.pickRandom([30, 50, 90, 120]);
				self.enemies[i][1] = self.pickRandom([80, 110, 140, 170, 200, 230, 260, 290, 320]);
				self.enemies[i][2] = self.pickRandom(self.enemyProps.types)
				self.enemies[i][3] = true;
			}
		};
	},
	pickRandom: function(array) {
		return array[Math.floor(Math.random() * array.length)];
	},
	randomNumber: function(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	}

}