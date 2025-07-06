import Player from './components/Player.js'
import Ball from './components/Ball.js'
import Scoreboard from './components/Scoreboard.js'


class Game_Pong {
	constructor(game) {
		this.sounds = {
			'point': new Audio('./assets/sounds/point.mp3'),
			'start': new Audio('./assets/sounds/start.wav'),
			'winner': new Audio('./assets/sounds/winner.mp3')
		}

		this.game = game
		this.ctx = this.game.getContext('2d')
		this.showWinner = false

		this.colors = [
			'#fff', // white
			'#00ff00', // green
			'#00ffff', // cyan
			'#ffff00' // yellow
		]
		this.iColor = 0

		this.adjustGameSize()
		this.ctx.fillStyle = this.colors[this.iColor]
		window.addEventListener('resize', this.adjustGameSize)

		// touch.identifier
		this.activeTouches = {
			left: null,  // touch.identifier
			right: null  // touch.identifier
		}
		this.touchAssignments = {} // touch.identifier → 'left' | 'right'
		this.game.addEventListener('touchstart', this.handleTouchStart, { passive: false })
		this.game.addEventListener('touchmove', this.handleTouchMove, { passive: false })
		this.game.addEventListener('touchend', this.handleTouchEnd)
		this.game.addEventListener('touchcancel', this.handleTouchEnd)




		this.KeysPressed = {}
		this.initializeGameState()

		// fullscreen
		const lastTouchTimes = new Map() // id cada dedo
		const DOUBLE_TAP_THRESHOLD = 300
		this.game.addEventListener('touchstart', event => {
			for (const touch of event.changedTouches) {
				const now = Date.now();
				const lastTime = lastTouchTimes.get(touch.identifier) || 0
				if (now - lastTime < DOUBLE_TAP_THRESHOLD)
					this.toggleFullscreen()
				lastTouchTimes.set(touch.identifier, now)
				// Limpiar después de un tiempo para evitar llenar el Map
				setTimeout(
					() => lastTouchTimes.delete(touch.identifier),
					DOUBLE_TAP_THRESHOLD + 100
				)
			}
		})

		this.gameLoop()
	}


	handleTouchStart = e => {
		e.preventDefault()

		const rect = this.game.getBoundingClientRect()

		for (let i = 0; i < e.changedTouches.length; i++) {
			const touch = e.changedTouches[i]
			const x = touch.clientX - rect.left
			const y = touch.clientY - rect.top
			const id = touch.identifier

			const isLeft = x < this.game.width / 2
			const side = isLeft ? 'left' : 'right'

			// Solo asignar si ese lado está libre
			if (this.activeTouches[side] === null) {
				this.activeTouches[side] = id
				this.touchAssignments[id] = side

				// Mover inmediatamente la paleta a la posición del dedo
				const player = side === 'left' ? this.Players.Left : this.Players.Right
				player.y = y - player.height / 2
				player.limitInsideCanvas()
			}
		}
	}


	handleTouchMove = e => {
		e.preventDefault()

		const rect = this.game.getBoundingClientRect()

		for (let i = 0; i < e.touches.length; i++) {
			const touch = e.touches[i]
			const id = touch.identifier
			const x = touch.clientX - rect.left
			const y = touch.clientY - rect.top
			const side = this.touchAssignments[id]

			// Si el dedo no está asignado, ignorar
			if (!side) continue

			// Verifica si el dedo sigue en su mitad correspondiente
			const isInCorrectHalf =
				(side === 'left'  && x <  this.game.width / 2) ||
				(side === 'right' && x >= this.game.width / 2)

			if (!isInCorrectHalf) continue // No mover paleta si está fuera de su zona

			// Mueve la paleta si el dedo está en su zona
			const player = side === 'left' ? this.Players.Left : this.Players.Right
			player.y = y - player.height / 2
			player.limitInsideCanvas()
		}
	}


	handleTouchEnd = e => {
		for (let i = 0; i < e.changedTouches.length; i++) {
			const touch = e.changedTouches[i]
			const id = touch.identifier
			const side = this.touchAssignments[id]

			if (side && this.activeTouches[side] === id) {
				this.activeTouches[side] = null
			}
			delete this.touchAssignments[id]
		}
	}


	initializeGameState = () => {
		// Add the events for player controls
		document.addEventListener('keydown', e => {
			this.KeysPressed[e.code] = true
			this.thereAreKeysPressed = Object.keys(this.KeysPressed).length
		})
		document.addEventListener('keyup', e => {
			delete this.KeysPressed[e.code]
			this.thereAreKeysPressed = Object.keys(this.KeysPressed).length
		})

		// Create the players
		this.Players = {
			Left: new Player(this.game, this.ctx, 'left', 'KeyW', 'KeyS'),
			Right: new Player(this.game, this.ctx, 'right', 'ArrowUp', 'ArrowDown')
		}

		// Create ball
		this.Ball = new Ball(this.game, this.ctx, this.Players)

		// Create scoreboard
		this.Scoreboard = new Scoreboard(this.game, this.ctx, this.Players.Left, this.Players.Right)
		this.gameWon = {
			'left': 0,
			'right': 0
		}
		this.msgWinner = ''
	}


