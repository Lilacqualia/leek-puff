export default class Leek extends Phaser.Sprite {
	constructor(game, x, y) {
		super(game, x, y, 'leek');
		this.game.physics.arcade.enable(this);

		this.defaultGravity = 1000;

		this.body.collideWorldBounds = true;

		this.body.onCollide = new Phaser.Signal();
		this.body.onCollide.add(this._handleCollision, this);

		this.anchor.x = .5;
		this.anchor.y = .625;

		this.inflateAccel = 100;

		// Stage
		this.state = {
			inflated: false,
			inflationRecovery: false
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
		this.maxInflationTime = 2000;
				
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

	_updateAnimation() {
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
				if (event.active === true && !this.state.inflated && !this.state.inflationRecovery) {
					this._inflate();
				}
				if (event.active === false && this.state.inflated) {
					this._deflate();
				}
				break;
		}

		this._updateAcceleration();
	}

	_handleCollision() {
		if (this.body.onFloor && !this.state.inflated) {
			this._inflateRecharge();
		}
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
			(this.state.inflated * this.commands.up * -this.inflateAccel) +
			(this.state.inflated * this.commands.down * this.inflateAccel);
	}

	_inflate() {
		this.state.inflated = true;
		this._updateAnimation();

		this.body.gravity.y = 0;
		this.body.drag = {x: 100, y: 100};
		this.body.maxVelocity = {x: 100, y: 100};
		this.body.setSize(16, 33, 24, 15);
		this.body.bounce.set(0.5, 0.5);
		this.accelX = 150;
		if (!this.body.onFloor) {
			this.y += 16;
		} else {
			this.body.velocity.y -= 25;
		}

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
		this.state.inflationRecovery = false;
		// Inflate immediately after recharge if key is held down
		if (this.commands.inflate) {
			this._inflate();
		}
	}

	_deflate() {
		this.state.inflated = false;
		this._updateAnimation();

		this.state.inflationRecovery = true;

		this.timer.remove(this.inflateExpireTimer);

		this.body.gravity.y = this.defaultGravity;
		this.body.drag = {x: 1500, y: 200};
		this.body.maxVelocity = {x: 150, y: 500};
		this.body.setSize(8, 16, 28, 40);
		this.y -= 16;
		this.body.bounce.set(0, 0);
		this.accelX = 750;

		if (!this.commands.down) {
			this.body.velocity.y -= 250;
		}

		this._updateAcceleration();
	}
}