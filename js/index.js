var modal = document.getElementById("modal");

var newTask = document.getElementById("newTask");

var taskStatusInput = document.getElementById("status");

var taskCategoryInput = document.getElementById("category");

var taskTitleInput = document.getElementById("title");

var taskDescriptionInput = document.getElementById("description");

var nextUpTask = document.getElementById("toDo");

var inProgressTask = document.getElementById("inProgress");

var doneTask = document.getElementById("done");

var addBtn = document.getElementById("addBtn");

var searchInput = document.getElementById("searchInput");

var nextUpCounterElement = document.getElementById("nextUpCount");

var inProgressCounterElement = document.getElementById("inProgressCount");

var doneCounterElement = document.getElementById("doneCount");

var gridBtn = document.getElementById("gridBtn");

var barsBtn = document.getElementById("barsBtn");

var sections = document.querySelectorAll("section");

var tasks = document.querySelectorAll(".tasks");

var body = document.body;

var modeBtn = document.getElementById("light");

var root = document.querySelector(":root");

var taskArr = [];

var nextUpCounter = 0;

var inProgressCounter = 0;

var doneCounter = 0;

if (localStorage.getItem("tasks") != null) {
  taskArr = JSON.parse(localStorage.getItem("tasks"));
  for (var i = 0; i < taskArr.length; i++) {
    displayTask(i);
  }
}

//==== Show Modal ====

function showModal() {
  modal.classList.replace("d-none", "d-flex");
  body.style.overflow = "hidden";
  scroll(0, 0);
}

newTask.addEventListener("click", showModal);

newTask.addEventListener("click", function () {
  addBtn.classList.replace("d-none", "d-block");
  updateBtn.classList.replace("d-block", "d-none");
});

// ==== Hide Modal ====

function hideModal() {
  modal.classList.replace("d-flex", "d-none");
  body.style.overflow = "auto";
}

modal.addEventListener("click", function (event) {
  if (event.target.id == "modal") {
    hideModal();
  }
});

// ==== Add Task ====

function addTask() {
  if (
    validate(titleRegex, taskTitleInput) &
    validate(descriptionRegex, taskDescriptionInput)
  ) {
    if (addBtn.innerHTML.trim() == "Add Task") {
      var task = {
        status: taskStatusInput.value,
        category: taskCategoryInput.value,
        title: taskTitleInput.value,
        description: taskDescriptionInput.value,
      };
      taskArr.push(task);
      saveTasks();
      displayTask(taskArr.length - 1);
      hideModal();
      resetForm();
    }
    if (addBtn.innerHTML.trim() == "Update Task") {
      updateTask(globalIndex);
    }
  }
}

// ==== Display Task ====

var htmlTask;

function displayTask(index) {
  htmlTask = `
  <div class="task">
  <h3 class="text-capitalize">${taskArr[index].title}</h3>
  <p class="description text-capitalize">${taskArr[index].description}</p>
  <h4 class="category ${taskArr[index].category} text-capitalize">${taskArr[index].category}</h4>
  <ul class="task-options list-unstyled d-flex gap-3 m-0 fs-5">
    <li><i class="bi bi-pencil-square" onclick='getTaskInfo(${index})'></i></li>
    <li><i class="bi bi-trash-fill" onclick='deleteTask(${index})'></i></li>
    <li><i class="bi bi-palette-fill" onclick='changeBg(event)'></i></li>
  </ul>
</div>`;
  setHTMLTask(taskArr[index].status);
}

function setHTMLTask(status) {
  switch (status) {
    case "nextUp":
      nextUpTask.innerHTML += htmlTask;
      nextUpCounter++;
      nextUpCounterElement.innerHTML = nextUpCounter;
      break;
    case "inProgress":
      inProgressTask.innerHTML += htmlTask;
      inProgressCounter++;
      inProgressCounterElement.innerHTML = inProgressCounter;
      break;
    case "done":
      doneTask.innerHTML += htmlTask;
      doneCounter++;
      doneCounterElement.innerHTML = doneCounter;
      break;
  }
}

addBtn.addEventListener("click", addTask);

// ==== Local Storage ====

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(taskArr));
}

// ==== Delete Task ====

function deleteTask(index) {
  taskArr.splice(index, 1);
  saveTasks();
  reNewTask();
  resetCounter();
  for (var i = 0; i < taskArr.length; i++) {
    displayTask(i);
  }
}

function reNewTask() {
  nextUpTask.innerHTML = "";
  inProgressTask.innerHTML = "";
  doneTask.innerHTML = "";
}

