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

  socket.on("new-task", function(task){
    /*Usamos el array auxiliar para guardar nuestras nuevas tareas*/
    aux.push(task);
    /*Convertimos nuestro array auxilira a formato JSON*/
    var new_task = JSON.stringify(aux, null, '\t');
    /*Leemos nuestro fichero y añadimos nuestro array con todas las tareas*/
    fs.writeFile('task.json', new_task, function(err){
      if(err) throw err;
      console.log("Tarea añadida!");
    });
  });
});

server.listen(3000, function() {
  console.log('Servidor conectado')
});
