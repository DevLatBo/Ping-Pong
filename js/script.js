window.onload=function(){
	var x=0,y=0;
	var canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d"),
		W = window.innerWidth,
		H = window.innerHeight;
	canvas.width = W;
	canvas.height = H;

	var players = [
		new Player("izquierda"), 
		new Player("derecha")
	];
	var scoreboard = [0,0];
	var paddleDirection = {
		p1: {
			up:false,
			down:false
		},
		p2: {
			up:false,
			down:false
		}
	};
	var ball = new Ball();
	setInterval(paintBoard, 1);

	function Player(lado){
		var playerConfig 		= 	this;
		playerConfig.lado 		= 	lado;
		playerConfig.ancho 		=	60;
		playerConfig.largo 		=	150;
		playerConfig.x 			=	(lado=="izquierda") ? 0 : W-60;
		playerConfig.y			=	generarNumero(0,H-playerConfig.largo);
		playerConfig.color		=	"#FF0000";
		playerConfig.recorrido	=	7;
		playerConfig.dibujar	=	function(){
			ctx.fillStyle	=	playerConfig.color;
			ctx.fillRect(playerConfig.x,playerConfig.y,playerConfig.ancho,playerConfig.largo);
		}
		playerConfig.mover		=	function() {
			if (playerConfig.lado == "izquierda") {
				if (paddleDirection.p1.down){
					playerConfig.y	=	(playerConfig.y<H-playerConfig.largo) ? playerConfig.y+playerConfig.recorrido : playerConfig.y;
				}
				if (paddleDirection.p1.up) {
					playerConfig.y	=	(playerConfig.y>0) ? playerConfig.y - playerConfig.recorrido : playerConfig.y;
				}
			} else {
				if (paddleDirection.p2.down) {
					playerConfig.y	=	(playerConfig.y<H-playerConfig.largo) ? playerConfig.y+playerConfig.recorrido : playerConfig.y;
				}
				if (paddleDirection.p2.up) {
					playerConfig.y	=	(playerConfig.y>0) ? playerConfig.y - playerConfig.recorrido : playerConfig.y;
				}
			}
		}
	}

	function Ball() {
		var ballConfig		= 	this;
		ballConfig.size		=	15;
		ballConfig.x		=	W/2;
		ballConfig.y		=	generarNumero(0,H-ballConfig.size);
		ballConfig.style	=	"rgba(255, 255, 255, 0.9)";
		ballConfig.dir_x	=	generarNumero(0,1) == 0 ? 7 : -7;
		ballConfig.dir_y	=	generarNumero(0,1) == 0 ? 7 : -7;
		ballConfig.dibujar	=	function(){
			ctx.beginPath();
			ctx.fillStyle	=	ballConfig.style;
			ctx.arc(ballConfig.x,ballConfig.y,ballConfig.size,10,0,Math.PI*2);
			ctx.fill();
		};
		ballConfig.mover	=	function(){
			ballConfig.x	=	ballConfig.x + ballConfig.dir_x;
			ballConfig.y	=	ballConfig.y + ballConfig.dir_y;
			if (ballConfig.y<0) {
				ballConfig.dir_y 	*= 	(-1);
			}
			if (ballConfig.y>H-ballConfig.size) {
				ballConfig.dir_y	=	ballConfig.dir_y*(-1);
			}
			var jugador1 	= 	players[0];
			var jugador2 	= 	players[1];
			
			if ((ballConfig.x - ballConfig.size < (jugador1.x + jugador1.ancho)) && (ballConfig.y >= jugador1.y && ballConfig.y <= (jugador1.largo + jugador1.y))) {
				// Izquierda
				ballConfig.dir_x	*=	(-1);
				makeHitBallSound();
			}
			if ((ballConfig.x + ballConfig.size >= jugador2.x) && (ballConfig.y >= jugador2.y && ballConfig.y <= (jugador2.largo + jugador2.y))) {
				// Derecha
				ballConfig.dir_x	*= 	(-1);
				makeHitBallSound();
			}
			if (ballConfig.x<0) {
				scoreboard[1]++;
				ballConfig.x	=	W/2;
				ballConfig.y	=	generarNumero(0, H-pelota.size);
			}
			if (ballConfig.x>W-ballConfig.size) {
				scoreboard[0]++;
				ballConfig.x	=	W/2;
				ballConfig.y	=	generarNumero(0, H-ballConfig.size);
			}
		}
	}

	function paintBoard(){
		ctx.globalCompositeOperation 	= 	"source-over";
		ctx.fillStyle 					=	"#000000";
		ctx.fillRect(0,0,W,H);

		ctx.font						=	"120px Helvetica";
		ctx.fillStyle					=	"#FFFFFF";
		ctx.fillText("" + scoreboard[0], 300, 100);
		ctx.fillText("" + scoreboard[1], 1100, 100);

		for(var i=0;i<players.length;i++){
			players[i].dibujar();
			players[i].mover();
		}
		ball.dibujar();
		ball.mover();
	}

	//Control de paletas por medio del teclado por ASCII (tecla presionada y levantada)
	function teclaPresionada(evento){
		var codigo=evento.which;
		switch(codigo){
			case 79:
				// Arriba jugador 2;
				paddleDirection.p2.up = true;
				break;
			case 75:
				// Abajo jugador 2;
				paddleDirection.p2.down = true;
				break;
			case 87:
				// Arriba jugador 1;
				paddleDirection.p1.up = true;
				break;
			case 83:
				// Abajo jugador 1;
				paddleDirection.p1.down = true;
				break;
		}
	}
	function teclaLevantada(evento){
		var codigo=evento.which;
		switch(codigo){
			case 79:
				// Arriba jugador 2 [DETENIDO];
				paddleDirection.p2.up = false;
				break;
			case 75:
				// Abajo jugador 2 [DETENIDO];
				paddleDirection.p2.down = false;
				break;
			case 87:
				// Arriba jugador 1 [DETENIDO];
				paddleDirection.p1.up = false;
				break;
			case 83:
				// Abajo jugador 1 [DETENIDO]";
				paddleDirection.p1.down = false;
				break;
		}
	}

	function generarNumero(min,max){
  		return Math.round(Math.random() * (max - min)) + min;
	}

	function makeHitBallSound(){
		var audio = document.getElementById('hitBall');
		if (audio.paused){
			audio.play();
		} else {
			audio.pause();
			audio.currentTime = 0;
		}
	}

	document.addEventListener("keydown",teclaPresionada);
	document.addEventListener("keyup",teclaLevantada);
}
