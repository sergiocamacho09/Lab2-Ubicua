var messages = [
  {
    author: "Sergio",
    text: "CALVOOOOOOOOOOOOOOO",
  },
];
/*aplicación express que pasa a un servidor http*/
const express = require('express');
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(express.static('www'));

io.on("connection", function(socket){
  console.log("nuevo cliente | Socket: " + socket.id);

  socket.emit('messages', messages);

  /*socket.on("message_evt", function(message){
    console.log(socket.id, JSON.parse(message));
    socket.emit("message_evt", message);
  });*/
  socket.on("new-message", function(data){
    messages.push(data);

    socket.emit("messages", messages);
  })
});

server.listen(3000, function() {
  console.log('Servidor encendido')
});
