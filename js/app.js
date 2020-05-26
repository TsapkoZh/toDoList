const list = document.getElementById("list");
const input = document.getElementById("input");

const ACTIVE = "active";
const COMPLETED = "completed";
const CHECK = "toggleDone";
const UNCHECK = "toggleNotDone";
const LINE_THROUGH = "lineThrough";

let LIST, id;
let checkIndex = 0;
let data = localStorage.getItem("TODO");
let activeLength = document.getElementsByClassName(ACTIVE);
let completedLength = document.getElementsByClassName(COMPLETED);

if (data) {
    LIST = JSON.parse(data);
    id = LIST.length;

    loadList(LIST);
    itemsLeft(activeLength.length);
    filterShow(LIST.length);
    btnAllDoneShow();
    btnClearCompletedShow();
} else {
    LIST = [];
    id = 0;
}

function loadList(array) {
    array.forEach(function(item) {
        addToDo(item.name, item.id, item.done);
    });
}

function itemsLeft(num) {
    activeLength = document.getElementsByClassName(ACTIVE);
    document.getElementById("num").textContent = num;
}

function filterShow(itemLength) {
    if(itemLength > 0) {
        document.querySelector(".filter").classList.remove("showFilter");
    } else {
        document.querySelector(".filter").classList.add("showFilter");
    }
}

function btnAllDoneShow() {
    if(LIST.length > 0) {
        document.querySelector(".content__allDone").classList.add("show");
    } else {
        document.querySelector(".content__allDone").classList.remove("show");
    }
}

function btnClearCompletedShow() {
    if(completedLength.length > 0) {
        document.querySelector(".clearCompleted").classList.add("show");
    } else {
        document.querySelector(".clearCompleted").classList.remove("show");
    }
}

// addNewItem ===============
// ==========================
function addToDo(toDo, id, done) {
    const MADE = done ? COMPLETED : ACTIVE;
    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";

    const item = `<li class="filterDiv item ${MADE} show" id="${id}">
                      <button type=button class="${DONE}" job="completed" id="${id}"></button>
                      <span class="textItem ${LINE}">${toDo}</span>
                      <button class="destroy" job="delete"></button>
                  </li>`;

    const position = "beforeend";
    
    list.insertAdjacentHTML(position, item);
}

document.addEventListener("keyup", function(event) {
    if(event.keyCode == 13){
        const toDo = input.value;
        
        if(toDo){
            addToDo(toDo, id, false);
            LIST.push({
                name : toDo,
                id : id,
                done : false,
            });

            id++;

            itemsLeft(activeLength.length);
            filterSelection(activeFilterJob);
            filterShow(LIST.length);
            btnAllDoneShow();

            localStorage.setItem("TODO", JSON.stringify(LIST));
        }
        input.value = "";
    }
});

// filter ===================
// ==========================
filterSelection("all")

function filterSelection (name) {
    let className = document.getElementsByClassName("filterDiv");

    if(name == "all") name = "";
    Object.keys(className).forEach(function(i) {
        removeClass(className[i], "show");
        if (className[i].className.indexOf(name) > -1) addClass(className[i], "show");
    });
}

function addClass(element, name) {
    let  arr1, arr2;

    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
        Object.keys(arr2).forEach(function(i) {
        if(arr1.indexOf(arr2[i]) == -1) {
        element.className += " " + arr2[i];
        }
    });
}

function removeClass(element, name) {
    let arr1, arr2;

    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    Object.keys(arr2).forEach(function(i) {
        while (arr1.indexOf(arr2[i]) > -1) {
        arr1.splice(arr1.indexOf(arr2[i]), 1);
        }
    });
    element.className = arr1.join(" ");
}

let btnContainer = document.getElementById("myBtnContainer");
let btns = btnContainer.getElementsByClassName("btn");

Object.keys(btns).forEach(function(i) {
    btns[i].addEventListener("click", function() {
        let current = document.getElementsByClassName("included");
        current[0].className = current[0].className.replace(" included", "");
        this.className += " included";
    });
});

let activeFilterJob = "all";

myBtnContainer.addEventListener("click", function(event) {
    const element = event.target;
    const filterJob = element.attributes.job.value;
    
    if(filterJob == "all") {
        filterSelection("all");
    }
    if(filterJob == COMPLETED) {
        filterSelection(COMPLETED);
    }
    if(filterJob == ACTIVE) {
        filterSelection(ACTIVE);
    }
    activeFilterJob = filterJob;
});

// btnAllDone ==============
// =========================
document.getElementById("all_done").addEventListener("click", checkedAll, false);

let checked = false;

function checkedAll() {
    const btnCheck = document.querySelectorAll('button[type=button]');

    Object.keys(btnCheck).forEach(function(i) {
        if(btnCheck[i].parentNode.classList.contains(ACTIVE) == checked) {
        completeToDo(btnCheck[i]);
        } 
        completeToDo(btnCheck[i]);
    });
    filterSelection(activeFilterJob);
    btnAllDoneShow();
    btnClearCompletedShow();

    checked = !checked;
    localStorage.setItem("TODO", JSON.stringify(LIST));
}

// btnClearComplete ========
// =========================
document.getElementById("clearComplete").addEventListener("click", clearComplete, false);

function clearComplete() {
    const done = document.querySelectorAll('button[type=button]');

    Object.keys(done).forEach(function(i) {
        if(done[i].parentNode.classList.contains(COMPLETED) == true) {
        const checkIndex = LIST.findIndex(element => element.done == true);

            removeToDo(done[i]);
            LIST.splice(checkIndex, 1);
        }
    });
    filterSelection(activeFilterJob);
    filterShow(LIST.length);
    btnAllDoneShow();
    btnClearCompletedShow();

    checked = !checked;
    localStorage.setItem("TODO", JSON.stringify(LIST));
}

// completeDelete ===========
// ==========================
function removeToDo(element) {
    element.parentNode.parentNode.removeChild(element.parentNode);
}

function completeToDo(element) {
    const itemId = element.parentNode.getAttribute("id");
    checkIndex = LIST.findIndex(element => element.id == itemId);

    if(element.parentNode.classList.contains(ACTIVE) == true) {
        element.parentNode.classList.add(COMPLETED);
        element.parentNode.classList.remove(ACTIVE);
        element.classList.add(CHECK);
        element.classList.remove(UNCHECK);
        element.parentNode.querySelector(".textItem").classList.add(LINE_THROUGH);
        LIST[checkIndex].done = true;
    } else {
        element.parentNode.classList.remove(COMPLETED);
        element.parentNode.classList.add(ACTIVE);
        element.classList.remove(CHECK);
        element.classList.add(UNCHECK);
        element.parentNode.querySelector(".textItem").classList.remove(LINE_THROUGH);
        LIST[checkIndex].done = false;
    }
    itemsLeft(activeLength.length);
}

list.addEventListener("click", function(event) {
    const element = event.target;
    const elementJob = element.attributes.job.value;
    const itemId = element.parentNode.getAttribute("id");
    const index = LIST.findIndex(element => element.id == itemId);
   
    if(elementJob == COMPLETED) {
        completeToDo(element);
        filterSelection(activeFilterJob);

        checkIndex = index;
        checked = !checked;
    } else if(elementJob == "delete") {
        removeToDo(element);
        LIST.splice(index, 1);
    }
    itemsLeft(activeLength.length);
    filterShow(LIST.length);
    btnAllDoneShow();
    btnClearCompletedShow();

    localStorage.setItem("TODO", JSON.stringify(LIST));
});


