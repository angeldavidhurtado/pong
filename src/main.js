import Player from './components/Player.js'
import Ball from './components/Ball.js'
import Scoreboard from './components/Scoreboard.js'


class Game_Pong {
	constructor(game) {
		this.game = game
		this.ctx = this.game.getContext('2d')

		// Canvas size and event to adjust its size
		
		this.adjustGameSize()
		window.addEventListener('resize', () => {
			this.adjustGameSize()
			this.Players.Right.x = this.game.width-32
			// La altura de las paletas deberia ser como un porcentaje de la altura del canvas
			// La posicion de las paletas deberia ser un porcentaje de la altura del canvas para que al redimencionar siga estando en ese porcentaje
			// Se puede guardar el valor inicial del camvas para tener contancia de cual era y actualizarlo ya cuando se ejecute el evento de resize
		})

		this.KeysPressed = {}
		this.initializeGameState()

		this.gameLoop()
	}


	configCtx = () => {
		this.ctx.fillStyle = '#fff'
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
		const Y = this.game.height / 2
		const speed = 10
		this.Players = {
			Left: new Player(this.game, this.ctx, 20, Y, 'KeyW', 'KeyS', speed),
			Right: new Player(this.game, this.ctx, this.game.width-32, Y, 'ArrowUp', 'ArrowDown', speed)
		}

		// Create ball
		this.Ball = new Ball(this.game, this.ctx, 10, 10, 3, this.Players)

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
		const goal = this.Ball.move()
		if (!goal)
			return

		switch (goal) {
			case 'Left':
				this.Players.Left.score++
				break
			case 'Right':
				this.Players.Right.score++
		}

		this.Scoreboard.updateScoreboard()
		this.centerRestart()
	}


	centerRestart = () => {
		this.Ball.reset()
		this.Players.Left.resetPosition()
		this.Players.Right.resetPosition()
	}


	renderGameState = () => {
		this.ctx.clearRect(0, 0, this.game.width, this.game.height);

		this.Players.Left.render()
		this.Players.Right.render()
		this.Ball.render()
		this.Scoreboard.render()
	}


	gameLoop = () => {
		this.handleInput() // Capturar la entrada del usuario
		this.updateGameState(); // Actualizar el estado del juego
		this.renderGameState() // Renderizar el estado del juego

		requestAnimationFrame(this.gameLoop)
	}


	adjustGameSize = () => {
		this.game.width = window.innerWidth
		this.game.height = window.innerHeight

		// This configuration must be done after changing the width of the canvas because changing the width of the canvas resets all the context values such as the fillStyle value, so it must be done after changing the size
		this.configCtx()
	}
}


const GamePong = new Game_Pong($game)


// Nombre_Clase
// InstanciaClase
// nombreFuncion
// nombre_variable
// NOMBRE_CONSTANTE
