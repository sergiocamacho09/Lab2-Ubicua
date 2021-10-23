var socket = io();

/*Lista con todas las actividades a realizar por el usuario*/
let tasks = [];

/*Variables para el control táctil*/
let start_x = 0;
let end_x = 0;
let start_time = 0;
const TIME_THRESHOLD = 200;
const SPACE_THRESHOLD = 100;

/*Obtenemos la lista de tareas al conectarnos con el cliente por primera vez*/
load_tasks();
/*Añadimos nuestras tareas a la aplicación HTML*/
insertInHTML(tasks);

/*Controlamos el control táctil de nuestra aplicación*/
var div = document.querySelector('#current_tasks');

div.addEventListener("touchstart", function (e) {
    e.preventDefault();
    start_x = e.targetTouches[0].screenX;
    start_time = e.timeStamp;
}, { passive: false });

div.addEventListener("touchmove", function (e) {
    e.preventDefault();
    end_x = e.changedTouches[0].screenX;
}, { passive: false });

div.addEventListener("touchend", function (e) {
    e.preventDefault();
    end_time = e.timeStamp;
    if (end_x - start_x > SPACE_THRESHOLD) {
        var touch = parseInt(e.target.id, 10);
        if (touch != null && touch != NaN) remove(touch);
        load_tasks();
    }
    if (end_time - start_time >= TIME_THRESHOLD) {
        var touch = parseInt(e.target.id, 10);
        if (touch != null && touch != NaN) done(touch);
        load_tasks();
    }
});



/*Añade una tarea a la lista de tareas de nuestra aplicación*/
function add() {
    /*Creamos nuestra nueva tarea*/
    if (document.getElementById("task").value != '') {
        var task = document.getElementById("task").value;
        document.getElementById("task").value = '';
        /*Envíamos nuestra tarea al servidor para que la registre en el JSON*/
        socket.emit("new-task", task);
        /*Recuperamos la lista de tareas para añadirla a nuestro array de tareas*/
        load_tasks();
    } else {
        console.log("Por favor, añade una tarea a la lista");
    }
};


/*Añadimos las tareas a nuestra aplicación HTML*/
function insertInHTML(array) {
    /*Seleccionamos el div general en el que irán nuestras tareas*/
    var previous_div2 = document.querySelector('#current_tasks');
    /*Creamos los divs que contendrán cada una de nuestras tareas */
    var text = "";
    for (i = array.length - 1; i >= 0; i--) {
        text += "<div class='task' id='" + array[i].id + "'>" + array[i].title + "</div>";
    };
    previous_div2.innerHTML = text;
};

/*Filtra por una tarea buscada dentro de nuestra aplicación*/
function filter() {
    var text_to_filter = document.getElementById("task").value;
    document.getElementById("task").value = '';
    var filter_arr = [];
    for (i = 0; i < tasks.length; i++) {
        var aux = tasks[i].title.toUpperCase();
        if (aux.includes(text_to_filter.toUpperCase())) {
            filter_arr.push(tasks[i]);
        };
    };
    insertInHTML(filter_arr);
};

/*Elimina una tarea de nuestra lista*/
function remove(id) {
    socket.emit("remove_task", id);
};


/*Marca como completada una tarea en la aplicación HTML*/
function done(id) {
    socket.emit("task_done", id);
};



async function load_tasks() {
    const response = await fetch("/tasks/all_tasks");
    const data = await response.text();
    if (data.length != 0) {
        tasks = JSON.parse(data);
        insertInHTML(tasks);
        console.log(tasks);
    } else {
        console.log("Ninguna tarea en estos momento, añade una");
    };

};



