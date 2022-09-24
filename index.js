const express = require("express");
// qq o express faz?
const app = express(); //chamando o express como função
// criei uma nova aplicação pra mim

const sqlite = require("sqlite"); //chamando o banco de dados

//---------resolvendo essa merda do sqlite3 com a versão 4
const sqlite3 = require('sqlite3')
const {open} = require('sqlite')

async function openDB (){
    return open({
        filename : './banco.sqlite',
        driver: sqlite3.Database
    })
}

/* const sqlite = require("sqlite"); //chamando o banco de dados
//geralmente o banco de dados roda em outro PC, pra isso teria que criar uma conexão entre os 2.
const dbConnection = sqlite.open("banco.sqlite ", { Promise });
*/

app.set("view engine", "ejs"); //eu quero deixar o js limpo, chamar o html separadamente
// com esse app.set o express vai procurar algo no meu diretório (pastas)
// ele espera encontrar um diretório chamado "views"

//caso ele bata no "/" do get e não ache nada o que fazemos?
//enviamos ele para o public, como?
app.use(express.static("public")); //aqui eu falo, olha se tu não achar o barra, vai pro diretorio "public"

app.get("/", async (request, response) => {
	//se vc pegar '/' do website
	//como funciona isso? quando o express recebe o request em barra via GET
	// como eu quero develver a informação para o browser
	// eu erspondo com uma mensagem
	// console.log(new Date)

	const db = await openDB()
	const categorias = await db.all('select * from categorias;')

	// aqui é o EJS funcionando, ele vai chamar o home.ejs e depois eu posso mandar valores
	response.render("home", {
		categorias // é um objeto, seria o equivalente a estar escrito categorias: categorias,
	});
});
app.get("/vaga", (request, response) => {
	response.render("vaga", {});
});

// sempre que estiver trabalhando com banco de dados precisamos trabalhar com operações assíncronas
// cada banco de dados tem um 'idioma'
// no caso dos SQL a linguagem é = SQL
async function init(){
    const db = await openDB();
    await db.run('create table if not exists categorias(id INTEGER PRIMARY KEY, categoria TEXT);')
	//const categorias = "Marketing team"
	//await db.run(`insert into categorias(categoria) values('${categorias}')`)
}

init();



/* ===================================== AQUI FUNCIONARIA SE FOSSE SOMENTE A VERSÃO 3,
/* ===================================== atualmente estamos na versão 4, ai pra criar o SQL precisa ser um objeto, e não uma promessa
const init = async () => {
	const db = await dbConnection; //primeira coisa que eu preciso fazer qnd estou conectando no banco de dados, eu preciso saber se a conexão está disponível
	await db.run(
		"create table if not exists categorias (id INTEGER PRIMARY KEY, caregoria TEXT);"
	);
};
init();	
*/
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
