import Constants from './Constants';

export default class Leek extends Phaser.Sprite {
	constructor(game, x, y) {
		super(game, x, y, 'leek');

		// Unchanging Phaser physics/visuals
		this.game.physics.arcade.enable(this);
		this.body.collideWorldBounds = true;
		this.body.onCollide = new Phaser.Signal();
		this.body.onCollide.add(this._handleCollision, this);
		this.anchor.x = .5;
		this.anchor.y = .625;
		this.animations.add('normal', [0], true);
		this.animations.add('inflated', [1], true);

		// Timing
		this.timer = this.game.time.create(false);
		this.timer.start();
		this.inflateExpireTimer = {};

		// Command handling and tracking
		this.commandHandlers = this._createCommandHandlers(this);

		var directionalUpdate = this._updateFromDirectionalCommand.bind(this);
		var inflationUpdate = this._updateFromInflateCommand.bind(this);
		this._activeCommands = {
			_left: false,
			get left() {
				return this._left;
			},
			set left(value) {
				this._left = value;
				directionalUpdate();
			},
			_right: false,
			get right() {
				return this._right;
			},
			set right(value) {
				this._right = value;
				directionalUpdate();
			},
			_up: false,
			get up() {
				return this._up;
			},
			set up(value) {
				this._up = value;
				directionalUpdate();
			},
			_down: false,
			get down() {
				return this._down;
			},
			set down(value) {
				this._down = value;
				directionalUpdate();
			},
			_inflate: false,
			get inflate() {
				return this._inflate;
			},
			set inflate(value) {
				this._inflate = value;
				inflationUpdate();
			},
			_deflate: true,
			get deflate() {
				return this._deflate;
			},
			set deflate(value) {
				this._deflate = value;
				inflationUpdate();
			}
		};

		// Rework everything below for consistent state/constant management
		this.defaultGravity = 1000;

		this.inflateAccel = 100;

		this.state = {
			inflated: false,
			inflationRecovery: true
		};

		this.maxInflationTime = 2000;

		// Initialized as deflated
		this._deflate();
	}

	command(commandName) {
		if (typeof this.commandHandlers[commandName] !== 'function') {
			return null;
		} else {
			this.commandHandlers[commandName]();
		}
	}

	_createCommandHandlers(target) {
		var handlers = {};
		handlers[Constants.commands.INFLATE] = function() {
			if (!target.state.inflated) {
				target._activeCommands.inflate = true;
			}
		};
		handlers[Constants.commands.DEFLATE] = function() {
			target._activeCommands.inflate = false;
			if (target.state.inflated) {
				target._activeCommands.deflate = true;
			}
		};
		handlers[Constants.commands.MOVE_LEFT_START] = function() {
			target._activeCommands.left = true;
		};
		handlers[Constants.commands.MOVE_LEFT_STOP] = function() {
			target._activeCommands.left = false;
		};
		handlers[Constants.commands.MOVE_RIGHT_START] = function() {
			target._activeCommands.right = true;
		};
		handlers[Constants.commands.MOVE_RIGHT_STOP] = function() {
			target._activeCommands.right = false;
		};
		handlers[Constants.commands.MOVE_UP_START] = function() {
			target._activeCommands.up = true;
		};
		handlers[Constants.commands.MOVE_UP_STOP] = function() {
			target._activeCommands.up = false;
		};
		handlers[Constants.commands.MOVE_DOWN_START] = function() {
			target._activeCommands.down = true;
		};
		handlers[Constants.commands.MOVE_DOWN_STOP] = function() {
			target._activeCommands.down = false;
		};
		return handlers;
	}



	_handleCollision() {
		if (this.body.onFloor && !this.state.inflated) {
			this.state.inflationRecovery = false;
			if (this._activeCommands.inflate) {
				this._inflate();
			}
		}
	}

	_updateFromDirectionalCommand() {
		this._updateFacing();
		this._updateAnimation();
		this._updateAcceleration();
	}

	_updateFromInflateCommand() {
		if (!this.state.inflated && this._activeCommands.inflate && !this.state.inflationRecovery) {
			this._inflate();
		}
		if (this.state.inflated && this._activeCommands.deflate) {
			this._deflate();
		}
		this._updateAnimation();
		this._updateAcceleration();
	}

	_updateFacing() {
		// Don't change facing if holding both horizontal keys
		if (this._activeCommands.left && this._activeCommands.right) {
			return;
		} else if (this._activeCommands.left && !this._activeCommands.right) {
			this.scale.setTo(-1, 1);
		} else if (!this._activeCommands.left && this._activeCommands.right) {
			this.scale.setTo(1, 1);
		}
	}

	_updateAnimation() {
		if (this.state.inflated) {
			this.animations.play('inflated');
		} else {
			this.animations.play('normal');
		}
	}

	// Recalculate acceleration based on current input and state
	_updateAcceleration() {
		this.body.acceleration.x = 
			(this._activeCommands.left * -this.accelX) +
			(this._activeCommands.right * this.accelX);

		this.body.acceleration.y =
			(this.state.inflated * this._activeCommands.up * -this.inflateAccel) +
			(this.state.inflated * this._activeCommands.down * this.inflateAccel);
	}

	_inflate() {
		this.state.inflated = true;
		this.state.inflationRecovery = true;
		this._activeCommands.deflate = false;

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

		this.inflateExpireTimer = this.timer.add(
			this.maxInflationTime, this._deflate, this
		);

	}

	_deflate() {
		this.state.inflated = false;

		// Previous inflate command no longer counts
		this._activeCommands.inflate = false;

		this.timer.remove(this.inflateExpireTimer);

		this.body.gravity.y = this.defaultGravity;
		this.body.drag = {x: 1500, y: 200};
		this.body.maxVelocity = {x: 150, y: 500};
		this.body.setSize(8, 16, 28, 40);
		this.y -= 16;
		this.body.bounce.set(0, 0);
		this.accelX = 750;

		if (!this._activeCommands.down) {
			this.body.velocity.y -= 250;
		}
	}
}