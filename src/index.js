const inputField = document.getElementById("enter-task");
const inputFieldWrapper = document.querySelector(".input-wrapper");
const tasksWrapper = document.querySelector(".tasks-cont");
const typingText = document.querySelector(".typing");
const itemsLeft = document.getElementById("items-left");
const clearItems = document.getElementById("clear");
const userActionsCont = document.querySelector(".actions");
const userActionsContIdVer = document.querySelector("#actions");
const userActions = document.querySelectorAll(".actions__link-a");
const userInput = document.querySelectorAll(".user-input-wrapper");
const themeSwitherCont = document.querySelector(".theme-switcher-cont");

let items = document.querySelectorAll(".user-input-wrapper");
let themeSwitched = false;

itemsLeft.innerText = "3 items left";

function removeActiveClassOnActions() {
  userActions.forEach((userAction) => {
    userAction.classList.remove("active");
  });
}

themeSwitherCont.addEventListener("click", changeTheme);

function changeTheme() {
  let targetIcon = themeSwitherCont.querySelector(".theme-switcher");
  if (!themeSwitched) {
    targetIcon.src = "./images/icon-sun.svg";
  } else {
    targetIcon.src = "./images/icon-moon.svg";
  }
  themeSwitched = !themeSwitched;
  document.body.classList.toggle("dark");
}

userActionsCont.addEventListener("click", (e) => {
  showCompletedActiveTasks(e);
});
userActionsContIdVer.addEventListener("click", (e) => {
  showCompletedActiveTasks(e);
});

function showCompletedActiveTasks(e) {
  let target = e.target.closest("a");
  if (!target) return;
  toggleBtns = document.querySelectorAll(".circle-check");
  removeActiveClassOnActions(); // remove active on all actions
  target.classList.add("active"); // now add it to the one you clicked
  if (target.textContent === "Completed") {
    toggleBtns.forEach((btn) => {
      if (btn.classList.contains("completed")) {
        btn.parentElement.style.display = "flex";
      } else {
        btn.parentElement.style.display = "none";
      }
    });
  } else if (target.textContent === "Active") {
    toggleBtns.forEach((btn) => {
      if (!btn.classList.contains("completed")) {
        btn.parentElement.style.display = "flex";
      } else {
        btn.parentElement.style.display = "none";
      }
    });
  } else {
    toggleBtns.forEach((btn) => {
      btn.parentElement.style.display = "flex";
    });
  }
}

let toggleBtns = document.querySelectorAll(".circle-check");

clearItems.addEventListener("click", () => {
  toggleBtns = document.querySelectorAll(".circle-check");
  toggleBtns.forEach((btn) => {
    if (btn.className === "circle-check completed") {
      btn.parentElement.remove();
      updateItemsLeft(tasksWrapper.childElementCount);
    } else return;
  });
});

function updateItemsLeft(elCount) {
  itemsLeft.innerText =
    elCount <= 0
      ? "no items left"
      : elCount <= 1
      ? "one item left"
      : `${elCount} items left`;
  //   itemsLeft.innerText = tasksWrapper.childElementCount;
  console.log(itemsLeft.innerText);
}

let newTask;
let typing = false;

window.addEventListener("load", () => {
  inputField.value = "";
});
// if anything clicked except input field then set typing to false
window.addEventListener("click", (e) => {
  let target = e.target.closest("input");
  if (!target) {
    typing = false;
    typingIndicator();
    inputField.value = "";
  }
});

inputField.addEventListener("keydown", getTaskInput);

// adds the line through when circle button beside task is clicked
let myInt = 1;
tasksWrapper.addEventListener("click", (e) => {
  let target = e.target.closest("button");
  if (!target) return;
  target.nextElementSibling.classList.toggle("completed");
  target.classList.toggle("completed");
  if (target.classList.contains("completed")) {
    updateItemsLeft(tasksWrapper.childElementCount - myInt);
    myInt += 1;
  }
});

// this makes it so when the x is clicked then the entire task body gets removed
tasksWrapper.addEventListener("click", (e) => {
  let target = e.target.closest("img");
  if (!target) return;
  target.parentElement.remove();
  updateItemsLeft(tasksWrapper.childElementCount);
});

// this function is in charge of getting the task the user typed in and passing it to other functions
function getTaskInput(e) {
  if (e.key === "Enter") {
    // store whatever value is in inputfield to newTask variable
    newTask = inputField.value;
    newTask = newTask[0].toUpperCase() + newTask.slice(1);
    // this function adds the task inside the container that holds and displays all tasks
    addTask(newTask);
    inputField.value = "";
    typing = false;
    typingIndicator();
    items = document.querySelectorAll(".user-input-wrapper");
    makeItemsDraggable(items);
  }
}

function addTask(taskData) {
  tasksWrapper.prepend(returnTaskHtml(taskData));
  updateItemsLeft(tasksWrapper.childElementCount);
}

function returnTaskHtml(taskData) {
  const newDiv = document.createElement("div");
  newDiv.className = "user-input-wrapper";
  newDiv.setAttribute("draggable", "true");
  const newBtn = document.createElement("button");
  newBtn.className = "circle-check";
  const newP = document.createElement("p");
  newP.className = "task";
  let taskValue = taskData;
  newP.append(taskValue);
  const newImg = document.createElement("img");
  newImg.id = "remove";
  //   newImg.setAttribute("src", icon - cross.svg);
  newImg.src = "./images/icon-cross.svg";
  newImg.alt = "close";
  newDiv.append(newBtn);
  newDiv.append(newP);
  newDiv.append(newImg);
  return newDiv;
}

inputField.addEventListener("input", () => {
  typing = true;
  typingIndicator();
});

function typingIndicator() {
  // typing paragraph with animation was set to be behind input
  // element in the css here if we are typing we move the
  // input element to show the hidden typing element
  if (typing) {
    setTimeout(() => {
      inputField.style.marginLeft = "6.5rem";
      inputField.previousElementSibling.classList.add("typing-animation");
    }, 100);
  } else {
    setTimeout(() => {
      inputField.style.marginLeft = "0";
      inputField.previousElementSibling.classList.remove("typing-animation");
    }, 100);
  }
}

function handleDragStart(e) {
  this.style.opacity = "0.4";
  dragSrcEl = this;

  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", this.innerHTML);
}

function handleDragEnd(e) {
  this.style.opacity = "1";
  items.forEach(function (item) {
    item.classList.remove("over");
  });
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  return false;
}
function handleDragEnter(e) {
  this.classList.add("over");
}
function handleDragLeave(e) {
  this.classList.remove("over");
}
function handleDrop(e) {
  e.stopPropagation(); // stops the browser from redirecting.
  if (dragSrcEl !== this) {
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData("text/html");
  }
  return false;
}
function makeItemsDraggable(items) {
  items.forEach((item) => {
    item.addEventListener("dragstart", handleDragStart);
    item.addEventListener("dragover", handleDragOver);
    item.addEventListener("dragenter", handleDragEnter);
    item.addEventListener("dragleave", handleDragLeave);
    item.addEventListener("dragend", handleDragEnd);
    item.addEventListener("drop", handleDrop);
  });
}

makeItemsDraggable(items);
