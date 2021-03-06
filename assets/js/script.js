var taskIdCounter = 0;

var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskInprogressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");

// create array to hold tasks for saving 
var tasks = [];

var taskFormHandler = function(event) {
event.preventDefault();
var taskNameInput = document.querySelector("input[name='task-name']").value
var taskTypeInput = document.querySelector("select[name='task-type']").value

// check if input values are empty strings 
if (!taskNameInput || !taskTypeInput) {
    alert("You need to refill out the task form!");
    return false;
}

// reset form fields for next task to be entered
document.querySelector("input[name='task-name']").value = "";
document.querySelector("select[name='task-type']").selectIndex = 0;

// check if task is new or one being edited by seieng if it has a data-task-id attribute
var isEdit = formEl.hasAttribute("data-task-id");

if (isEdit) {
    var taskId =formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskType, taskId);
} else {
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,
        status: "to do",
    };

    createTaskEl(taskDataObj);
}
};

var createTaskEl = function (taskDataObj) {
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.setAttribute("data-task-id", taskIdCounter);

// create div to hold task info and add to list item
var taskInfoEl = document.createElement("div");
taskInfoEl.className = "task-info";
taskInfoEl.innerHTML = 
"<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
listItemEl.appendChild(taskInfoEl);

// create task actions (buttons and select) for task
var taskActionsEl = createTaskActions(taskIdCounter);
listItemEl.appendChild(taskActionsEl);

switch (taskDataObj.staus) {
    case "to do":
        taskActionsEl.querySelector("select[name='status-change']").selectIndex = 0;
        tasksToDoEl.append(listItemEl);
        break;
        case "in progress":
            tasksToDoEl.querySelector("select[name='status-change']").selectIndex = 1;
            tasksCompletedEl.append(listItemEl);
            break;
            default:
                console.log("Something went wrong!");
}

// save task as an object with name, type, status, and ifd properties then push it into tasks array
taskDataObj.id = taskIdCounter;

tasks.push(taskDataObj);

// save tasks to localstorage
saveTasks();

// increase task counter for next unique id
taskIdCounter++;
};

var createTaskActions = function(taskId) {
    // create contanier to hold elements
    var actionContainerEl = document.createElement("div");
    actionContainerEl.classname = "task-actions";

    // create edit button 
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(editButtonEl);
    // create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(deleteButtonEl);
    // create change status dropdown
    var statusSelectE1 = document.createElement("select");
    statusSelectE1.setAttribute("name", "status-change");
    statusSelectE1.setAttribute("data-task-id", taskId);
    statusSelectE1.className = "select-status";
    actionContainerEl.appendChild(statusSelectE1);
    // create satus options
    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i < statusChoices.lenght; i++) {
        // create option element
        var statusOptionEl = Document.createElement("option");
        statusOptionEl.setAttribute("value", statusChoices[i]);
        statusOptionEl.textContent = statusChoices[i];

        // append to select 
        statusSelectE1.appendChild(statusOptionEl);
    }
    return actionContainerEl;
};

var completeEditTask = function(taskName, taskType, taskId) {
    // find task list with taskid Value
    var taskSelected = document.querySelector(".task-item[dat-task-id='" + taskId + "']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].idf === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }

    alert("Task Updated!");

    // remove data atrribute from form
    formEl.removeAttribute("data-task-id");
    // update formEl button to go back to saying "Add task" instead of "Edit Task"
    formEl.querySelector("#save-task").textContent = "Add Task";
};

var taskButtonHandler = function(event) {
// get target elemet from event 
var targetE1 = event.target;

if (targetE1.matches(".edit-btn")) {
    console.log("edit", targetE1);
    var taskId = targetE1.getAttribute("data-task-id");
    editTask(taskId);
} else if (targetE1.matches(".delete-btn")) {
    console.log("delete", targetE1);
    var taskId = targetE1.getAttribute("data-task-id");
    deleteTask(taskId);
}
};

var taskStatusChangeHandler = function(event) {
console.log(event.target.value);

// find task list item based on event.target's data-task-id attribute 
var taskId = event.target.getAttribute("data-task-id");

var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

// convert value to lower case 
var statusValue = event.target.value.toLowerCase();

if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
} else if (statusValue === "in progress") {
    taskInprogressEl.appendChild(taskSelected);
} else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
}

//update task's in tasks array
for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
        tasks[i].status = statusValue;
    }
}

// save to localStorage
saveTasks();
};

var editTask = function(taskId) {
    console.log(taskId);

    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    console.log(taskName);

    var taskType = taskSelected.querySelector("span.task-type").textContent;
    console.log(taskType);

    // write values of taskname and taskType to form to be edited
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    // set data attribute to the form with avaluee of the task's id so it knows which one is being edited
    formEl.setAttribute("data-task-id", taskId);
    // update form's button to reflect editing a task rather than creating a new one 
    formEl.querySelector("#save-task").textContent = "Save Task";
};

var deleteTask = function(taskId) {
    console.log(taskId);
    // find task list element with taskId value and remove it 
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

// Create a new array to hold updated list of tasks
var updatedTaskArr = [];

// loop through current tasks
for (var i = 0; i < tasks.lenght; i++) {
    // if tasks[i]. id doesn't match the value of taskId, let's keep that task and push it into the new aray 
    if (tasks[i].id !== parseInt(taskId)) {
        updatedTaskArr.push(tasks[i]);
    }
}

// reassign tasks array to be the same as updatedTaskArr
tasks = updatedTaskArr;
saveTasks();
};

var saveTasks = function() {
    localStortage.setItem("tasks", JSON.stringify(tasks));
};

var loadTasks = function() {
    var savedTasks = localStorage.getItem("tasks");
    // if there are no tasks, set tasks to an empty array and array out of the function
    if (!savedTasks) {
        return false;
    }
    console.log("Saved tasks found!");
    // else, load up saved tasks

    // parse into array of objects
    savedTasks = json.parse(savedTasks);

    // loop through savedTasks array
    for (var i = 0; i < savedTasks.length; i++) {
        // pass each task object into the 'createTaskEl()' function
        createTaskEl(savedTasks[i]);
    }
};

// create a new task 
formEl.addEventListener("submit", taskFormHandler);

// for edit and delete buttons
pageContentEl.addEventListener("click", taskButtonHandler);

// for changing the status
pageContentEl.addEventListener("change", taskStatusChangeHandler);

loadTasks();

