import Constants from './Constants';

export default class Leek extends Phaser.Sprite {
	constructor(game, x, y) {
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
			up: false,
			down: false,
			inflate: false
		};

		this.facing = 1;

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
		this.game.commandDispatcher.add(this._handleCommandEvent.bind(this));
	}

	_updateState() {
		if (this.state.inflated) {
			this.animations.play('inflated');
		} else {
			this.animations.play('normal');
		}
	}

	_handleCommandEvent(event) {
		this.commands[event.command] = event.active;

		switch(event.command) {
			case 'left':
			case 'right':
				this._updateFacing();
				break;
			case 'inflate':
				if (event.active === true && !this.state.inflated && !this.inflationOnCooldown) {
					this._inflate();
				}
				if (event.active === false && this.state.inflated) {
					this._deflate();
				}
				break;
		}

		this._updateAcceleration();
	}

	_updateFacing() {
		// Don't change facing if holding both horizontal keys
		if (this.commands.left && this.commands.right) {
			return;
		} else if (this.commands.left && !this.commands.right) {
			this.scale.setTo(-1, 1);
		} else if (!this.commands.left && this.commands.right) {
			this.scale.setTo(1, 1);
		}
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