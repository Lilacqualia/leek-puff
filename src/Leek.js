export default class Leek extends Phaser.Sprite {
	constructor(context, x, y) {
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
	}
}