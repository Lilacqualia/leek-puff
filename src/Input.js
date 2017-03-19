import Constants from './Constants';

export default class Input {
	constructor(context) {
		this.keys = context.input.keyboard.createCursorKeys();
		this.dispatcher = new Phaser.Signal();

		this.keys.right.onDown.add(
			this._dispatch.bind(this, {command: 'startMove', direction: 'right'})
		);
		this.keys.right.onUp.add(
			this._dispatch.bind(this, {command: 'stopMove', direction: 'right'})
		);
		this.keys.left.onDown.add(
			this._dispatch.bind(this, {command: 'startMove', direction: 'left'})
		);
		this.keys.left.onUp.add(
			this._dispatch.bind(this, {command: 'stopMove', direction: 'left'})
		);
		this.keys.up.onDown.add(
			this._dispatch.bind(this, {command: 'inflate'})
		);
		this.keys.down.onDown.add(
			this._dispatch.bind(this, {command: 'deflate'})
		);
	}

	_dispatch(event) {
		this.dispatcher.dispatch(event);
	}
}