export default class Player {
	constructor(game, ctx, x, y, key_go_up, key_go_down, speed) {
		this.game = game
		this.ctx = ctx
		this.width = 12
		this.height = 100
		this.y_start = y - this.height / 2
		this.x = x
		this.y = this.y_start
		this.key_go_up = key_go_up
		this.key_go_down = key_go_down
		this.speed = speed
		this.score = 0
	}


	handleControlInput = keys => {
		if (keys[this.key_go_up])
			this.y -= this.speed
		if (keys[this.key_go_down])
			this.y += this.speed
		// return false
	}


	render = () => {
		this.ctx.fillRect(
			this.x,
			this.y,
			this.width,
			this.height
		)
	}


	resetPosition = () => {
		this.y = this.y_start
	}
}
