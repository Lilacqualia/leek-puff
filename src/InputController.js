import Constants from './Constants';

export default class InputController {
	constructor(context, target) {
		var keyboard = context.input.keyboard;
		this.target = target;

		this._addKey(keyboard, Phaser.KeyCode.RIGHT, 'right');
		this._addKey(keyboard, Phaser.KeyCode.LEFT, 'left');
		this._addKey(keyboard, Phaser.KeyCode.UP, 'up');
		this._addKey(keyboard, Phaser.KeyCode.DOWN, 'down');

		this._addKey(keyboard, Phaser.KeyCode.SPACEBAR, 'inflate');
	}

	_addKey(keyboard, keyCode, control) {
		var key = keyboard.addKey(keyCode);
		key.onDown.add(this._handleInput, this, 0, control);
		key.onUp.add(this._handleInput, this, 0, control);
	}

	_handleInput(key, control) {
		var isDown = (event.type === 'keydown');
		var command = '';
		
		switch(control) {
			case 'left':
				command = isDown ? Constants.commands.MOVE_LEFT_START : Constants.commands.MOVE_LEFT_STOP;
				break;
			case 'right':
				command = isDown ? Constants.commands.MOVE_RIGHT_START : Constants.commands.MOVE_RIGHT_STOP;
				break;
			case 'up':
				command = isDown ? Constants.commands.MOVE_UP_START : Constants.commands.MOVE_UP_STOP;
				break;
			case 'down':
				command = isDown ? Constants.commands.MOVE_DOWN_START : Constants.commands.MOVE_DOWN_STOP;
				break;
			case 'inflate':
				command = isDown ? Constants.commands.INFLATE : Constants.commands.DEFLATE;
				break;
		}

		this.target.command(command);
	}

}