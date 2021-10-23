var socket = io();

/*Lista con todas las actividades a realizar por el usuario*/
let tasks = [];

/*Variables para el control táctil*/
let start_x = 0;
let end_x = 0;
let start_time = 0;
const TIME_THRESHOLD = 200;
const SPACE_THRESHOLD = 200;

/*Obtenemos la lista de tareas al conectarnos con el cliente por primera vez*/
load_tasks();
/*Añadimos nuestras tareas a la aplicación HTML*/
insertInHTML();

/*Controlamos el control táctil de nuestra aplicación*/
// document.addEventListener("touchstart", function(e){
//     e.preventDefault();
//     start_x = e.targetTouches[0].screenX;
//     start_time = e.timeStamp;
// }, {passive: false});

// document.addEventListener("touchmove", function(e){
//     e.preventDefault();
//     end_x = e.changedTouches[0].screenX;
// }, {passive: false});

// document.addEventListener("touchend", function(e){
//     e.preventDefault();
//     end_time = e.timeStamp;
//     if(end_time - start_time < TIME_THRESHOLD && end_x - start_x > SPACE_THRESHOLD){
//         remove();
//     }
// });



/*Añade una tarea a la lista de tareas de nuestra aplicación*/
function add() {
    /*Creamos nuestra nueva tarea*/
    if (document.getElementById("task").value != '') {
        var task = document.getElementById("task").value;
        /*Envíamos nuestra tarea al servidor para que la registre en el JSON*/
        socket.emit("new-task", task);
        /*Recuperamos la lista de tareas para añadirla a nuestro array de tareas*/
        load_tasks();
        console.log(tasks);
    } else {
        console.log("Por favor, añade una tarea a la lista");
    }
};


/*Añadimos las tareas a nuestra aplicación HTML*/
function insertInHTML() {
    /*Seleccionamos el div general en el que irán nuestras tareas*/
    var previous_div2 = document.querySelector('#current_tasks');
    /*Creamos los divs que contendrán cada una de nuestras tareas */
    var text = "";
    for(i = tasks.length - 1; i >= 0 ; i--){
        text += "<div class = 'task'>" + tasks[i].title + "</div>"; 
    };
    previous_div2.innerHTML = text;
};



// /*Elimina una tarea de nuestra lista*/
// function remove(e) {

// }



async function load_tasks() {
    const response = await fetch("/tasks/all_tasks");
    const data = await response.text();
    tasks = JSON.parse(data);
    insertInHTML();
    console.log(tasks);
};



