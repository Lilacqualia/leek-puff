export default class CommandDispatcher extends Phaser.Signal {
	constructor(context) {
		super();
		var keyboard = context.input.keyboard;

		this._addKey(keyboard, Phaser.KeyCode.RIGHT, 'right');
		this._addKey(keyboard, Phaser.KeyCode.LEFT, 'left');
		this._addKey(keyboard, Phaser.KeyCode.UP, 'up');
		this._addKey(keyboard, Phaser.KeyCode.DOWN, 'down');

		this._addKey(keyboard, Phaser.KeyCode.SPACEBAR, 'inflate');
	}

	_addKey(keyboard, keyCode, command) {
		var key = keyboard.addKey(keyCode);
		key.onDown.add(this.dispatch.bind(this, {command: command, active: true}));
		key.onUp.add(this.dispatch.bind(this, {command: command, active: false}));
	}
}