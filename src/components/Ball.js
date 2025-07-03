export default class Ball {
	constructor(game, ctx, width, height, collisions) {
		this.game = game
		this.ctx = ctx
		this.width = width
		this.height = height
		this.x = this.game.width / 2 - this.width / 2
		this.y = this.game.height / 2 - this.height / 2
		window.innerWidth / 80
		this.initialDividendSpeed = 255
		this.initialSpeed = window.innerWidth / this.initialDividendSpeed
		this.dividendSpeed = this.initialDividendSpeed
		this.speed = this.initialSpeed
		this.speedX = this.speed
		this.speedY = this.speed

		this.PlayerLeft = collisions.Left
		this.PlayerRight = collisions.Right

		/*
		window.addEventListener('resize', () => {
			this.dividendSpeed = this.initialDividendSpeed
			this.speed = window.innerWidth / this.dividendSpeed
			this.speedX = this.speedX > 0 ? this.speed : -this.speed
			this.speedY = this.speed
		})
		*/
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
					if (this.y <= this.PlayerLeft.y + this.PlayerLeft.height) {
						this.increaseSpeed()
						this.speedX = this.speed
					}
		} else if (this.x + this.width >= this.PlayerRight.x) {
			// collision with player on the Right
			if (!(this.x + this.width > this.PlayerRight.x + this.PlayerRight.width))
				if (this.y + this.height >= this.PlayerRight.y)
					if (this.y <= this.PlayerRight.y + this.PlayerRight.height) {
						this.increaseSpeed()
						this.speedX = -this.speed
					}
		}

		if (this.x + this.width < 0) {
			this.resetSpeed()
			return 'Right'
		} else if (this.x > this.game.width) {
			this.resetSpeed()
			return 'Left'
		} return
	}


	increaseSpeed = () => {
		this.dividendSpeed -= 25
		if (this.dividendSpeed < 80) this.dividendSpeed = 80
		this.speed = window.innerWidth / this.dividendSpeed
	}


	resetSpeed = () => {
		this.dividendSpeed = this.initialDividendSpeed
		this.speed = window.innerWidth / this.dividendSpeed
		this.speedX = this.speedX > 0 ? -this.speed : this.speed
		this.speedY = this.speed
	}


	reset = () => {
		this.x = this.game.width / 2 - this.width / 2
		this.y = this.game.height / 2 - this.height / 2
	}
}
