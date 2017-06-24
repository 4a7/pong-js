//canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var wHeight=(window.screen.availHeight);
var wWidth=(window.screen.availWidth);
wWidth=(Math.floor((wWidth*3/4)));
wHeight=(Math.floor((wHeight*2/3)));
canvas.width=wWidth;
canvas.height=wHeight;
var x = canvas.width/2;
var y = canvas.height/2;
var xInicial=x;
var yInicial=y;

//true si se puede usar el muose como controlador
var mouse=false;
var multiL=true; 		//paleta L manual
var multiR=true;		//paleta R manual
//apariencia
var gane_mensaje="Ganador";
var perdida_mensaje="Perdedor";
var final_mensaje="";
var colors=['Red','Green','Blue','RoyalBlue','Navy','Chartreuse','DarkSlateBlue','DarkOrange','Black','Tomato','Purple','Teal','SeaGreen','Salmon','Peru'];
var ballRadius = 10;
var dx = 5;
var dy = -4;
var dxInicial=dx;
var dyInicial=dy;
var color=colors[getRandom(colors.length)];
//paleta
var paddleHeight=75;
var paddleWidth=10;
var paddleLX=paddleWidth;
var paddleRX=canvas.width-(2*paddleWidth);
var paddleLY=canvas.height/2;
var paddleRY=canvas.height/2;
var colorR=colors[getRandom(colors.length)];
var colorL=colors[getRandom(colors.length)];
var colorMedio=colors[getRandom(colors.length)];
var upRPressed = false;
var downRPressed = false;
var upLPressed = false;
var downLPressed = false;
var deltaPaleta=7;	//velocidad de la paleta
var nivel=1;
var deltaPaletaFacil=5;
var deltaPaletaMedio=10;
var deltaPaletaDificil=15;
var deltaPaletaAutomatico=deltaPaletaFacil;
var deltaDeltaPaletaAutomatico=5;	//cuanto cambia la velocidad de la paleta en modo automatico al cambiar el nivel
//control
var finalizar=false;
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
//score
var livesL=0;
var livesR=0;
var pongs=0;
var lastPong=0;
/*
function establecerValores(){
	x = canvas.width/2;
	y = canvas.height-30;
	ballRadius = 10;
	dx = 2;
	dy = -2;
	paddleHeight=10;
	paddleWidth=75;
	paddleX=(canvas.width-paddleWidth)/2;
	rightPressed = false;
	leftPressed = false;
	finalizar=false;
	score=0;
	lives=3;
	brickRowCount = 3;
	brickColumnCount = 5;
	brickWidth = 75;
	brickHeight = 20;
	brickPadding = 10;
	brickOffsetTop = 30;
	brickOffsetLeft = 30;
	for(c=0; c<brickColumnCount; c++) {
		for(r=0; r<brickRowCount; r++) {
			bricks[c][r] = { x: 0, y: 0,status:1 };
		}
	}
	
}
*/
function mouseMoveHandler(e){
	canvas.off
	var relativeY = e.clientY - canvas.offsetTop;
	if(relativeY > 0 && relativeY < canvas.height && mouse) {
		paddleRY = relativeY - paddleHeight/2;
	}
}
function keyDownHandler(e) {
	if(e.keyCode == 38) {
		upRPressed = true;
	}
	else if(e.keyCode == 40) {
		downRPressed = true;
	}
	else if (e.keyCode == 87){
		upLPressed = true;
	}
	else if (e.keyCode == 83){
		downLPressed = true;
	}
	else if(e.keyCode == 77){	//m
		mouse=true;
	}
	else if(e.keyCode == 78){	//n
		mouse=false;
	}
	else if (e.keyCode == 66){	//b
		multiR=true;
	}
	else if (e.keyCode == 86){	//v
		multiR=false;
	}
	else if (e.keyCode == 67){	//c
		multiL=true;
	}
	else if (e.keyCode == 88){	//x
		multiL=false;
	}
	else if (e.keyCode == 76){	//l, aumentar el nivel de la computadora
		deltaPaletaAutomatico+=deltaDeltaPaletaAutomatico;
		/*
		if(nivel==1){
			nivel++;
			deltaPaletaAutomatico=deltaPaletaMedio;
		}
		else if (nivel==2){
			nivel++;
			deltaPaletaAutomatico=deltaPaletaMedio;
		}
		else if (nivel==3){
			deltaPaletaAutomatico=deltaPaletaDificil;
		}
		*/
	}
	else if (e.keyCode == 75){	//k, disminuir el nivel de la computadora
		if(deltaPaletaAutomatico-deltaDeltaPaletaAutomatico>0){
			deltaPaletaAutomatico-=deltaDeltaPaletaAutomatico
		}
		/*
		if(nivel==3){
			nivel--;
			deltaPaletaAutomatico=deltaPaletaMedio;
		}
		else if (nivel==2){
			nivel--;
			deltaPaletaAutomatico=deltaPaletaFacil;
		}
		else if (nivel==1){
			deltaPaletaAutomatico=deltaPaletaFacil;
		}
		*/
	}
}
function keyUpHandler(e) {
	if(e.keyCode == 38) {
		upRPressed = false;
	}
	else if(e.keyCode == 40) {
		downRPressed = false;
	}
	else if (e.keyCode == 87){
		upLPressed = false;
	}
	else if (e.keyCode == 83){
		downLPressed = false;
	}
}
function getRandom(max){
	return Math.floor(Math.random() * (max));
}

