export default class Leek extends Phaser.Sprite {
	constructor(context, x, y, input) {
		super(context, x, y, 'leek');
		context.physics.arcade.enable(this);
		this.body.gravity.y = 600;
		this.body.collideWorldBounds = true;
		this.body.setSize(8, 16, 28, 40);
		this.anchor.x = .5;
		this.anchor.y = .625;
		this.inflate = false;
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

		var velocity = 150;
		switch(event.command) {
			case 'startMove':
				this.scale.setTo(direction, 1);
				break;
			case 'stopMove':
				velocity = -velocity;
				break;
			case 'inflate':
				this.inflate = true;
				this.animations.play('inflated');
				this.body.acceleration.y = -500;
				break;
			case 'deflate':
				this.inflate = false;
				this.animations.play('normal');
				this.body.acceleration.y = 0;
				break;
		}
		this.body.velocity.x += velocity * direction;
	}
}