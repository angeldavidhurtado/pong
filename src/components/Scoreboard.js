export default class Scoreboard {
	constructor(game, context, player_left, player_right) {
		this.game = game
		this.ctx = context

		this.player_left = player_left
		this.player_right = player_right
		this.points_player_left = 0
		this.points_player_right = 0

		this.y = 80

		this.fontSize()
		window.addEventListener('resize', this.fontSize)
	}


	fontSize = () => {
		this.size = window.innerWidth / 45
		if (this.size < 30) this.size = 30
		this.ctx.font = `${this.size}px "Press Start 2P", sans-serif`
	}


	updateScoreboard = () => {
		this.updatePoints()
		this.calculateCoordinateXMarkers()
	}


	calculateCoordinateXMarkers = () => {
		this.ctx.font = `${this.size}px "Press Start 2P", sans-serif`
		this.ctx.textAlign = 'left'
		const width_text_player_left = this.widthCanvasText(this.points_player_left)
		const width_text_player_right = this.widthCanvasText(this.points_player_right)
		
		const a = this.game.width / 4
		this.player_left_x = a - width_text_player_left / 2
		this.player_right_x = a * 3 - width_text_player_right / 2
	}


	widthCanvasText = text => {
		const txt = `${text}` // Texto a medir
		const metrics = this.ctx.measureText(txt) // Obtener la información de medida del texto
		const anchoTexto = metrics.width // Obtener el ancho del texto
		return anchoTexto
	}


	updatePoints = () => {
		this.points_player_left = this.player_left.score
		this.points_player_right = this.player_right.score
	}


	render = () => {
		this.calculateCoordinateXMarkers()
		this.ctx.fillText(this.player_left.score, this.player_left_x, this.size * 3)
		this.ctx.fillText(this.player_right.score, this.player_right_x, this.size * 3)
	}
}
