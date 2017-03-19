import 'babel-polyfill';

import Leek from './Leek';
import Constants from './Constants';
import Input from './Input';

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

	var ground;
	for (var i = 0; i < game.world.width; i = i + 8) {
		ground = platforms.create(i, game.world.height - 8, 'tile');
		ground.body.immovable = true;
	}

	var inputControl = new Input(game);
	player = game.add.existing(new Leek(game, 0, 0, inputControl));


}

function update() {
	game.physics.arcade.collide(player, platforms);
}