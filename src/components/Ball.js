export default class Ball {
	constructor(game, ctx, collisions) {
		this.sounds = {
			'ping': new Audio('./assets/sounds/ping.mp3'),
			'pong': new Audio('./assets/sounds/pong.mp3')
		}
		this.sound = 'ping'
		this.enableToRingAgain = true
		// Solo se debe reproducir el sonido una
		// única vez mientras la bola está en
		// colisión con las paletas, a veces se
		// reproducía hasta 3 veces el sonido

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

		/*
		// test colitions
		document.addEventListener('keydown', e => {
			const key = e.code
			const sizeStep = 1
			switch (key) {
				case 'KeyI':
					this.y -= sizeStep
					break
				case 'KeyK':
					this.y += sizeStep
					break
				case 'KeyL':
					this.x += sizeStep
					break
				case 'KeyJ':
					this.x -= sizeStep
					break
			}

			const sizeStep2 = window.innerWidth / 65
			switch (key) {
				case 'KeyR':
					this.y -= sizeStep2
					break
				case 'KeyF':
					this.y += sizeStep2
					break
				case 'KeyG':
					this.x += sizeStep2
					break
				case 'KeyD':
					this.x -= sizeStep2
					break
			}
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
		// /*
		// test colitions
		this.x += this.speedX
		this.y += this.speedY
		// */

		const marginColition = this.PlayerLeft.width * 0.3
		const bigMmarginColition = this.PlayerLeft.width * 0.5 // min 0.4
		let colitionPlayer = false

		if (this.y <= 0)
			this.speedY *= -1 // bounce down
		else if (this.y + this.height >= this.game.height)
			this.speedY *= -1 // bounce up
		else if (this.x < this.PlayerLeft.x + this.PlayerLeft.width) {
			// collision with player on the left
			if (this.x > this.PlayerLeft.x - bigMmarginColition)
				if (this.y + this.height > this.PlayerLeft.y - marginColition)
					if (this.y < this.PlayerLeft.y + this.PlayerLeft.height + marginColition) {
						this.increaseSpeed()
						this.speedX = this.speed
						if (this.enableToRingAgain)
							this.playSound()
						colitionPlayer = true
						this.enableToRingAgain = false
					}
		} else if (this.x + this.width > this.PlayerRight.x) {
			// collision with player on the left
			if (this.x + this.width < this.PlayerRight.x + this.PlayerRight.width + bigMmarginColition)
				if (this.y + this.height > this.PlayerRight.y - marginColition)
					if (this.y < this.PlayerRight.y + this.PlayerRight.height + marginColition) {
						this.increaseSpeed()
						this.speedX = -this.speed
						if (this.enableToRingAgain)
							this.playSound()
						colitionPlayer = true
						this.enableToRingAgain = false
					}
		}
		if (!colitionPlayer)
			this.enableToRingAgain = true

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
		this.dividendSpeed -= 20
		if (this.dividendSpeed < 65) this.dividendSpeed = 65
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