function drawBall(){
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.closePath();
}
function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}
function bounce(){
	var hit=false;
	/*
	if(x+dx>canvas.width-ballRadius || x+dx<ballRadius){
		dx=-dx;
		hit=true;
	}
	*/
	if(y+dy>canvas.height-ballRadius/2 || y+dy<ballRadius){
		dy=-dy;
		hit=true;
	}
	//R
	if(x + dx > canvas.width-2*paddleWidth-(ballRadius/2)){
		if(y>paddleRY && y<(paddleRY+paddleHeight)){
			//dx=-dx;
			hasHit();
			hit=true;
		}
		else{
			//R pierde una vida
			if(x+dx>=canvas.width+ballRadius){
				livesL++;
				//controlLives();
				restart();
				//drawResult("Punto para izquierda");
			}
			
			
			//sleepFor(1000);
		}
	}
	//L
	if( x+dx < 3*paddleWidth-(ballRadius/2)){
		if(y>paddleLY && y<(paddleLY+paddleHeight)){
			//dx=-dx;
			hasHit();
			hit=true;
		}
		else{
			if(x<=-ballRadius){
				livesR++;
				//controlLives();
				restart();
				//drawResult("Punto para izquierda");
			}
		}
	}
	if(hit){
		color=colors[getRandom(colors.length)];
	}
}
function drawLineaMedio(){
	ctx.beginPath();
	ctx.rect((canvas.width/2)-(paddleWidth/2), 0, paddleWidth, canvas.height);
	ctx.fillStyle = colorMedio;
	ctx.fill();
	ctx.closePath();
}
function drawPaddle(){
	//R
	//paleta R manual
	if(multiR){
		if(upRPressed && paddleRY > 0) {
			paddleRY -= deltaPaleta;
		}
		if(downRPressed && paddleRY < canvas.height-paddleHeight) {
			paddleRY += deltaPaleta;
		}
	}
	else{		//paleta R automatico
		if(y>paddleRY){
			paddleRY+=deltaPaletaAutomatico;
		}
		else if (y<paddleRY){
			paddleRY-=deltaPaletaAutomatico;
		}
	}
	
	ctx.beginPath();
	ctx.rect(paddleRX, paddleRY, paddleWidth, paddleHeight);
	ctx.fillStyle = colorR;
	ctx.fill();
	ctx.closePath();
	//L
	//paleta L manual
	if(multiL){
		if(upLPressed && paddleLY > 0) {
			paddleLY -= deltaPaleta;
		}
		if(downLPressed && paddleLY < canvas.height-paddleHeight) {
			paddleLY += deltaPaleta;
		}
	}
	else{	//paleta L automatico
		if(y>paddleLY){
			paddleLY+=deltaPaletaAutomatico;
		}
		else if (y<paddleLY){
			paddleLY-=deltaPaletaAutomatico;
		}
	}
	
	ctx.beginPath();
	ctx.rect(paddleLX, paddleLY, paddleWidth, paddleHeight);
	ctx.fillStyle = colorL;
	ctx.fill();
	ctx.closePath();
}
/*
function controlLives(){
	if(livesL==0){
		drawResult("Derecha ha ganado");
		finalizar=true;
	}
	if(livesR==0){
		drawResult("Izquierda ha ganado");
		finalizar=true;
	}
}

function collisionDetection() {
	for(c=0; c<brickColumnCount; c++) {
		for(r=0; r<brickRowCount; r++) {
			var b = bricks[c][r];
			if(b.status==1){
					if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
					dy = -dy;
					b.status=0;
					color=colors[getRandom(colors.length)];
					score++;
					if(score==(brickColumnCount*brickRowCount)){
						final_mensaje=gane_mensaje;
						finalizar=true;
						//alert("EOG");
						//document.location.reload();
					}
				}
			}
		}
	}
}
function drawScore(){
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Score: "+score, 8, 20);
}
*/
function hasHit(){
	var deltaSpeed=0.4;
	dx=-dx;
	var numX=getRandom(3);
	var numY=getRandom(3);
	var numX=numX/10;
	var numY=numY/10;
	if(dx<0){
		
		dx-=deltaSpeed;
		dx-=numX;
	}
	else{
		dx+=deltaSpeed;
		dx+=numX;
	}
	if(dy<0){
		dy-=deltaSpeed;
		dy-=numY;
	}
	else{
		dy+=deltaSpeed;
		dy+=numY;
	}
	
	
}
function restart(){
	if(dxInicial<0&&dx<0){
		dx=dxInicial*-1;
	}
	else{
		dx=dxInicial;
	}
	dy=dyInicial;
	x=xInicial;
	y=yInicial;
}
function drawResult(mensaje){
	ctx.font = "50px Arial";
	ctx.fillStyle = "black";
	ctx.fillText(mensaje, canvas.width/3.5, canvas.height/2);
}
function drawLives() {
	//R
	ctx.font = "26px Arial";
	ctx.fillStyle = colorL;
	ctx.fillText(livesL, (canvas.width/2)-52, 26);
	//L
	ctx.font = "26px Arial";
	ctx.fillStyle = colorR;
	ctx.fillText(livesR, canvas.width/2+39, 26);
}
function draw(){
	if(finalizar){
		return;
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawLineaMedio();
	drawBall();
	drawPaddle();
	//collisionDetection();
	//drawBricks();
	//drawScore();
	drawLives();
	x+=dx;
	y+=dy;
	bounce();
	requestAnimationFrame(draw);
	
}
function Reiniciar(){
	return function(){
		document.location.reload();
	}	
}
btnReiniciar=document.getElementById("btn_reiniciar");
btnReiniciar.onclick=Reiniciar();
draw();