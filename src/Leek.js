export default class Leek extends Phaser.Sprite {
	constructor(context, x, y, input) {
		super(context, x, y, 'leek');
		context.physics.arcade.enable(this);
		this.body.gravity.y = 600;
		this.body.collideWorldBounds = true;

		this.anchor.x = .5;
		this.anchor.y = .625;

		this._deflate();
		this.animations.add('normal', [0], true);
		this.animations.add('inflated', [1], true);

		this.listeners = {};
		input.dispatcher.add(this._move.bind(this));
	}

	_move(event) {
		var direction = 0;
		switch(event.direction) {
			case 'left':
				direction = -1;
				break;
			case 'right':
				direction = 1;
				break;
		}

		var deltaX = 1500;
		switch(event.command) {
			case 'startMove':
				this.scale.setTo(direction, 1);
				break;
			case 'stopMove':
				deltaX = -deltaX;
				break;
			case 'inflate':
				this._inflate();
				break;
			case 'deflate':
				this._deflate();
				break;
		}
		this.body.acceleration.x += deltaX * direction;
	}

	_inflate() {
		this.animations.play('inflated');
		this.body.acceleration.y = -900;
		this.body.drag = {x: 3000, y: 1500};
		this.body.maxVelocity = {x: 75, y: 250};
	}

	_deflate() {
		this.animations.play('normal');
		this.body.acceleration.y = 0;
		this.body.drag = {x: 1500, y: 200};
		this.body.maxVelocity = {x: 150, y: 500};
		this.body.setSize(8, 16, 28, 40);
	}
}