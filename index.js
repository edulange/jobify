const express = require("express");
const app = express();
// o const express é um require o npm
// o const app é a função chamada

app.set('view engine', 'ejs')

/* caso o programa procure o "/" através do get e não ache
a gente vai criar uma forma de ele chegar no public */
app.use(express.static('public'))



app.get("/", (request, response) => {
	// console.log(new Date()); // to utilizando ejs agora
	//response.send("<h1>Olá dutera</h1>"); (pq vamos utilizar o ejs)
	response.render('home', {
		date: new Date()
	})
});
// se eu fizesse só isso não acontece nada
// pra isso a gente precisa um listener

app.listen(2800, (err) => {
	if (err) {
		console.log("não foi possível iniciar o servidor do jobify");
	} else {
		console.log("servidor jobify rodando");
	}
});
// o listen é um serviço.
// os serviços ouvem numa porta na máquina
// qnd eu dou um listen, eu to abrindo uma porta pra entrar
// se usa portas altas, para fins de teste
// na hora q for upar pro servidor precisa colocar 80 para http ou 443 para https
// o err é para retornar um erro caso não consiga abrir a porta

