import Constants from './Constants';

export default class Input {
	constructor(context) {
		var keyboard = context.input.keyboard;
		this.dispatcher = new Phaser.Signal();

		this._addKey(keyboard, Phaser.KeyCode.RIGHT,
			{command: 'startMove', direction: 'right'},
			{command: 'stopMove', direction: 'right'}
		);
		this._addKey(keyboard, Phaser.KeyCode.LEFT,
			{command: 'startMove', direction: 'left'},
			{command: 'stopMove', direction: 'left'}
		);

		this._addKey(keyboard, Phaser.KeyCode.SPACEBAR,
			{command: 'startInflate'},
			{command: 'stopInflate'}
		);
	}

	_dispatch(event) {
		this.dispatcher.dispatch(event);
	}

	_addKey(keyboard, keyCode, downEvent, upEvent) {
		var key = keyboard.addKey(keyCode);
		key.onDown.add(this._dispatch.bind(this, downEvent));
		key.onUp.add(this._dispatch.bind(this, upEvent));
	}
}