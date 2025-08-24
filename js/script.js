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
		var jugador = this;
		jugador.lado = lado;
		jugador.ancho=60;
		jugador.largo=150;
		jugador.x=(lado=="izquierda")?0:W-60;
		jugador.y=generarNumero(0,H-jugador.largo);
		jugador.color="#FF0000";
		jugador.recorrido=7;
		jugador.dibujar=function(){
			ctx.fillStyle=jugador.color;
			ctx.fillRect(jugador.x,jugador.y,jugador.ancho,jugador.largo);
		}
		jugador.mover=function(){
			if(jugador.lado=="izquierda"){
				if(paddleDirection.p1.down){
					jugador.y=(jugador.y<H-jugador.largo)?jugador.y+jugador.recorrido:jugador.y;
				}
				if(paddleDirection.p1.up){
					jugador.y=(jugador.y>0)?jugador.y-jugador.recorrido:jugador.y;
				}
			}else{
				if(paddleDirection.p2.down){
					jugador.y=(jugador.y<H-jugador.largo)?jugador.y+jugador.recorrido:jugador.y;
				}
				if(paddleDirection.p2.up){
					jugador.y=(jugador.y>0)?jugador.y-jugador.recorrido:jugador.y;
				}
			}
		}
	}

	function Ball(){
		var pelota = this;
		pelota.size=15;
		pelota.x=W/2;
		pelota.y=generarNumero(0,H-pelota.size);
		pelota.style="rgba(255,255,255,0.9)";
		pelota.dir_x=generarNumero(0,1)==0?7:-7;
		pelota.dir_y=generarNumero(0,1)==0?7:-7;
		pelota.dibujar=function(){
			ctx.beginPath();
			ctx.fillStyle=pelota.style;
			ctx.arc(pelota.x,pelota.y,pelota.size,10,0,Math.PI*2);
			ctx.fill();
		};
		pelota.mover=function(){
			pelota.x=pelota.x+pelota.dir_x;
			pelota.y=pelota.y+pelota.dir_y;
			if(pelota.y<0){
				pelota.dir_y *= (-1);
			}
			if(pelota.y>H-pelota.size){
				pelota.dir_y=pelota.dir_y*(-1);
			}
			var jugador1 = players[0];
			var jugador2 = players[1];
			
			if((pelota.x - pelota.size < (jugador1.x+jugador1.ancho)) && (pelota.y >= jugador1.y && pelota.y <= (jugador1.largo + jugador1.y))){
				// Izquierda
				pelota.dir_x *= (-1);
				hitBall();
			}
			if((pelota.x + pelota.size >= jugador2.x) && (pelota.y >= jugador2.y && pelota.y <= (jugador2.largo + jugador2.y))){
				// Derecha
				pelota.dir_x *= (-1);
				hitBall();
			}
			if(pelota.x<0){
				scoreboard[1]++;
				pelota.x=W/2;
				pelota.y=generarNumero(0,H-pelota.size);
			}
			if(pelota.x>W-pelota.size){
				scoreboard[0]++;
				pelota.x=W/2;
				pelota.y=generarNumero(0,H-pelota.size);
			}
		}
	}

	function paintBoard(){
		ctx.globalCompositeOperation = "source-over";
		ctx.fillStyle="#000000";
		ctx.fillRect(0,0,W,H);

		ctx.font="120px Helvetica";
		ctx.fillStyle="#FFFFFF";
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

	function hitBall(){
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
