window.onload=function(){
	var x=0,y=0;
	var canvas=document.getElementById("canvas"),
		ctx=canvas.getContext("2d"),
		W=window.innerWidth,
		H=window.innerHeight;
	canvas.width=W;
	canvas.height=H;
	var jugadores=[new Jugador("izquierda"), 
					new Jugador("derecha")];
	var marcador=[0,0];
	var movimientos={
		p1:{arriba:false,abajo:false},
		p2:{arriba:false,abajo:false}
	};
	var pelotita=new Pelota();

	setInterval(dibujar,1);
	function Jugador(lado){
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
				if(movimientos.p1.abajo){
					jugador.y=(jugador.y<H-jugador.largo)?jugador.y+jugador.recorrido:jugador.y;
				}
				if(movimientos.p1.arriba){
					jugador.y=(jugador.y>0)?jugador.y-jugador.recorrido:jugador.y;
				}
			}else{
				if(movimientos.p2.abajo){
					jugador.y=(jugador.y<H-jugador.largo)?jugador.y+jugador.recorrido:jugador.y;
				}
				if(movimientos.p2.arriba){
					jugador.y=(jugador.y>0)?jugador.y-jugador.recorrido:jugador.y;
				}
			}
		}
	}

	function Pelota(){
		var pelota = this;
		pelota.size=15;
		pelota.x=W/2;
		pelota.y=generarNumero(0,H-this.size);
		pelota.style="rgba(255,255,255,0.9)";
		pelota.dir_x=generarNumero(0,1)==0?7:-7;
		pelota.dir_y=generarNumero(0,1)==0?7:-7;
		pelota.dibujar=function(){
			ctx.beginPath();
			ctx.fillStyle=this.style;
			ctx.arc(this.x,this.y,this.size,10,0,Math.PI*2);
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
			var jugador1=jugadores[0];
			var jugador2=jugadores[1];
			
			if((pelota.x - pelota.size < (jugador1.x+jugador1.ancho)) && (pelota.y >= jugador1.y && pelota.y <= (jugador1.largo + jugador1.y))){
				// Izquierda
				pelota.dir_x *= (-1);
				reproducirSonido();
			}
			if((pelota.x + pelota.size >= jugador2.x) && (pelota.y >= jugador2.y && pelota.y <= (jugador2.largo + jugador2.y))){
				// Derecha
				pelota.dir_x *= (-1);
				reproducirSonido();
			}
			if(pelota.x<0){
				marcador[1]++;
				pelota.x=W/2;
				pelota.y=generarNumero(0,H-pelota.size);
			}
			if(pelota.x>W-pelota.size){
				marcador[0]++;
				pelota.x=W/2;
				pelota.y=generarNumero(0,H-pelota.size);
			}
		}
	}

	function dibujar(){
		ctx.globalCompositeOperation = "source-over";
		ctx.fillStyle="#000000";
		ctx.fillRect(0,0,W,H);

		ctx.font="120px Helvetica";
		ctx.fillStyle="#FFFFFF";
		ctx.fillText(""+marcador[0],300,100);
		ctx.fillText(""+marcador[1],1100,100);

		for(var i=0;i<jugadores.length;i++){
			jugadores[i].dibujar();
			jugadores[i].mover();
		}
		pelotita.dibujar();
		pelotita.mover();
	}

	//Control de paletas por medio del teclado por ASCII (tecla presionada y levantada)
	function teclaPresionada(evento){
		var codigo=evento.which;
		switch(codigo){
			case 79:
				// Arriba jugador 2;
				movimientos.p2.arriba=true;
				break;
			case 75:
				// Abajo jugador 2;
				movimientos.p2.abajo=true;
				break;
			case 87:
				// Arriba jugador 1;
				movimientos.p1.arriba=true;
				break;
			case 83:
				// Abajo jugador 1;
				movimientos.p1.abajo=true;
				break;
		}
	}
	function teclaLevantada(evento){
		var codigo=evento.which;
		switch(codigo){
			case 79:
				// Arriba jugador 2 [DETENIDO];
				movimientos.p2.arriba=false;
				break;
			case 75:
				// Abajo jugador 2 [DETENIDO];
				movimientos.p2.abajo=false;
				break;
			case 87:
				// Arriba jugador 1 [DETENIDO];
				movimientos.p1.arriba=false;
				break;
			case 83:
				// Abajo jugador 1 [DETENIDO]";
				movimientos.p1.abajo=false;
				break;
		}
	}

	function generarNumero(min,max){
  		return Math.round(Math.random() * (max - min)) + min;
	}

	function reproducirSonido(){
		var audio = document.getElementById('pelota');
		if(audio.paused){
			audio.play();
		}else{
			audio.pause();
			audio.currentTime = 0;
		}
	}
	document.addEventListener("keydown",teclaPresionada);
	document.addEventListener("keyup",teclaLevantada);
}
