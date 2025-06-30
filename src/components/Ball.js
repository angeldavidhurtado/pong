export default class Ball {
	constructor(game, ctx, width, height, speed=1, collisions) {
		this.game = game
		this.ctx = ctx
		this.width = width
		this.height = height
		this.x = this.game.width / 2 - this.width / 2
		this.y = this.game.height / 2 - this.height / 2
		this.speed = speed
		this.speedX = speed
		this.speedY = speed

		this.PlayerLeft = collisions.Left
		this.PlayerRight = collisions.Right
	}


	render = () => {
		// draw the square ball
		this.ctx.fillRect(
			this.x,
			this.y,
			this.width,
			this.height
		)
	}


	move = () => {
		this.x += this.speedX
		this.y += this.speedY

		if (this.y <= 0)
			this.speedY *= -1 // bounce down
		else if (this.y + this.height >= this.game.height)
			this.speedY *= -1 // bounce up
		else if (this.x <= this.PlayerLeft.x + this.PlayerLeft.width) {
			// collision with player on the left
			if (!(this.x < this.PlayerLeft.x))
				if (this.y + this.height >= this.PlayerLeft.y)
					if (this.y <= this.PlayerLeft.y + this.PlayerLeft.height)
						this.speedX = this.speed
		} else if (this.x + this.width >= this.PlayerRight.x) {
			// collision with player on the Right
			if (!(this.x + this.width > this.PlayerRight.x + this.PlayerRight.width))
				if (this.y + this.height >= this.PlayerRight.y)
					if (this.y <= this.PlayerRight.y + this.PlayerRight.height)
						this.speedX = -this.speed
		}

		if (this.x + this.width < 0)
			return 'Right'
		else if (this.x > this.game.width)
			return 'Left'
		return
	}


	reset = () => {
		this.x = this.game.width / 2 - this.width / 2
		this.y = this.game.height / 2 - this.height / 2
		this.speedX *= -1
	}
}
