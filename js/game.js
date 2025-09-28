window.onload=function(){
	var x=0,y=0;
	var canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d"),
		W = window.innerWidth,
		H = window.innerHeight;
		passedPaddleLimit = false

	canvas.width = W;
	canvas.height = H;

	// Half of the screen width.
	const halfW = W / 2;

	// Half of half of the width screen.
	const quarterW = halfW / 2;

	// Half plus half of half of the width screen (three-quarters).
	const threeQuarterW = halfW + quarterW;


	var players = [
		new Player("left"),
		new Player("right")
	];
	var scoreboard = [0,0];
	var paddleDirection = {
		p1: {
			up: false,
			down: false
		},
		p2: {
			up: false,
			down: false
		}
	};
	var ball = new Ball();
	setInterval(paintBoard, 1);

	function Player(side){
		var playerConfig 		= 	this;
		playerConfig.side 		= 	side;
		playerConfig.width 		=	60;
		playerConfig.padLength 	=	150;
		playerConfig.x 			=	(side == "left") ? 0 : W - 60;
		playerConfig.y			=	generateNumber(0, H - playerConfig.padLength);
		playerConfig.color		=	"#FF0000";
		playerConfig.velocity	=	6;
		playerConfig.paint		=	function(){
			ctx.fillStyle	=	playerConfig.color;
			ctx.fillRect(playerConfig.x, playerConfig.y, playerConfig.width, playerConfig.padLength);
		}
		playerConfig.move		=	function() {
			if (playerConfig.side == "left") {
				if (paddleDirection.p1.down){
					playerConfig.y	=	(playerConfig.y < H - playerConfig.padLength) ? playerConfig.y + playerConfig.velocity : playerConfig.y;
				}
				if (paddleDirection.p1.up) {
					playerConfig.y	=	(playerConfig.y>0) ? playerConfig.y - playerConfig.velocity : playerConfig.y;
				}
			} else {
				if (paddleDirection.p2.down) {
					playerConfig.y	=	(playerConfig.y < H - playerConfig.padLength) ? playerConfig.y + playerConfig.velocity : playerConfig.y;
				}
				if (paddleDirection.p2.up) {
					playerConfig.y	=	(playerConfig.y > 0) ? playerConfig.y - playerConfig.velocity : playerConfig.y;
				}
			}
		}
	}

	function Ball() {
		var ballConfig		= 	this;
		ballConfig.size		=	15;
		ballConfig.x		=	W/2;
		ballConfig.y		=	generateNumber(0,H-ballConfig.size);
		ballConfig.style	=	"rgba(255, 255, 255, 0.9)";
		ballConfig.dir_x	=	generateNumber(0,1) == 0 ? 5 : -5;
		ballConfig.dir_y	=	generateNumber(0,1) == 0 ? 5 : -5;
		ballConfig.paint	=	function(){
			ctx.beginPath();
			ctx.fillStyle	=	ballConfig.style;
			ctx.arc(ballConfig.x, ballConfig.y, ballConfig.size, 10, 0, Math.PI*2);
			ctx.fill();
		};
		ballConfig.move		=	function(){
			ballConfig.x	=	ballConfig.x + ballConfig.dir_x;
			ballConfig.y	=	ballConfig.y + ballConfig.dir_y;
			
			// If the ball bounces off the top or bottom of the screen.
			if (ballConfig.y - ballConfig.size < 0 || ballConfig.y > H - ballConfig.size) {
				ballConfig.dir_y	 	*= 	(-1);
			}

			var player1 	= 	players[0];
			var player2 	= 	players[1];
			if (
				(ballConfig.x - ballConfig.size < (player1.x + player1.width)) && 
				(ballConfig.y >= player1.y && ballConfig.y <= (player1.padLength + player1.y))
			) {
				// Goes to the right
				console.log("golpeo paleta izquierda");
				ballConfig.dir_x	*=	(-1);
				makeHitBallSound();
			}
			console.log(passedPaddleLimit);
			/*ballConfig.dir_y *= (-1);
					var test = player1.padLength+player1.y;
					console.log(ballConfig.y +" ("+player1.y+','+test+")");*/
			/*if(ballConfig.x - ballConfig.size >= player1.x && ballConfig.x <= player1.x + player1.width) {
				if(ballConfig.y >= player1.y) {
					if(!passedPaddleLimit) {
						ballConfig.dir_y *= (-1);
						passedPaddleLimit = true;
					}
				}
			}*/
			if (
				(ballConfig.x + ballConfig.size >= player2.x) && 
				(ballConfig.y >= player2.y && ballConfig.y <= (player2.padLength + player2.y))) {
				// Goes to the left
				console.log("golpeo paleta derecha");
				ballConfig.dir_x	*= 	(-1);
				makeHitBallSound();
			}
			if (ballConfig.x < 0) {
				scoreboard[1]++;
				ballConfig.x		=	W/2;
				ballConfig.y		=	generateNumber(0, H - ballConfig.size);
				passedPaddleLimit 	= 	false;
			}
			if (ballConfig.x > W-ballConfig.size) {
				scoreboard[0]++;
				ballConfig.x		=	W/2;
				ballConfig.y		=	generateNumber(0, H-ballConfig.size);
				passedPaddleLimit 	= 	false;
			}
		}
	}

	function paintBoard() {
		ctx.globalCompositeOperation 	= 	"source-over";
		ctx.fillStyle 					=	"#000000";
		ctx.fillRect(0,0,W,H);

		ctx.font						=	"80px Helvetica";
		ctx.fillStyle					=	"#FFFFFF";
		ctx.fillText("" + scoreboard[0], quarterW, 100);
		ctx.fillText("" + scoreboard[1], threeQuarterW, 100);

		for (var i = 0; i < players.length; i++) {
			players[i].paint();
			players[i].move();
		}
		ball.paint();
		ball.move();
	}

	//Control de paletas por medio del teclado por ASCII (tecla presionada y levantada)
	function handleKeyDown(e) {
		var code = e.which;
		switch (code) {
			case 79:
				// Arriba jugador 2;
				paddleDirection.p2.up	= 	true;
				break;
			case 75:
				// Abajo jugador 2;
				paddleDirection.p2.down	=	true;
				break;
			case 87:
				// Arriba jugador 1;
				paddleDirection.p1.up 	=	true;
				break;
			case 83:
				// Abajo jugador 1;
				paddleDirection.p1.down = 	true;
				break;
		}
	}

	function handleKeyUp(e) {
		var code = e.which;
		switch (code) {
			case 79:
				// Arriba jugador 2 [DETENIDO];
				paddleDirection.p2.up 	= 	false;
				break;
			case 75:
				// Abajo jugador 2 [DETENIDO];
				paddleDirection.p2.down	= 	false;
				break;
			case 87:
				// Arriba jugador 1 [DETENIDO];
				paddleDirection.p1.up 	= 	false;
				break;
			case 83:
				// Abajo jugador 1 [DETENIDO]";
				paddleDirection.p1.down	=	false;
				break;
		}
	}

	function generateNumber(min,max) {
  		return Math.round(Math.random() * (max - min)) + min;
	}

	function makeHitBallSound() {
		var audio = document.getElementById('hitBall');
		if (audio.paused){
			audio.play();
		} else {
			audio.pause();
			audio.currentTime = 0;
		}
	}

	document.addEventListener("keydown", handleKeyDown);
	document.addEventListener("keyup", handleKeyUp);
}
