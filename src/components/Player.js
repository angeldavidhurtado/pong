export default class Player {
	constructor(game, ctx, x, y, key_go_up, key_go_down, speed) {
		this.game = game
		this.ctx = ctx
		this.width = Math.ceil(window.innerWidth / 80)
		this.height = 100
		this.initial_y = y
		this.y_start = y - this.height / 2
		this.x = x
		this.y = this.y_start
		this.key_go_up = key_go_up
		this.key_go_down = key_go_down
		this.speed = this.game.height / 50
		this.score = 0

		window.addEventListener('resize', () => {
			this.speed = this.game.height / 70
			this.width = Math.ceil(window.innerWidth / 80)
		})
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
		this.y = (this.game.height - this.height) / 2
	}
}
