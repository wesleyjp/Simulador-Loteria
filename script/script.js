var lista = [];
var marcado = [];
var acertos = [];
var bola = 0;
var wrap = 10;
var jogo = 0;
var bjogo = 0;//para avaliar qual o melhor jogo. função bestplay()
var preco = [0.0, 3.50, 24.50, 98.00, 294.00, 735.00, 1617.00, 3234.00, 6006.00, 10510.50, 17517.50];
var total = 0;
var velocidade = 0 ; //elemento(tempo).value; //tempo de delay para gerar um novo jogo
var som = true;
var audio = new Audio('./sound/notify.mp3');
var tick = new Audio('./sound/tick.mp3');
window.top.onselectstart=new Function ("return false");

elemento("saida").value=""; //Limpa Console

while (bola < 15) {
	document.write("<div class=marca id=m_"+ bola +"></div>")
	bola++;
}

document.write("<br><br><br>")
bola = 1;

while (bola <= 60) {
	document.write("<div class=bola id=b_"+ bola +" onclick=clickk(this.innerText)>"+ bola +"</div>")
	if (bola == wrap) {
		document.write("<br><br><br><br>")
		wrap+=10;
	}
	bola++;
}

saida("\t\t Bem Vindo ao Simulador Mega-Sena\n\t\t\t Teste sua sorte!\n\n");
ponteiro();

function jogar() {
	if (valida(marcado.length) == false){alert("Voce deve marcar de 6 a 15 numeros");return} 
	compara = 0;
	pontos = 0;
	acertos = [];
	jogo++;
	bjogo++;
	atualizaTotal();
	//decorido();

	saida("Jogo: "+jogo)
	gerar(6); //sao sorteads seis numeros por jogo

	for (var i in marcado) { //verifica numeros sorteados com marcados, casso seja igual marca-se pontos.
		if (filtro(marcado[i],lista) == true ) {
			acertos.push(marcado[i]);
			pontos++;
		};

		compara++;
	}

	if (pontos >= 4) {
		jogo=0;
		for (let i=0; i<acertos.length; i++){elemento("b_"+acertos[i]).style = "background-color: #2cb5e8;border: solid 1px blue;"}
		saida("\n_____________________________________________________________")
		saida("\nGANHOU!");
		saida("Numeros Marcados:  "+marcado);
		saida("Numeros Sorteados: "+lista);
		saida("Numeros Acertados: "+acertos);
		
		switch(acertos.length) {

			case 4:
				saida("....... Quadra");
				break;
			case 5:
				saida("....... Quina");
				break;
			case 6:
				saida("....... Sena");
				break;
		}

		saida("_____________________________________________________________")

		//alert("GANHOU!")
		audio.play();
	} else {
		setTimeout(function() {jogar()}, velocidade);
		//requestAnimationFrame(jogar);
	}
}

function clickk(c){
	if (marcado.length > 14) {
		limpa();
		marcado = []; //adiciona numeros gerados aos slots
		for (var i = 0; i < 15; i++) {elemento("m_"+i).innerText="";}
	}

	if (filtro(parseInt(c),marcado) == false){ //usa parseInt para transformar string em inteiro
		//if (marcado.length > 14) {marcado.shift()} //remove o primeiro item da array
		marcado.push(parseInt(c)); 
		elemento("m_"+(marcado.length-1)).innerText=c;
		ponteiro();
		atualizaTotal();
		colori("b_"+c,1)
		tick.play();
	} else {
		alert("O numero "+c+" ja foi marcado.");
	}
}

function start(){
	if (valida(elemento('valor_01').value) == true) {
		gerar(elemento('valor_01').value);
	} else {
		alert("Voc\u00ea deve marcar de 6 a 15 n\u00fameros");
	}//valida a entrada: entrada >= 6 <= 15
	
	marcado = [];
	marcado = lista;

	ponteiro();
	diplayNumbers()
	atualizaTotal();
}

function diplayNumbers() {
	//escreve os numeros da array "marcado" nos divs id "m_"
	for (let i = 0; i < 15; i++) {elemento("m_"+i).innerText="";}
	for (i in marcado) {
		elemento("m_"+i).innerText = marcado[i];
	}	
}