	handleInput = () => {
		if (!this.thereAreKeysPressed)
			return

		for (let i in this.Players) {
			const valid_control = this.Players[i].handleControlInput(this.KeysPressed)
			if (valid_control) {
				return
			}
		}
	}


	updateGameState = () => {
		if (this.showWinner) return

		const goal = this.Ball.move()
		if (!goal)
			return

		switch (goal) {
			case 'Left':
				this.Players.Left.score++
				this.sounds.point.currentTime = 0
				this.sounds.point.play()
				break
			case 'Right':
				this.Players.Right.score++
				this.sounds.point.currentTime = 0
				this.sounds.point.play()
		}

		if (!(this.Players.Left.score == 3 || this.Players.Right.score == 3))
			this.centerRestart()

		if (this.Players.Left.score == 3 || this.Players.Right.score == 3) {
			this.showWinner = true
			if (this.Players.Left.score == 3) {
				this.gameWon.left++
				this.makeMsgWinner('left')
			} else if (this.Players.Right.score == 3) {
				this.gameWon.right++
				this.makeMsgWinner('right')
			}
			setTimeout(() => {
				this.showWinner = false
				this.resetGame()
				this.sounds.start.volume = 0.4
				this.sounds.start.currentTime = 0
				this.sounds.start.play()
			}, 5000)
		}
	}


	makeMsgWinner = winner => {
		let left  = `Izquierda`
		let right = `Derecha  `

		const lenLeft = String(this.gameWon.left).length
		const lenRight = String(this.gameWon.right).length
		const dif = Math.abs(lenLeft - lenRight)
		const spaces = ' '.repeat(dif + 1)
		if (lenLeft == lenRight) {
			left = `${left} ${this.gameWon.left}`
			right = `${right} ${this.gameWon.right}`
		} else if (lenLeft > lenRight) {
			left = `${left} ${this.gameWon.left}`
			right = `${right}${spaces}${this.gameWon.right}`
		} else if (lenRight > lenLeft) {
			left = `${left}${spaces}${this.gameWon.left}`
			right = `${right} ${this.gameWon.right}`
		}

		if (winner == 'left') {
			left  = `★ ${left}`
		  right = `ㅤ ${right}`
		} else {
			left  = `ㅤ ${left}`
			right = `★ ${right}`
		}

		this.msgWinner = ` Ganador\n\n${left}\n${right}`
	}


	resetGame = () => {
		this.iColor++
		if (this.iColor == this.colors.length)
			this.iColor = 0
		this.ctx.fillStyle = this.colors[this.iColor]

		this.centerRestart()
		this.Players.Left.score = 0
		this.Players.Right.score = 0
	}


	sleep = () => new Promise(res => setTimeout(res, 5000))


	gameWinningMessage = () => {
		this.drawMultilineText(this.msgWinner)
	}


	centerRestart = () => {
		this.Ball.reset()
	}


	renderGameState = () => {
		this.ctx.clearRect(0, 0, this.game.width, this.game.height)
		if (this.showWinner)
			this.gameWinningMessage()
		this.Players.Left.render()
		this.Players.Right.render()
		this.Ball.render()
		this.Scoreboard.updateScoreboard()
		this.Scoreboard.render()
	}


	gameLoop = async () => {
		this.handleInput() // Capturar la entrada del usuario
		this.updateGameState() // Actualizar el estado del juego
		this.renderGameState() // Renderizar el estado del juego
		requestAnimationFrame(this.gameLoop)
	}


	drawMultilineText = text => {
		let size = Math.ceil(this.game.width / 45)
		if (size < 30) size = 30
		if (this.game.width < 500)
			size = Math.ceil(this.game.width / 27)
		const lineHeight = Math.ceil(size * 1.33)
		this.ctx.font = `${size}px "Press Start 2P", sans-serif`
		this.ctx.textAlign = 'center'
		const lines = text.split('\n')
		lines.forEach((line, index) => {
			this.ctx.fillText(
				line,
				this.game.width / 2, // x
				this.game.height / 2 + (index * lineHeight) - (lineHeight * 1.7) // y
			)
		})
	}


	adjustGameSize = () => {
		this.game.width = window.innerWidth
		this.game.height = window.innerHeight
		this.ctx.fillStyle = this.colors[this.iColor]
	}


	toggleFullscreen = () => {
		if (
			!document.fullscreenElement &&
			!document.webkitFullscreenElement &&
			!document.mozFullScreenElement &&
			!document.msFullscreenElement
		) {
			this.requestFullscreen()
		} else {
			this.exitFullscreen()
		}
	}


	requestFullscreen = () => {
		const element = this.game
		if (element.requestFullscreen) {
			element.requestFullscreen()
		} else if (element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen()
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen()
		} else if (element.msRequestFullscreen) {
			element.msRequestFullscreen()
		}
	}


	exitFullscreen = () => {
		if (document.exitFullscreen) {
			document.exitFullscreen()
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen()
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen()
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen()
		}
	}
}


const GamePong = new Game_Pong($game)
