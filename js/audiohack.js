
var AudioHack = function() {
	this.init();
};


AudioHack.prototype = {

	ctx: {},
	osc: {},
	loop: {},
	gain: {},
	firing: false,


	init: function() {

		var self = this;
		var buffer;

		this.actions();

		this.ctx = new AudioContext();
		//this.osc = this.ctx.createOscillator();
		this.gain = this.ctx.createGain();

		//this.osc.connect(this.gain);
		//this.gain.connect(this.ctx.destination);

		//this.gain.gain.value = 0.8;

		var playAudioFile = function (buffer) {
			self.loop = self.ctx.createBufferSource();
			self.loop.buffer = buffer;
			self.loop.connect(self.gain);
			self.gain.connect(self.ctx.destination);
			self.loop.loop = true;
			self.gain.gain.value = 0.1;
			self.loop.start(0); // Play sound immediately
		};
		var loadAudioFile = (function (url) {
			var request = new XMLHttpRequest();

			request.open('get', 'sounds/guitar_loop.wav', true);
			request.responseType = 'arraybuffer';

			request.onload = function () {
				self.ctx.decodeAudioData(request.response,
					function(incomingBuffer) {
						playAudioFile(incomingBuffer);
					}
				);
			};

			request.send();
		}());

	},

	setGain: function(value) {
		this.gain.gain.value = value;
		return true;
	},
	getGain: function() {
		return this.gain.gain.value;
	},

	getType: function() {
		if (this.osc.type) {
			return this.osc.type;
		} else {
			return false;
		}
		return this.osc.type;
	},
	isFiring: function() {
		return this.firing;
	},

	actions: function() {

		var self = this;
		var checkSpace = false;

		// document.querySelector('#play-btn').addEventListener('click', function() {

		// 	self.osc = self.ctx.createOscillator();
		// 	self.osc.connect(self.ctx.destination);
		// 	self.osc.start(0);
		// 	self.osc.stop(4);

		// });

		window.addEventListener('keydown', function(ev) {
			var key = ev.keyCode;
			if (key === 49) { // 1
				self.osc.type = 'triangle';
			} else if (key === 50) { // 2
				self.osc.type = 'square';
			} else  if (key === 51) { // 3
				self.osc.type = 'sine';
			} else  if (key === 52) { // 4 
				self.osc.type = 'sawtooth';
			}

			if (key === 32) { // space
				if (checkSpace === false) {
					self.osc = self.ctx.createOscillator();
					self.osc.connect(self.ctx.destination);
					self.osc.start(0);
					checkSpace = true;
					self.firing = true;
				}
			}
			
		});
		window.addEventListener('keyup', function(ev) {
			var key = ev.keyCode;
			if (key === 32) { // space
				self.osc.stop(0);
				checkSpace = false;
				self.firing = false;
			}
		});
	}

};