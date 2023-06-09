const addTask = document.querySelector("#addTask");
const clock = document.querySelector("#clock");
const taskList = document.querySelector("#taskList");
const tasks = document.querySelectorAll(".task");
const checks = document.querySelectorAll(".check");
const deletes = document.querySelectorAll(".delete");
const TaskText = document.querySelector("#taskText");
const addTaskbutton = document.querySelector("#addTaskButton");
const resetButton = document.querySelector("#reset");

for (let i = 0; i < checks.length; ++i) {
  checks[i].addEventListener("click", () => {
    if (tasks[i].style.textDecoration !== "line-through") {
      tasks[i].style.textDecoration = "line-through";
      tasks[i].style.backgroundColor = "rgba(0, 0, 0, 0.4)";
      tasks[i].style.color = "grey";
      checks[i].style.backgroundColor = "rgb(203, 208, 213)";
      deletes[i].style.backgroundColor = "rgb(203, 208, 213)";
    } else {
      tasks[i].style.textDecoration = "none";
      tasks[i].style.backgroundColor = "rgba(0, 0, 0, 0.586)";
      tasks[i].style.color = "white";
      checks[i].style.backgroundColor = "rgb(203, 208, 213)";
      deletes[i].style.backgroundColor = "rgb(203, 208, 213)";
    }
  });
}

addTaskbutton.addEventListener("click", (event) => {
  event.preventDefault();
  if (TaskText.value.length > 0) {
    const newTask = document.createElement("li");
    newTask.classList.add("task");
    const newTaskText = document.createElement("div");
    const newTaskButtons = document.createElement("div");
    newTaskButtons.classList.add("taskButtons");
    newTaskText.classList.add("taskText");
    newTaskText.innerHTML = `${TaskText.value}`;
    TaskText.value = null;
    const newCheck = document.createElement("button");
    newCheck.classList.add("check");
    newCheck.type = "button";
    newCheck.innerHTML = `<img src="/public/images/check.png" />`;
    const newDelete = document.createElement("button");
    newDelete.classList.add("delete");
    newDelete.type = "button";
    newDelete.innerHTML = `<img src="/public/images/trashcan.png" />`;
    newCheck.addEventListener("click", () => {
      if (newTask.style.textDecoration !== "line-through") {
        newTask.style.textDecoration = "line-through";
        newTask.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
        newTask.style.color = "grey";
        newCheck.style.backgroundColor = "rgb(203, 208, 213)";
        newDelete.style.backgroundColor = "rgb(203, 208, 213)";
      } else {
        newTask.style.textDecoration = "none";
        newTask.style.backgroundColor = "rgba(0, 0, 0, 0.586)";
        newTask.style.color = "white";
        newCheck.style.backgroundColor = "rgb(203, 208, 213)";
        newDelete.style.backgroundColor = "rgb(203, 208, 213)";
      }
    });
    newDelete.addEventListener("click", () => {
      newTask.style.display = "none";
    });
    newTaskButtons.appendChild(newCheck);
    newTaskButtons.appendChild(newDelete);
    newTask.appendChild(newTaskText);
    newTask.appendChild(newTaskButtons);
    taskList.appendChild(newTask);
  }
});

for (let i = 0; i < deletes.length; ++i) {
  deletes[i].addEventListener("click", () => {
    tasks[i].style.display = "none";
  });
}

function updateTime() {
  let now = new Date();

  let year = now.getFullYear();
  let month = addLeadingZero(now.getMonth() + 1);
  let day = addLeadingZero(now.getDate());

  let hours = addLeadingZero(now.getHours());
  let minutes = addLeadingZero(now.getMinutes());
  let seconds = addLeadingZero(now.getSeconds());

  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;

  let dateString = year + "/" + month + "/" + day + ", ";
  let timeString = hours + ":" + minutes + ":" + seconds + " " + ampm;

  document.getElementById("date").innerHTML = dateString;
  document.getElementById("time").innerHTML = timeString;

  setTimeout(updateTime, 1000);
}

function addLeadingZero(number) {
  return (number < 10 ? "0" : "") + number;
}
updateTime();

resetButton.addEventListener("click", () => {
  let tasks = document.querySelectorAll(".task");
  for (let i = 0; i < tasks.length; ++i) {
    tasks[i].style.display = "none";
  }
});

// 세션에 저장된 ID 정보를 가져옵니다.
const userId = sessionStorage.getItem("userId");
// ...

// 로그인한 사용자의 ID 정보를 출력합니다.
if (userId) {
  console.log("로그인한 사용자: " + userId);
}
