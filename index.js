let aux = [];
/*aplicación express que pasa a un servidor http*/
const express = require('express');
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

/*Usamos la librería file system para leer nuestro archivo JSON con las tareas a realizar*/
const fs = require('fs');

app.use(express.static('www'));
let counter = 0;
io.on("connection", function(socket){
  console.log("nuevo cliente | Socket: " + socket.id);
  
  /*Recargamos nuestro array auxiliar con las tareas guardadas en nuestro fichero JSON para evitar que se pierdan*/
  fs.readFile('task.json', function(err,data){
    if(err) throw err;
    if(data.length != 0) aux = JSON.parse(data);
    console.log(aux);
  });

  /*Añadimos una nueva tarea a nuestro archivo JSON para que se actualice en nuestra aplicación*/
  socket.on("new-task", function(task){
    /*Variable que controla los ID's dentro de nuestra lista de tareas*/
    
    /*Creamos nuestra nueva tarea con todos los datos para añadirla al array auxiliar*/
    var add_task = {
        "id": counter,
        "title": task,
        "done": false
    }

    if(aux.length == 0) counter = 0;
    counter++;
    /*Usamos el array auxiliar para guardar nuestras nuevas tareas*/
    aux.push(add_task);
    /*Convertimos nuestro array auxilira a formato JSON*/
    var new_task = JSON.stringify(aux, null, '\t');
    /*Leemos nuestro fichero y añadimos nuestro array con todas las tareas*/
    fs.writeFile('task.json', new_task, function(err){
      if(err) throw err;
      console.log("Tarea añadida!");
    });
    console.log(aux);
  });


  /*Eliminamos una tarea a nuestro archivo JSON para que se actualice en nuestra aplicación*/
  socket.on("remove_task", function(id){
    for(i = 0; i < aux.length; i++){
      if(aux[i].id == id){
        aux.splice(i,1);
      }
    }

    var new_task_list = JSON.stringify(aux, null, '\t');

    fs.writeFile('task.json', new_task_list, function(err){
      if(err) throw err;
      console.log("Tarea eliminada!");
    });
  });


  /*Marcamos una tarea como completada en nuestra aplicación*/
  socket.on("task_done", function(id){
    for(i = 0; i < aux.length; i++){
      if(aux[i].id == id){
        if(aux[i].done == false) aux[i].done = true;
        
      }
    }

    var new_task_list = JSON.stringify(aux, null, '\t');


    fs.writeFile('task.json', new_task_list, function(err){
      if(err) throw err;
      console.log("Tarea completada!");
    });
  })
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
