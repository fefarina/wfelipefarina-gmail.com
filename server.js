// Usando express para criar e configurar o servidor
const express = require('express');
const server = express()

const db = require('./db');


// const ideas = [
//     {
//         img:"https://image.flaticon.com/icons/svg/2729/2729007.svg",
//         title:"Curso de Programação",
//         category:"Cursos de Programação",
//         description:" Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quidem at temporibus repellendus",
//         url:"https://rocketseat.com.br"
//     },
//     {
//         img:"https://image.flaticon.com/icons/svg/2729/2729005.svg",
//         title:"Exercícios",
//         category:"Exercícios",
//         description:" Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quidem at temporibus repellendus",
//         url:"https://rocketseat.com.br"
//     },
//     {
//         img:"https://image.flaticon.com/icons/svg/2729/2729027.svg",
//         title:"Meditação",
//         category:"Meditação",
//         description:" Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quidem at temporibus repellendus",
//         url:"https://rocketseat.com.br"
//     },
//     {
//         img:"https://image.flaticon.com/icons/svg/2729/2729027.svg",
//         title:"Programação",
//         category:"Cursos de Programação",
//         description:" Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quidem at temporibus repellendus",
//         url:"https://rocketseat.com.br"
//     }
// ]

// Configurar arquivos estaticos
server.use(express.static('backup'))

// Habilitar uso do req.body
server.use(express.urlencoded({ extended:true }))

// Configuração do nunjucks
const nunjucks = require('nunjucks');
nunjucks.configure('views', {
    express: server,
    noCache: true,
})

// Criei uma rota/
// e capturo o pedido do cliente para responder

server.get('/', function(req, res) {

    db.all(`SELECT * FROM ideas`, function(err, rows){
        if (err) {
            console.log(err)
            return res.send('Erro no banco de dados')
        }

            const reversedIdeas = [...rows].reverse();
                
            let lastIdeas = []
            for (idea of reversedIdeas) {
                if (lastIdeas.length <2 ) {
                    lastIdeas.push(idea);
                }
            }




            return res.render('index.html', { ideas: lastIdeas })
                })

    
});

server.get('/ideias', function(req, res) {



    db.all(`SELECT * FROM ideas`, function(err, rows){

        if (err) {
            console.log(err)
            return res.send('Erro no banco de dados')
        }

        const reversedIdeas = [...rows].reverse();
    
        return res.render('ideias.html', { ideas: reversedIdeas})

    })


})

server.post('/', function(req, res) {

    // INSERIR DADOS NA TABELA
        const query = `
        INSERT INTO ideas(
            image,
            title,
            category,
            description,
            link
        ) VALUES (?,?,?,?,?);
    `

        const values = [
            req.body.image,
            req.body.title,
            req.body.category,
            req.body.description,
            req.body.link,         
        ]



        db.run(query, values, function(err){
            if (err) {
                console.log(err)
                return res.send('Erro no banco de dados')
            }
            
            return res.redirect('/ideias')
            
        })       

})


// Ligando servidor na porta 3000;
server.listen(3000);


