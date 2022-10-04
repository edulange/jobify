const express = require("express");
// qq o express faz?
const app = express(); //chamando o express como função
// criei uma nova aplicação pra mim

const bodyParser = require('body-parser')

const path = require('path')
const port = process.env.PORT || 3000  //o port vai ser process.env.PORT OUU 3000


const sqlite = require("sqlite"); //chamando o banco de dados

//---------resolvendo essa merda do sqlite3 com a versão 4
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

async function openDB() {
	return open({
		filename: "./banco.sqlite",
		driver: sqlite3.Database,
	});
}

app.set('views', path.join(__dirname, 'views'))
//===============================

/* const sqlite = require("sqlite"); //chamando o banco de dados
//geralmente o banco de dados roda em outro PC, pra isso teria que criar uma conexão entre os 2.
const dbConnection = sqlite.open("banco.sqlite ", { Promise });
*/
app.use(bodyParser.urlencoded({ extended: false }))

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

	const db = await openDB();
	const categoriasDb = await db.all("select * from categorias;"); // para criar categorias // chamamos categoriasDb pq veio do banco
	const vagas = await db.all("select * from vagas; ");
	const categorias = categoriasDb.map((cat) => {
		return {
			...cat, // "..." = spread operator
			vagas: vagas.filter((vaga) => vaga.categoria === cat.id),
		};
	});

	// aqui é o EJS funcionando, ele vai chamar o home.ejs e depois eu posso mandar valores
	response.render("home", {
		categorias, // é um objeto, seria o equivalente a estar escrito categorias: categorias,
	});
});
app.get("/vaga/:id", async (request, response) => {
	const db = await openDB();
	const vaga = await db.get(
		"select * from vagas where id = " + request.params.id
	);
	response.render("vaga", {
		vaga,
	});
});

app.get("/admin", (req, res) => {
	//req e res é a mesma coisa request e response
	res.render("admin/home");
});
//========================= pqq emcima não tem async e embaixo tem? simples, pq embaixo, ele depende dos dados do banco, então precisa ser assíncrona
app.get("/admin/vagas", async (req, res) => {
	const db = await openDB();
	const vagas = await db.all("select * from vagas; "); // aqui eu pego todas as vagas do banco
	// agora eu preciso renderizar tudo pro ejs
	res.render("admin/vagas", { vagas });
});
app.get("/admin/vagas/delete/:id", async(req, res) => {
	const db = await openDB()
	await db.run('delete from vagas where id = ' +  req.params.id) //limitamos para 1 por questões de segurança
	res.redirect('/admin/vagas') //se eu apaguei a vaga ela já foi resolvida, então eu posso pedir para o express redirecionar essa requisição para outro luga
})
app.get("/admin/vagas/nova", async (req, res) => {
	const db = await openDB()
	const categorias = await db.all('select * from categorias') 
	res.render('admin/nova-vaga', { categorias })
})	
app.post('/admin/vagas/nova', async (req, res) => { //"post clicar em salvar"
	const db = await openDB()
	const { titulo, descricao, categoria } = req.body
 
	await db.run(`insert into vagas(categoria, titulo, descricao) values('${categoria}', '${titulo}', '${descricao}')`);
	res.redirect('/admin/vagas') //eu vou deolver pra tela só os dados que vierem via formulário
})

app.get("/admin/vagas/editar/:id", async (req, res) => {
	const db = await openDB()
	const categorias = await db.all('select * from categorias') 
	const vaga = await db.get('select * from vagas where id = '+ req.params.id) // isso é pra eu deixar as informações que constavam antes de eu querer editar
	res.render('admin/editar-vaga', { categorias, vaga })
})	
app.post('/admin/vagas/editar/:id', async (req, res) => { //"post clicar em salvar"
	const db = await openDB()
	const { titulo, descricao, categoria } = req.body
	const { id } = req.params
 
	await db.run(`update vagas set categoria = '${categoria}', titulo = '${titulo}', descricao = '${descricao}' where id = ${id}`);
	res.redirect('/admin/vagas') //eu vou deolver pra tela só os dados que vierem via formulário
})

// sempre que estiver trabalhando com banco de dados precisamos trabalhar com operações assíncronas
// cada banco de dados tem um 'idioma'
// no caso dos SQL a linguagem é = SQL
async function init() {
	const db = await openDB();
	await db.run(
		"create table if not exists categoria(id INTEGER PRIMARY KEY, categoria TEXT);"
	);
	await db.run(
		"create table if not exists vagas(id INTEGER PRIMARY KEY, categoria INTEGER, titulo TEXT, descricao TEXT);"
	);
	//const categorias = "Séloco team"
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
app.listen(port, (err) => {
	//a função vai retornar um erro se não conseguir abrir a porta
	if (err) {
		console.log("não foi possível iniciar o servidor");
	} else {
		console.log("Servidor Jobify rodando...");
		//posso abrir uma janela com "localhost:3000"
	}
}); //portas < 1000 são portas "privilegiadas", 80 HTTP, 443 HTTPS (numero das portas)
