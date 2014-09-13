
var Game = function() {
	this.init();
};


Game.prototype = {

	audio: '',
	defaultColor: '#333333',
	color: '#333333',
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
		number: 36
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
	score: 0,

	init: function() {
		this.audio = new AudioHack();
		this.actions();
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
			self.enemies[i].push(self.randomNumber(1, 4));
		}
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
		this.drawHUD();
	},
	clear: function() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	drawHUD: function() {
		this.ctx.fillStyle = this.player.color;
		this.ctx.font = "300 24px IMPACT";
		this.ctx.fillText(this.score, 5, 30);
	},
	drawStage: function() {
		this.ctx.strokeStyle = this.color;
		this.ctx.beginPath();
		this.ctx.moveTo(0, 40);
		this.ctx.lineTo(this.canvas.width, 40);
		this.ctx.stroke();
		this.ctx.moveTo(0, this.canvas.height - 40);
		this.ctx.lineTo(this.canvas.width, this.canvas.height - 40);
		this.ctx.stroke();

		this.ctx.fillStyle = '#666666';
		this.ctx.fillRect(0, this.player.y - 2, this.canvas.width, this.player.height + 4);
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
				if (self.activeType === 'square') {
					this.ctx.strokeStyle = this.color;
				} else {
					this.ctx.strokeStyle = this.defaultColor;
				}
				self.drawSquare(self.enemies[i][0], self.enemies[i][1], self.enemyProps.width, self.enemyProps.height);
			} else if (self.enemies[i][2] === 'triangle') {
				if (self.activeType === 'triangle') {
					this.ctx.strokeStyle = this.color;
				} else {
					this.ctx.strokeStyle = this.defaultColor;
				}
				self.drawTriangle(self.enemies[i][0], self.enemies[i][1], self.enemyProps.width, self.enemyProps.height);
			} else if (self.enemies[i][2] === 'sawtooth') {
				if (self.activeType === 'sawtooth') {
					this.ctx.strokeStyle = this.color;
				} else {
					this.ctx.strokeStyle = this.defaultColor;
				}
				self.drawSawtooth(self.enemies[i][0], self.enemies[i][1], self.enemyProps.width, self.enemyProps.height);
			} else if (self.enemies[i][2] === 'sine') {
				if (self.activeType === 'sine') {
					this.ctx.strokeStyle = this.color;
				} else {
					this.ctx.strokeStyle = this.defaultColor;
				}
				self.drawSine(self.enemies[i][0], self.enemies[i][1], self.enemyProps.width, self.enemyProps.height);
			}
		}
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

		this.audio.setGain(this.score * 0.1);
	},
	updateColors: function() {

		if (this.activeType !== false) {
			if (this.activeType === 'sine') {
				this.color = '#ff00ff';
			} else if (this.activeType === 'triangle') {
				this.color = '#00ffff';
			} else if (this.activeType === 'sawtooth') {
				this.color = '#ffff00';
			} else if (this.activeType === 'square') {
				this.color = '#00ff00';
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

			// respawn
			if (self.enemies[i][0] < 0) {
				self.enemies[i][3] = false;
			}

			if (self.enemies[i][3] === true) {
				self.enemies[i][0] = self.enemies[i][0] - self.enemies[i][4];
			} else {
				self.enemies[i][0] = self.canvas.width + self.randomNumber(40, 600);
				self.enemies[i][1] = self.randomNumber(80, 320);
				self.enemies[i][2] = self.pickRandom(self.enemyProps.types);
				self.enemies[i][3] = true;
			}
		}
	},
	pickRandom: function(array) {
		return array[Math.floor(Math.random() * array.length)];
	},
	randomNumber: function(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	},
	actions: function() {
		var self = this;
		window.addEventListener('keydown', function(ev) {
			var key = ev.keyCode;
			if (key === 32) { // space
				for (var i = 0; i < self.enemies.length; i++) {
					if (self.enemies[i][2] === self.activeType) {
						self.score = self.score + 1;
						self.enemies[i][3] = false;
					}
				}
			}
		});
	}

};