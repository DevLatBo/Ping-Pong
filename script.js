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
        this.x=(lado=="izquierda")?0:W-60;
		this.y=300;
		this.ancho=60;
		this.largo=150;
		this.color="#FF0000";
		this.recorrido=9;
		this.dibujar=function(){
			ctx.fillStyle=this.color;
			ctx.fillRect(this.x,this.y,this.ancho,this.largo);
		}
		this.mover=function(){
			if(this.lado=="izquierda"){
				if(movimientos.p1.abajo){
					this.y=this.y+this.recorrido;
				}
				if(movimientos.p1.arriba){
					this.y=this.y-this.recorrido;
				}
			}else{
				if(movimientos.p2.abajo){
					this.y=this.y+this.recorrido;
				}
				if(movimientos.p2.arriba){
					this.y=this.y-this.recorrido;
				}
			}
		}
	}
	function Pelota(){
		this.x=W/2;
		this.y=H/2;
		this.size=15;
		this.style="rgba(255,255,255,0.9)";
		this.dir_x=decidirDireccion(0,1)==0?10:-10;
		this.dir_y=decidirDireccion(0,1)==0?10:-10;
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
				this.dir_y=this.dir_y*(-1);
			}
			if(this.y>H-this.size){
				this.dir_y=this.dir_y*(-1);
			}
			var jugador1=jugadores[0];
			var jugador2=jugadores[1];
			if((this.x>jugador1.x && this.x<jugador1.x+jugador1.ancho) && (this.y>jugador1.y && this.y<jugador1.y+jugador1.largo)){
				this.dir_x=this.dir_x*(-1);
			}
			if((this.x>jugador2.x && this.x<jugador2.x+jugador2.ancho) && (this.y>jugador2.y && this.y<jugador2.y+jugador2.largo)){
				this.dir_x=this.dir_x*(-1);
			}
			if(this.x<0){
				marcador[1]++;
				this.x=W/2;
				this.y=H/2;
			}
			if(this.x>W-this.size){
				marcador[0]++;
				this.x=W/2;
				this.y=H/2;
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
	function teclaPresionada(evento){
		//console.log(evento.keyCode);
		var codigo=evento.which;
		switch(codigo){
			case 79:
				//console.log("arriba jugador 2");
				movimientos.p2.arriba=true;
				break;
			case 75:
				//console.log("abajo jugador 2");
				movimientos.p2.abajo=true;
				break;
			case 87:
				//console.log("arriba jugador 1");
				movimientos.p1.arriba=true;
				break;
			case 83:
				//console.log("abajo jugador 1");
				movimientos.p1.abajo=true;
				break;
		}
	}
	function teclaLevantada(evento){
		//console.log(evento.keyCode);
		var codigo=evento.which;
		switch(codigo){
			case 79:
				//console.log("arriba jugador 2 [DETENIDO]");
				movimientos.p2.arriba=false;
				break;
			case 75:
				//console.log("abajo jugador 2 [DETENIDO]");
				movimientos.p2.abajo=false;
				break;
			case 87:
				//console.log("arriba jugador 1 [DETENIDO]");
				movimientos.p1.arriba=false;
				break;
			case 83:
				//console.log("abajo jugador 1 [DETENIDO]");
				movimientos.p1.abajo=false;
				break;
		}
	}
	function decidirDireccion(min,max){
  		return Math.round(Math.random() * (max - min)) + min;
	}
	document.addEventListener("keydown",teclaPresionada);
	document.addEventListener("keyup",teclaLevantada);
}
