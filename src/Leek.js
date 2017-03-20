import Constants from './Constants';

export default class Leek extends Phaser.Sprite {
	constructor(context, x, y, input) {
		super(context, x, y, 'leek');
		context.physics.arcade.enable(this);

		this.body.gravity.y = 600;
		this.body.collideWorldBounds = true;

		this.anchor.x = .5;
		this.anchor.y = .625;

		this.accelX = 1500;

		// Am I currently commanded to move in a direction?
		this.moving = {
			left: false,
			right: false
		};

		// Initalize in normal state
		this._deflate();

		// Inflation state
		this.inflated = false;

		// Maximum inflation time in ms
		this.maxInflationTime = 1000;
		// Inflation time cooldown in ms
		this.inflationCooldown = 500;
		// Is inflation is on cooldown?
		this.inflationOnCooldown = false;

		// Add animations
		this.animations.add('normal', [0], true);
		this.animations.add('inflated', [1], true);

		// Register input listener
		input.dispatcher.add(this._command.bind(this));
	}

	_command(event) {
		// Get +, -, or 0 x from left/right
		var direction = 0;
		if (typeof event.direction === 'string') {
			direction = Constants.direction[event.direction];
		}

		switch(event.command) {
			case 'startMove':
				this.moving[event.direction] = true;
				// Don't change facing if holding both horizontal keys
				if (!(this.movingLeft && this.movingRight)) {
					this.scale.setTo(direction, 1);
				}
				break;
			case 'stopMove':
				this.moving[event.direction] = false;
				// Change facing if still holding the other horizontal key
				if (this.moving.right) {
					this.scale.setTo(1, 1);
				} else if (this.moving.left) {
					this.scale.setTo(-1, 1);
				}
				break;
			case 'inflate':
				if (!this.inflated && !this.inflationOnCooldown) {
					this._inflate();
				}
				break;
			case 'deflate':
				if (this.inflated) {
					this._deflate();
				}
				break;
		}

		this._updateAcceleration();
	}

	// Recalculate acceleration based on current input and state
	_updateAcceleration() {
		this.body.acceleration.x = 
			(this.moving.left * -this.accelX) +
			(this.moving.right * this.accelX);
	}

	_inflate() {
		this.inflated = true;

		this.animations.play('inflated');
		this.body.acceleration.y = -700;
		this.body.drag = {x: 50, y: 10};
		this.body.maxVelocity = {x: 75, y: 100};
		this.accelX = 500;

		this._updateAcceleration();

		var timer = this.game.time.create(true);
		timer.add(this.maxInflationTime, this._inflateExpire, this);
		timer.start();

	}

	_inflateExpire() {
		if (this.inflated) {
			this._deflate();
		}
	}

	_inflateRecharge() {
		this.inflationOnCooldown = false;
	}

	_deflate() {
		this.inflated = false;
		this.inflationOnCooldown = true;

		var timer = this.game.time.create(true);
		timer.add(this.inflationCooldown, this._inflateRecharge, this);
		timer.start();

		this.animations.play('normal');
		this.body.acceleration.y = 0;
		this.body.drag = {x: 1500, y: 200};
		this.body.maxVelocity = {x: 150, y: 500};
		this.body.setSize(8, 16, 28, 40);
		this.accelX = 1500;

		this._updateAcceleration();
	}
}