function gerar(n) {
	limpa();
	lista = [];
	// n deve ser 6 ou 15 (quantidade oficial para registrar megasena)
	for (var i=1; i<=n; i++) {
		var rand = Math.floor(Math.random() * (60 - 1 + 1)) + 1;
		if (filtro(rand,lista) == false) {
			lista.push(rand);
			colori("b_"+rand,1);
			ponteiro();
			tick.play();
		} else {i--;}
	}
	saida("\n" + lista + "\n____________________________________________"); // CONSOLE
}

function valor() {
	if (marcado.length >= 6) {
		return preco[(marcado.length-5)];
	} else {
		return preco[0];
	}

}

function atualizaTotal() {
	
	total = numberToReal(valor());
	total2 = numberToReal(valor()*jogo);
	elemento("total").innerText=total;
	elemento("total2").innerText=total2;
	
}

function numberToReal(numero) {
	return numero.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
	//deprecated
   /* var numero = numero.toFixed(2).split('.');
    numero[0] = "R$ " + numero[0].split(/(?=(?:...)*$)/).join('.');
    return numero.join(','); */
}

function decorido() { //desativado
	var dia = jogo;
	var mes = jogo/8; 
	var ano = (jogo/96);

	var mes = Number.isInteger(mes) ? mes : 0;
	var mes = Number.isInteger(ano) ? ano : 0;

	elemento("dma").innerText="Dia: "+dia+"Mes: "+mes+"Ano: "+ano;
}

function colori(a,b){
	//recebe o id(string) da div e o valor 0 ou 1.
	// 0 apaga a cor e 1 colori.
	switch (b) {
		case 0:
			document.getElementById(a).style="background-color: lightblue";
			break;
		case 1:
			document.getElementById(a).style="background-color: rgb(50,255,50)";
			break;
	}
	
}

function ponteiro() {
	for (let i=0; i<15; i++) {elemento("m_"+i).style="border: 2px solid black";}
	if (marcado.length < 15) {
		elemento("m_"+(marcado.length)).style="border: 2px solid red";
	} else {elemento("m_0").style="border: 2px solid red";}
}

function elemento(idE){
	return document.getElementById(idE);
}

function filtro(f,ary) {
	// retorna verdadeiro se o argumento existir
	// dentro do array "lista"
	return ary.indexOf(f) > -1 ? true : false;
}

function saida(str) {
	elemento("saida").value+=str+"\n";
	elemento("saida").scrollTop = elemento("saida").scrollHeight; //scroll up
}

function valida(valid) {
		if (valid >= 6 && valid <= 15) {
			return true;
		} else {
			return false;
		}
}

function cLimpar() {
		elemento("saida").value="";
		window.location.reload();
	}

function limpa(){
	for (i=1;i<=60;i++) {
		colori("b_"+i,0);
	}
}

elemento("velocidade").oninput = function() {
  elemento("veloSp").innerText = this.value;
  velocidade = this.value;
}

elemento("som").onclick = function() {
	if (som) {
		audio.muted = true;
		tick.muted = true;
	} else {
		audio.muted = false;
		tick.muted = false;
	}

	som ? this.style = "background-image: url('./img/audio-volume-muted.png')" : this.style = this.style = "background-image: url('./img/audio-volume-high.png')" ;
	som = som ? false : true;
}

function asinar() {
	document.querySelector('footer').innerText="\u0057\u0065\u0073\u006C\u0065\u0079\u00A0\u004A\u0075\u006E\u0069\u006F\u00A0\u00A9\u0032\u0030\u0031\u0039";
}

//funções para achar os numeros que mais são sorteados
/*

function bestplay() {
	audio.muted = true;
	tick.muted = true;
	gerar(15);
	marcado = lista;
	jogar();
	avalia()
}


function avalia(){
	
	var BNumber = {n:0,v:0};
	var bestNumbers = [];

	for (let i=1; i <= 60; i++) {
		bestNumbers[i] = BNumber;
	}

	for (i in acertos) {
		bestNumbers[]

	}
	bestNumbers.sort()
	console.log(bestNumbers)
	
}

function avalia(str,arry) {
	for (i in arry) {
		if (arry.indexOf(str) != -1) {return true} else {return false};
	}
}

*/