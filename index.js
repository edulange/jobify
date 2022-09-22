const express = require("express");
// qq o express faz?
const app = express(); //chamando o express como função
// criei uma nova aplicação pra mim

app.set('view engine', 'ejs') //eu quero deixar o js limpo, chamar o html separadamente
// com esse app.set o express vai procurar algo no meu diretório (pastas)
// ele espera encontrar um diretório chamado "views"


//caso ele bata no "/" do get e não ache nada o que fazemos?
//enviamos ele para o public, como?
app.use(express.static('public')) //aqui eu falo, olha se tu não achar o barra, vai pro diretorio "public"

app.get("/", (request, response) => {
	//se vc pegar '/' do website
	//como funciona isso? quando o express recebe o request em barra via GET
	// como eu quero develver a informação para o browser
	// eu erspondo com uma mensagem
   // console.log(new Date)


   // aqui é o EJS funcionando, ele vai chamar o home.ejs e depois eu posso mandar valores
    response.render('home', { 
    })  
});
app.get("/vaga", (request, response) => {

    response.render('vaga', { 
        
    })  
});

// só que eu ainda preciso: "falar pra minha máquina quando ele pegar a / eu vou responder"
// para fazer isso, usamos o listen
app.listen(3000, (err) => {
	//a função vai retornar um erro se não conseguir abrir a porta
	if (err) {
		console.log("não foi possível iniciar o servidor");
	} else {
		console.log("Servidor Jobify rodando...");
        //posso abrir uma janela com "localhost:3000"
	}
}); //portas < 1000 são portas "privilegiadas", 80 HTTP, 443 HTTPS (numero das portas)
