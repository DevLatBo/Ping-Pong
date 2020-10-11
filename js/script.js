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
		this.lado = lado;
		this.ancho=60;
		this.largo=150;
		this.x=(lado=="izquierda")?0:W-60;
		this.y=generarNumero(0,H-this.largo);
		this.color="#FF0000";
		this.recorrido=7;
		this.dibujar=function(){
			ctx.fillStyle=this.color;
			ctx.fillRect(this.x,this.y,this.ancho,this.largo);
		}
		this.mover=function(){
			if(this.lado=="izquierda"){
				if(movimientos.p1.abajo){
					this.y=(this.y<H-this.largo)?this.y+this.recorrido:this.y;
				}
				if(movimientos.p1.arriba){
					this.y=(this.y>0)?this.y-this.recorrido:this.y;
				}
			}else{
				if(movimientos.p2.abajo){
					this.y=(this.y<H-this.largo)?this.y+this.recorrido:this.y;
				}
				if(movimientos.p2.arriba){
					this.y=(this.y>0)?this.y-this.recorrido:this.y;
				}
			}
		}
	}

	function Pelota(){
		this.size=15;
		this.x=W/2;
		this.y=generarNumero(0,H-this.size);
		this.style="rgba(255,255,255,0.9)";
		this.dir_x=generarNumero(0,1)==0?7:-7;
		this.dir_y=generarNumero(0,1)==0?7:-7;
		this.dibujar=function(){
			ctx.beginPath();
			ctx.fillStyle=this.style;
			ctx.arc(this.x,this.y,this.size,10,0,Math.PI*2);
			ctx.fill();
		};
		this.mover=function(){
			this.x=this.x+this.dir_x;
			this.y=this.y+this.dir_y;
			if(this.y<0){
				this.dir_y *= (-1);
			}
			if(this.y>H-this.size){
				this.dir_y=this.dir_y*(-1);
			}
			var jugador1=jugadores[0];
			var jugador2=jugadores[1];
			
			if((this.x - this.size < (jugador1.x+jugador1.ancho)) && (this.y >= jugador1.y && this.y <= (jugador1.largo + jugador1.y))){
				this.dir_x *= (-1);
			}
			if((this.x + this.size >= jugador2.x) && (this.y >= jugador2.y && this.y <= (jugador2.largo + jugador2.y))){
				this.dir_x *= (-1);
			}
			if(this.x<0){
				marcador[1]++;
				this.x=W/2;
				this.y=generarNumero(0,H-this.size);
				reproducirSonido();
			}
			if(this.x>W-this.size){
				marcador[0]++;
				this.x=W/2;
				this.y=generarNumero(0,H-this.size);
				reproducirSonido();
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
	/*
		Control de paletas por medio del teclado por ASCII (tecla presionada y levantada)
	*/
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
