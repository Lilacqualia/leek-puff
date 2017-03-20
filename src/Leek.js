import Constants from './Constants';

export default class Leek extends Phaser.Sprite {
	constructor(game, x, y, input) {
		super(game, x, y, 'leek');
		this.game.physics.arcade.enable(this);

		this.body.gravity.y = 1000;
		this.body.collideWorldBounds = true;

		this.anchor.x = .5;
		this.anchor.y = .625;

		this.accelX = 1500;

		this.inflateAccel = -this.body.gravity.y - 100;

		// Stage
		this.state = {
			inflated: false,
			deflateBoosting: false
		};

		// Currently active commands
		this.commands = {
			left: false,
			right: false,
			inflate: false
		};

		// Maximum inflation time in ms
		this.maxInflationTime = 1000;
		// Inflation time cooldown in ms
		this.inflationCooldown = 750;
		// Is inflation is on cooldown?
		this.inflationOnCooldown = false;
		
		this.deflateBoostTime = 150;
		this.deflateBoostAccel = -2000;

		this.timer = this.game.time.create(false);
		this.timer.start();

		this.inflateExpireTimer = {};

		// Initalize in normal state
		this._deflate();



		// Add animations
		this.animations.add('normal', [0], true);
		this.animations.add('inflated', [1], true);

		// Register input listener
		input.dispatcher.add(this._command.bind(this));
	}

	_updateState() {
		if (this.state.inflated) {
			this.animations.play('inflated');
		} else {
			this.animations.play('normal');
		}
	}

	_command(event) {
		// Get +, -, or 0 x from left/right
		var direction = 0;
		if (typeof event.direction === 'string') {
			direction = Constants.direction[event.direction];
		}

		switch(event.command) {
			case 'startMove':
				this.commands[event.direction] = true;
				// Don't change facing if holding both horizontal keys
				if (!(this.commands.left && this.commands.right)) {
					this.scale.setTo(direction, 1);
				}
				break;
			case 'stopMove':
				this.commands[event.direction] = false;
				// Change facing if still holding the other horizontal key
				if (this.commands.right) {
					this.scale.setTo(1, 1);
				} else if (this.commands.left) {
					this.scale.setTo(-1, 1);
				}
				break;
			case 'startInflate':
				this.commands.inflate = true;
				if (!this.state.inflated && !this.inflationOnCooldown) {
					this._inflate();
				}
				break;
			case 'stopInflate':
				this.commands.inflate = false;
				if (this.state.inflated) {
					this._deflate();
				}
				break;
		}

		this._updateAcceleration();
	}

	// Recalculate acceleration based on current input and state
	_updateAcceleration() {
		this.body.acceleration.x = 
			(this.commands.left * -this.accelX) +
			(this.commands.right * this.accelX);

		this.body.acceleration.y = 
			(this.state.inflated * this.inflateAccel) +
			(this.state.deflateBoosting * this.deflateBoostAccel);

	}

	_inflate() {
		this.state.inflated = true;
		this._updateState();

		this.body.drag = {x: 50, y: 10};
		this.body.maxVelocity = {x: 75, y: 100};
		this.accelX = 500;

		this._updateAcceleration();

		this.inflateExpireTimer = this.timer.add(
			this.maxInflationTime, this._inflateExpire, this
		);

	}

	_inflateExpire() {
		if (this.state.inflated) {
			this._deflate();
		}
	}

	_inflateRecharge() {
		this.inflationOnCooldown = false;
		// Inflate immediately after recharge if key is held down
		if (this.commands.inflate) {
			this._inflate();
		}
	}

	_deflate() {
		this.state.inflated = false;
		this._updateState();

		this.inflationOnCooldown = true;

		this.timer.remove(this.inflateExpireTimer);
		this.timer.add(this.inflationCooldown, this._inflateRecharge, this);

		this.body.drag = {x: 1500, y: 200};
		this.body.maxVelocity = {x: 150, y: 500};
		this.body.setSize(8, 16, 28, 40);
		this.accelX = 1500;

		this.state.deflateBoosting = true;
		this.timer.add(this.deflateBoostTime, this._deflateBoostExpire, this);

		this._updateAcceleration();
	}

	_deflateBoostExpire() {
		this.state.deflateBoosting = false;
		this._updateAcceleration();
	}
}