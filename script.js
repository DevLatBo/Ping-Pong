window.onload=function(){
	var x=0,y=0;
	var canvas=document.getElementById("canvas"),
		ctx=canvas.getContext("2d"),
		W=window.innerWidth,
		H=window.innerHeight;
	
	var jugadores=[new Jugador("izquierda"), new Jugador("derecha")];
	var pelotita=new Pelota();


	setInterval(dibujar,1);
	
	function Jugador(lado){
		this.x=(lado=="izquierda")?0:W-40;
		this.y=H/2;
		this.ancho=20;
		this.largo=150;
		this.color="#FF0000";
		this.dibujar=function(){
			ctx.fillStyle=this.color;
			ctx.fillRect(this.x,this.y,this.ancho,this.largo);
		}
	}
	function Pelota(){
		this.x=W/2;
		this.y=H/2;
		this.size=10;
		this.style="#FFFFFF";
		this.dibujar=function(){
			ctx.beginPath();
			ctx.fillStyle=this.style;
			ctx.arc(this.x,this.y,this.size,10,0,Math.PI*2);
			ctx.fill();
		}
	}
	function dibujar(){
		ctx.globalCompositeOperation = "source-over";
		canvas.width=W;
		canvas.height=H;
		ctx.fillStyle="#000000";
		ctx.fillRect(0,0,W,H);
		ctx.fillStyle="#FF0000";
		ctx.fillRect(0,360,40,170);
		ctx.fillStyle="#FF0000";
		ctx.fillRect(W-40,360,40,150);
		pelotita.dibujar();
	}
	function teclaPresionada(evento){
		console.log(evento.keyCode);
		var codigo=evento.keyCode;
		switch(codigo){
			case 87:
				console.log("arriba jugador 2");
				break;
			case 83:
				console.log("abajo jugador 2");
				break;
			case 38:
				console.log("arriba jugador 1");
				break;
			case 40:
				console.log("abajo jugador 1");
				break;
		}
	}
	function teclaLevantada(evento){
		console.log(evento.keyCode);
		var codigo=evento.keyCode;
		switch(codigo){
			case 87:
				console.log("arriba jugador 2 [DETENIDO]");
				break;
			case 83:
				console.log("abajo jugador 2 [DETENIDO]");
				break;
			case 38:
				console.log("arriba jugador 1 [DETENIDO]");
				break;
			case 40:
				console.log("abajo jugador 1 [DETENIDO]");
				break;
		}
	}
	document.addEventListener("keydown",teclaPresionada);
	document.addEventListener("keyup",teclaLevantada);
}