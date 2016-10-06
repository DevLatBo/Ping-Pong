window.onload=function(){
	var x=0,y=0;
	var canvas=document.getElementById("canvas"),
		ctx=canvas.getContext("2d"),
		W=window.innerWidth,
		H=window.innerHeight;
	//var pelotita=new Pelota();
	document.addEventListener('keydown',function(evt){
		console.log(evt.which);
	});
	ctx.beginPath();
	ctx.fillStyle = "red";
	ctx.strokeStyle="black";
	ctx.arc(50, 50, 5, 0, 2 * Math.PI, false);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
	setInterval(draw,1);
	
	function Pelota(){
		this.x=W/2;
		this.y=H/2;
		this.size=10;
		this.style="#FFFFFF";
		this.draw=function(){
			ctx.beginPath();
			ctx.fillStyle=this.style;
			ctx.arc(this.x,this.y,this.size,10,Math.pi*2);
			ctx.fill();
		}
	}
	function draw(){
		ctx.globalCompositeOperation = "source-over";
		canvas.width=W;
		canvas.height=H;
		ctx.fillStyle="#000000";
		ctx.fillRect(0,0,W,H);
		ctx.fillStyle="#FF0000";
		ctx.fillRect(0,360,40,170);
		ctx.fillStyle="#FF0000";
		ctx.fillRect(W-40,360,40,150);
	}

}