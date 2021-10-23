let aux = [];
/*aplicación express que pasa a un servidor http*/
const express = require('express');
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

/*Usamos la librería file system para leer nuestro archivo JSON con las tareas a realizar*/
const fs = require('fs');

app.use(express.static('www'));
io.on("connection", function(socket){
  console.log("nuevo cliente | Socket: " + socket.id);

  /*Recargamos nuestro array auxiliar con las tareas guardadas en nuestro fichero JSON para evitar que se pierdan*/
  fs.readFile('task.json', function(err,data){
    if(err) throw err;
    aux = JSON.parse(data);
    console.log(aux);
  });

  socket.on("new-task", function(task){
    /*Variable que controla los ID's dentro de nuestra lista de tareas*/
    let counter = aux.length;
    console.log(counter);
    /*Creamos nuestra nueva tarea con todos los datos para añadirla al array auxiliar*/
    var add_task = {
        "id": counter,
        "title": task,
        "done": false
    }
    /*Usamos el array auxiliar para guardar nuestras nuevas tareas*/
    aux.push(add_task);
    /*Convertimos nuestro array auxilira a formato JSON*/
    var new_task = JSON.stringify(aux, null, '\t');
    /*Leemos nuestro fichero y añadimos nuestro array con todas las tareas*/
    fs.writeFile('task.json', new_task, function(err){
      if(err) throw err;
      console.log("Tarea añadida!");
    });
  });


});

app.get("/tasks/all_tasks", function(req,res){
  fs.readFile('task.json', function(err,data){
    if(err) throw err;
    res.send(data);
  });
});

server.listen(3000, function() {
  console.log('Servidor conectado')
});
