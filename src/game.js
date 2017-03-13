import 'babel-polyfill';

const game = new Phaser.Game(960, 540, Phaser.AUTO, '', {preload: preload, create: create, update: update});

var player, cursors, platforms;

function preload() {
	game.load.image('background', 'assets/background.png');
	game.load.image('tile', 'assets/tile.png');
	game.load.spritesheet('leek', 'assets/leek.png', 64, 64);
}

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);

	var bg = game.add.image(0, 0, 'background');
	bg.scale.setTo(2, 2);

	platforms = game.add.group();
	platforms.enableBody = true;

	var ground;

	for (var i = 0; i < game.world.width; i = i + 8) {
		ground = platforms.create(i, game.world.height - 8, 'tile');
		ground.body.immovable = true;
	}

	player = game.add.sprite(200, game.world.height - 64, 'leek');
	game.physics.arcade.enable(player);
	player.body.gravity.y = 600;
	player.body.collideWorldBounds = true;
	player.body.setSize(8, 16, 28, 40);
	player.anchor.x = .5;
	player.anchor.y = .625;
	player.inflate = false;

	player.animations.add('normal', [0], true);
	player.animations.add('inflated', [1], true);

	cursors = game.input.keyboard.createCursorKeys();

}

function update() {
	var hitPlatform = game.physics.arcade.collide(player, platforms);
	var horizontalV = 150 - (player.inflate * 75) 

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