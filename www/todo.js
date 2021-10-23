var socket = io();

/*Lista con todas las actividades a realizar por el usuario*/
let tasks = [];

/*Variables para el control táctil*/
let start_x = 0;
let end_x = 0;
let start_time = 0;
const TIME_THRESHOLD = 200;
const SPACE_THRESHOLD = 200;

/*Controlamos el control táctil de nuestra aplicación*/
/*document.addEventListener("touchstart", function(e){
    e.preventDefault();
    start_x = e.targetTouches[0].screenX;
    start_time = e.timeStamp;
}, {passive: false});

document.addEventListener("touchmove", function(e){
    e.preventDefault();
    end_x = e.changedTouches[0].screenX;
}, {passive: false});

document.addEventListener("touchend", function(e){
    e.preventDefault();
    end_time = e.timeStamp;
    if(end_time - start_time < TIME_THRESHOLD && end_x - start_x > SPACE_THRESHOLD){
        remove();
    }
});*/

/*Añade una tarea a la lista de tareas de nuestra aplicación*/
function add() {
    /*Variable que controla los id's dentro de nuestra lista*/
    let counter = 1;
    /*Variable que controla nuestros id's dentro de nuestro fichero task.json*/
    let id = tasks.length + 1;
    /*Creamos nuestra nueva tarea*/
    if (document.getElementById("task").value != '') {
        var task = {
            "id": id,
            "title": document.getElementById("task").value,
            "done": false,
        };
        /*Añadimos nuestra tarea al inicio de nuestra lista*/
        //console.log(load_tasks());
        //tasks.unshift(task);
        socket.emit("new-task", task);
        /*Reasignamos los id's a las tareas de nuestra lista*/
        for (i = 0; i < tasks.length; i++) {
            tasks[i].id = counter;
            counter++;
        };
    } else {
        console.log("Por favor, añade una tarea a la lista");
    }
    //console.log(tasks);
}

// function insertInHTML(array) {

// }

// /*Elimina una tarea de nuestra lista*/
// function remove(e) {

// }


async function load_tasks() {
    const response = await fetch("/tasks/all_tasks");
    const data = await response.text();
    tasks = JSON.parse(data);
}


load_tasks();
