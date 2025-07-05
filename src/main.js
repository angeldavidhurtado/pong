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

		// Canvas size and event to adjust its size

		this.adjustGameSize()
		window.addEventListener('resize', () => {
			this.adjustGameSize()
			this.Players.Right.x = this.game.width-32
			// La altura de las paletas deberia ser como un porcentaje de la altura del canvas
			// La posicion de las paletas deberia ser un porcentaje de la altura del canvas para que al redimencionar siga estando en ese porcentaje
			// Se puede guardar el valor inicial del camvas para tener contancia de cual era y actualizarlo ya cuando se ejecute el evento de resize
			this.renderGameState()
		})

		this.game.addEventListener(
			'touchstart',
			this.handleTouch,
			{ passive: false }
		)
		this.game.addEventListener(
			'touchmove',
			this.handleTouch,
			{ passive: false }
		)

		this.KeysPressed = {}
		this.initializeGameState()

		this.gameLoop()

		window.addEventListener('resize', () => {
			this.gameWinningMessage()
		})

		// fullscreen
		let lastTouchTime = 0
		this.game.addEventListener('touchstart', () => {
			const now = new Date().getTime()
			if (now - lastTouchTime < 300)
				this.toggleFullscreen()
			lastTouchTime = now
		})
	}


	handleTouch = e => {
		e.preventDefault()

		const rect = this.game.getBoundingClientRect()

		for (let i = 0; i < e.touches.length; i++) {
			const touch = e.touches[i]
			const x = touch.clientX - rect.left
			const y = touch.clientY - rect.top
			const isLeft = x < this.game.width / 2
			const player = isLeft ? this.Players.Left : this.Players.Right
			player.y = y - player.height / 2
			player.limitInsideCanvas()
		}
	}


	configCtx = () => {
		this.ctx.fillStyle = this.colors[this.iColor]
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
		this.Scoreboard.updateScoreboard()
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

		this.Scoreboard.updateScoreboard()
		if (!(this.Players.Left.score == 3 || this.Players.Right.score == 3))
			this.centerRestart()

		if (this.Players.Left.score == 3 || this.Players.Right.score == 3) {
			this.showWinner = true
			setTimeout(() => {
				this.showWinner = false
				this.resetGame()
				this.sounds.start.volume = 0.4
				this.sounds.start.currentTime = 0
				this.sounds.start.play()
			}, 5000)
		}
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
		if (this.Players.Left.score == 3)
			this.drawMultilineText('Ganador\nJugador de\nla Izquierda')
		else if (this.Players.Right.score == 3)
			this.drawMultilineText('Ganador\nJugador de\nla Derecha')
	}


	centerRestart = () => {
		this.Ball.reset()
	}


	renderGameState = () => {
		this.ctx.clearRect(0, 0, this.game.width, this.game.height);
		if (this.showWinner)
			this.gameWinningMessage()
		this.Players.Left.render()
		this.Players.Right.render()
		this.Ball.render()
		this.Scoreboard.render()
	}


	gameLoop = () => {
		this.handleInput() // Capturar la entrada del usuario
		this.updateGameState() // Actualizar el estado del juego
		this.renderGameState() // Renderizar el estado del juego
		requestAnimationFrame(this.gameLoop)
	}


	drawMultilineText = text => {
		let size = Math.ceil(this.game.width / 45)
		if (size < 30) size = 30
		const lineHeight = Math.ceil(size * 1.33)
		this.ctx.font = `${size}px "Press Start 2P", sans-serif`
		this.ctx.textAlign = 'center'
		const lines = text.split('\n')
		lines.forEach((line, index) => {
			this.ctx.fillText(
				line,
				this.game.width / 2, // x
				this.game.height / 2 + (index * lineHeight) - 20 // y
			)
		})
	}


	adjustGameSize = () => {
		this.game.width = window.innerWidth
		this.game.height = window.innerHeight

		// This configuration must be done after changing the width of the canvas because changing the width of the canvas resets all the context values such as the fillStyle value, so it must be done after changing the size
		this.configCtx()
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


// Nombre_Clase
// InstanciaClase
// nombreFuncion
// nombre_variable
// NOMBRE_CONSTANTE