function resetCounter() {
  nextUpCounter = 0;
  inProgressCounter = 0;
  doneCounter = 0;
  nextUpCounterElement.innerHTML = nextUpCounter;
  inProgressCounterElement.innerHTML = inProgressCounter;
  doneCounterElement.innerHTML = doneCounter;
}

// ==== Update Task ====

var globalIndex;

function getTaskInfo(index) {
  globalIndex = index;
  showModal();
  taskStatusInput.value = taskArr[index].status;
  taskCategoryInput.value = taskArr[index].category;
  taskTitleInput.value = taskArr[index].title;
  taskDescriptionInput.value = taskArr[index].description;
  newTask.classList.replace("btn-new-task", "btn-update");
  addBtn.innerHTML = "Update Task";
}

function updateTask(index) {
  taskArr[index].status = taskStatusInput.value;
  taskArr[index].category = taskCategoryInput.value;
  taskArr[index].title = taskTitleInput.value;
  taskArr[index].description = taskDescriptionInput.value;
  saveTasks();
  reNewTask();
  resetCounter();
  hideModal();
  addBtn.classList.replace("btn-update", "btn-new-task");
  addBtn.innerHTML = "Add Task";
  for (var i = 0; i < taskArr.length; i++) {
    displayTask(i);
  }
}

newTask.addEventListener("click", function () {
  addBtn.classList.replace("btn-update", "btn-new-task");
  addBtn.innerHTML = "Add Task";
});

// ==== Search Task ====

function searchTask() {
  var matchedTask = searchInput.value;
  reNewTask();
  resetCounter();
  for (var i = 0; i < taskArr.length; i++) {
    if (
      taskArr[i].title.toLowerCase().includes(matchedTask.toLowerCase()) ==
        true ||
      taskArr[i].category.toLowerCase().includes(matchedTask.toLowerCase()) ==
        true
    ) {
      displayTask(i);
    }
  }
}

searchInput.addEventListener("input", searchTask);

// ==== Generate Color ====

function generateColor() {
  var chars = [1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c", "d", "e", "f"];
  var Color = "#";
  for (var i = 0; i < 6; i++) {
    var charRandom = Math.trunc(Math.random() * chars.length);
    Color += chars[charRandom];
  }
  return Color + 55;
}

function changeBg(event) {
  var bg = event.target.parentElement.parentElement.parentElement;
  bg.style.backgroundColor = generateColor();
}

// ==== Active Bars ====

function activeBars() {
  gridBtn.classList.remove("active");
  barsBtn.classList.add("active");
  for (var i = 0; i < sections.length; i++) {
    sections[i].classList.remove("col-lg-4", "col-md-6");
    sections[i].style.overflow = "auto";
  }

  for (var j = 0; j < tasks.length; j++) {
    tasks[j].setAttribute("data-view", "bars");
  }
}

// ==== Active Grids ====

function activeGrids() {
  gridBtn.classList.add("active");
  barsBtn.classList.remove("active");
  for (var i = 0; i < sections.length; i++) {
    sections[i].classList.add("col-lg-4", "col-md-6");
  }

  for (var j = 0; j < tasks.length; j++) {
    tasks[j].removeAttribute("data-view");
  }
}

// ==== Validate Title ====

let titleRegex = /^\w{3,}(\s\w+)*$/;
let descriptionRegex = /^(?=.{5,100}$)\w+(\s\w*)*$/;

function validate(regex, element) {
  if (regex.test(element.value)) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
    element.parentElement.nextElementSibling.classList.add("d-none");
  } else {
    element.classList.add("is-invalid");
    element.classList.remove("is-valid");
    element.parentElement.nextElementSibling.classList.remove("d-none");
  }

  return regex.test(element.value);
}

taskTitleInput.addEventListener("input", function () {
  validate(titleRegex, taskTitleInput);
});

taskDescriptionInput.addEventListener("input", function () {
  validate(descriptionRegex, taskDescriptionInput);
});

// ==== Change Mode ====

function changeMode() {
  if (modeBtn.dataset.mode == "night") {
    root.style.setProperty("--main-black", "#a5a6a7");
    root.style.setProperty("--sec-black", "#dadada");
    root.style.setProperty("--text-color", "#0d1117");
    modeBtn.dataset.mode = "light";
    modeBtn.classList.replace("bi-brightness-high-fill", "bi-moon-stars-fill");
  } else if (modeBtn.dataset.mode == "light") {
    root.style.setProperty("--main-black", "#0d1117");
    root.style.setProperty("--sec-black", "#161b22");
    root.style.setProperty("--text-color", "#a5a6a7");
    modeBtn.dataset.mode = "night";
    modeBtn.classList.replace("bi-moon-stars-fill", "bi-brightness-high-fill");
  }
}

modeBtn.addEventListener("click", changeMode);
