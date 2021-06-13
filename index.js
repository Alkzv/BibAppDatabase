const express = require('express');
const cors = require("cors")
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', function(req, res){res.send('Conectado!')});

/*
  Servidor propriamente dito
*/

const users = [
    {id: 0, name: "Alkimim", sex: "Masculino", email: "alkimim@gmail.com", password: "123456", value: 8.5, favorite: "The Mentalist"},
 	{id: 1, name: "Guedes", sex: "Masculino", email: "guedes@gmail.com", password: "789456", value: 6.1, favorite: "Libraries"}
]

const endpoint = "/users";

app.get(endpoint, function(req, res){
    res.send(users.filter(Boolean));
});

app.get(`${endpoint}/:id`, function(req, res){
    const id = req.params.id;
    const user = users[id];

    if (!user){
        res.send("{}");
    } else {
        res.send(user);
    }   
});

app.post(endpoint, (req, res) => {
    const user = {
        id : users.length,
        name : req.body["name"],
        sex : req.body["sex"],
        email: req.body["email"],
        password: req.body["password"],
        value: req.body["value"],
        favorite: req.body["favorite"]
    };
    users.push(user);
    res.send("1");

    notify();
});

app.put(`${endpoint}/:id`, (req, res) =>{
    const id = parseInt(req.params.id);
    const user = {
        id : id,
        name : req.body["name"],
        sex : req.body["sex"],
        email: req.body["email"],
        password: req.body["password"],
        value: req.body["value"],
        favorite: req.body["favorite"]
    };
    users[id] = user;
    res.send("1");

    notify();
});

app.delete(`${endpoint}/:id`, (req, res) => {
    const id = req.params.id;
    delete users[id];
    res.send("1");

    notify();
});

/*
  Criar um socket para notificar usuários das mudanças.
*/

const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Comunicação
const INVALIDATE = 'invalidate';

function notify(){
    io.sockets.emit(INVALIDATE, 1);
}

server.listen(process.env.PORT || 3000);
