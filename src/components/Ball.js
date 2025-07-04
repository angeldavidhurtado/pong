export default class Ball {
	constructor(game, ctx, collisions) {
		this.sounds = {
			'ping': new Audio('./assets/sounds/ping.mp3'),
			'pong': new Audio('./assets/sounds/pong.mp3')
		}
		this.sound = 'ping'

		this.game = game
		this.ctx = ctx
		this.width = this.game.width / 90
		if (this.width < 10) this.width = 10
		this.height = this.width
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

		window.addEventListener('resize', () => {
			this.width = this.game.width / 90
			if (this.width < 10) this.width = 10
			this.height = this.width

			this.speed = window.innerWidth / this.dividendSpeed
			this.speedX = this.speedX > 0 ? this.speed : -this.speed
			this.speedY = this.speedY > 0 ? this.speed : -this.speed

			this.x = this.game.width * this.xPercentage
			this.y = this.game.height * this.yPercentage
		})
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

		const marginColition = this.PlayerLeft.width * 0.3

		if (this.y <= 0)
			this.speedY *= -1 // bounce down
		else if (this.y + this.height >= this.game.height)
			this.speedY *= -1 // bounce up
		else if (this.x <= this.PlayerLeft.x + this.PlayerLeft.width + marginColition) {
			// collision with player on the left
			if (!(this.x <= this.PlayerLeft.x - marginColition))
				if (this.y + this.height >= this.PlayerLeft.y - marginColition)
					if (this.y <= this.PlayerLeft.y + this.PlayerLeft.height + marginColition) {
						this.increaseSpeed()
						this.speedX = this.speed
						this.playSound()
					}
		} else if (this.x + this.width >= this.PlayerRight.x - marginColition) {
			// collision with player on the Right
			if (!(this.x + this.width > this.PlayerRight.x + this.PlayerRight.width + marginColition))
				if (this.y + this.height >= this.PlayerRight.y - marginColition)
					if (this.y <= this.PlayerRight.y + this.PlayerRight.height + marginColition) {
						this.increaseSpeed()
						this.speedX = -this.speed
						this.playSound()
					}
		}

		this.xPercentage = this.x / this.game.width
		this.yPercentage = this.y / this.game.height

		if (this.x + this.width < 0) {
			this.resetSpeed()
			return 'Right'
		} else if (this.x > this.game.width) {
			this.resetSpeed()
			return 'Left'
		} return
	}


	playSound = () => {
		this.sounds[this.sound].currentTime = 0
		this.sounds[this.sound].play()
		this.sound = this.sound == 'ping' ? 'pong' : 'ping'
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
