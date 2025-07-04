export default class Player {
	constructor(game, ctx, side, key_go_up, key_go_down) {
		this.game = game
		this.ctx = ctx
		this.width = Math.ceil(window.innerWidth / 80)
		if (this.width < 10) this.width = 10
		this.height = window.innerHeight / 6
		if (this.height < 100) this.height = 100
		this.padding = this.width * 3

		this.side = {
			'left': 0 + this.padding,
			'right': this.game.width - this.width - this.padding
		}
		const x = this.side[side]
		const y = this.game.height / 2

		this.initial_y = this.game.height / 2
		this.y_start = y - this.height / 2
		this.x = x
		this.y = this.y_start
		this.key_go_up = key_go_up
		this.key_go_down = key_go_down
		this.speed = this.game.height / 50
		this.score = 0
		this.positionYPercentage = this.y / (this.game.height - this.height)

		window.addEventListener('resize', () => {
			this.speed = this.game.height / 70
			this.width = Math.ceil(window.innerWidth / 80)
			if (this.width < 10) this.width = 10
			this.height = window.innerHeight / 6
			if (this.height < 100) this.height = 100

			this.padding = this.width * 3
			this.side = {
				'left': 0 + this.padding,
				'right': this.game.width - this.width - this.padding
			}
			this.x = this.side[side]

			const height = this.game.height
			this.y = (height - this.height) * this.positionYPercentage
			// this.positionYPercentage = this.y / (this.game.height - this.height)
		})
	}


	handleControlInput = keys => {
		const percent = 0.02
		const moveY = this.game.height * percent
		const height = (this.game.height - this.height)
		this.positionYPercentage = this.y / height

		if (keys[this.key_go_up])
			this.y = height * this.positionYPercentage - moveY // this.y -= moveY
		if (keys[this.key_go_down])
			this.y = height * this.positionYPercentage + moveY

		this.limitInsideCanvas()
		this.positionYPercentage = this.y / height
	}


	limitInsideCanvas = () => {
		const maxY = this.game.height - this.height
		if (this.y < 0) this.y = 0
		if (this.y > maxY) this.y = maxY
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
