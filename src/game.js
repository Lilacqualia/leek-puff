import 'babel-polyfill';

import Leek from './Leek';
import InputController from './InputController';

const game = new Phaser.Game(480, 270, Phaser.AUTO, '', {preload: preload, create: create, update: update});

var player, platforms;

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

	var ground, i;
	for (i = 0; i < game.world.width; i = i + 8) {
		ground = platforms.create(i, game.world.height - 8, 'tile');
		ground.body.immovable = true;
	}
	for (i = game.world.width * (3/8); i < game.world.width * (5/8); i = i + 8) {
		ground = platforms.create(i, game.world.height - 40, 'tile');
		ground.body.immovable = true;
	}
	for (i = 0; i < game.world.width/3; i = i + 8) {
		ground = platforms.create(i, game.world.height - 64, 'tile');
		ground.body.immovable = true;
	}
	for (i = game.world.width * (2/3); i < game.world.width; i = i + 8) {
		ground = platforms.create(i, game.world.height - 96, 'tile');
		ground.body.immovable = true;
	}

	player = game.add.existing(new Leek(game, 0, 0));
	game.playerInputController = new InputController(game, player);


}

function update() {
	game.physics.arcade.collide(player, platforms);
}