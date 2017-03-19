import 'babel-polyfill';

import Leek from './Leek';

const game = new Phaser.Game(480, 270, Phaser.AUTO, '', {preload: preload, create: create, update: update});

var player, cursors, platforms;

function preload() {
	game.load.image('background', 'assets/background.png');
	game.load.image('tile', 'assets/tile.png');
	game.load.spritesheet('leek', 'assets/leek.png', 64, 64);

	game.scale.pageAlignHorizontally = true; 
	game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
	game.scale.setUserScale(2);
	game.stage.smoothed = false;
	Phaser.Canvas.setImageRenderingCrisp(game.canvas); 

}

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);


	game.add.image(0, 0, 'background');

	platforms = game.add.group();
	platforms.enableBody = true;

	var ground;

	for (var i = 0; i < game.world.width; i = i + 8) {
		ground = platforms.create(i, game.world.height - 8, 'tile');
		ground.body.immovable = true;
	}

	player = game.add.existing(new Leek(game, 0, 0));



	cursors = game.input.keyboard.createCursorKeys();

}

function update() {
	game.physics.arcade.collide(player, platforms);
	var horizontalV = 150 - (player.inflate * 75);

	player.body.velocity.x = 0;
	if (cursors.left.isDown) {
		player.body.velocity.x -= horizontalV;
		player.scale.setTo(-1, 1);
	}
	if (cursors.right.isDown) {
		player.body.velocity.x += horizontalV;
		player.scale.setTo(1, 1);
	}
	if (cursors.up.isDown) {
		player.inflate = true;
	}
	if (cursors.down.isDown) {
		player.inflate = false;
	}

	if (player.inflate) {
		player.body.gravity.y = 200;
		player.body.velocity.y -= 5;
		if (player.body.velocity.y > 80) {player.body.velocity.y = 80;}
		player.animations.play('inflated');
	} else {
		player.body.gravity.y = 600;
		player.animations.play('normal');
	}
}