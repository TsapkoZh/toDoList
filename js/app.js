const list = document.getElementById("list");
const content = document.getElementById("content");

const ACTIVE = "active";
const COMPLETED = "completed";
const DELETE = "delete";
const CHECK = "toggleDone";
const UNCHECK = "toggleNotDone";
const LINE_THROUGH = "lineThrough";
const SHOW = "show";

let LIST, id, element, elementJob, itemId, index, editingIndex;
let input = document.getElementById("inputAddItem");
let data = localStorage.getItem("TODO");
let activeLength = document.getElementsByClassName(ACTIVE);
let completedLength = document.getElementsByClassName(COMPLETED);
let activeFilterJob = "all";

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
        document.querySelector(".js-filter").classList.add(SHOW);
    } else {
        document.querySelector(".js-filter").classList.remove(SHOW);
    }
}

function btnAllDoneShow() {
    if(LIST.length > 0) {
        document.querySelector(".js-content__allDone").classList.add(SHOW);
    } else {
        document.querySelector(".js-content__allDone").classList.remove(SHOW);
    }
}

function btnClearCompletedShow() {
    if(completedLength.length > 0) {
        document.querySelector(".js-clearCompleted").classList.add(SHOW);
    } else {
        document.querySelector(".js-clearCompleted").classList.remove(SHOW);
    }
}

// addNewItem ===============
// ==========================
function addToDo(toDo, id, done) {
    const MADE = done ? COMPLETED : ACTIVE;
    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";

    const item = `<li class="js-SearchElem list__item item ${MADE} ${SHOW}" id="${id}">
                      <button type=button class="${DONE}" job="${COMPLETED}" id="${id}"></button>
                      <span class="textItem ${LINE}" job="read">${toDo}</span>
                      <button class="destroy" job="${DELETE}"></button>
                  </li>`;

    const position = "beforeend";
    
    list.insertAdjacentHTML(position, item);
}

function keyupAddToDo() {
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

function removeItems() {
    const done = document.querySelectorAll('.js-SearchElem');

    Object.keys(done).forEach(function(i) {
        done[i].parentNode.removeChild(done[i]);
    });
}

function keyupEditToDo() {
    const toDo = input.value;

    if(toDo) {
        LIST[editingIndex].name = toDo;
        localStorage.setItem("TODO", JSON.stringify(LIST));
        removeItems();
        loadList(LIST);
    }
    input.value = "";
}

// filter ===================
// ==========================
filterSelection("all")

function filterSelection(name) {
    let className = document.getElementsByClassName("js-SearchElem");
    activeFilterJob = name;

    if(name == "all") name = "";
    Object.keys(className).forEach(function(i) {
        removeClass(className[i], SHOW);
        if (className[i].className.indexOf(name) > -1) addClass(className[i], SHOW);
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

let btnContainer = document.getElementById("filterBtnContainer");
let btns = btnContainer.getElementsByClassName("filterSwitch__btn");

Object.keys(btns).forEach(function(i) {
    btns[i].addEventListener("click", function() {
        let current = document.getElementsByClassName("included");
        current[0].className = current[0].className.replace(" included", "");
        this.className += " included";
    });
});

// btnDone =================
// =========================
let checked = false;

function checkeAll() {
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

function completeToDo(element) {
    itemIndex(element);

    if(element.parentNode.classList.contains(ACTIVE) == true) {
        element.parentNode.classList.add(COMPLETED);
        element.parentNode.classList.remove(ACTIVE);
        element.classList.add(CHECK);
        element.classList.remove(UNCHECK);
        element.parentNode.querySelector(".textItem").classList.add(LINE_THROUGH);
        LIST[index].done = true;
    } else {
        element.parentNode.classList.remove(COMPLETED);
        element.parentNode.classList.add(ACTIVE);
        element.classList.remove(CHECK);
        element.classList.add(UNCHECK);
        element.parentNode.querySelector(".textItem").classList.remove(LINE_THROUGH);
        LIST[index].done = false;
    }
}

// btnClear ================
// =========================
function clearCompleted() {
    const done = document.querySelectorAll('button[type=button]');

    Object.keys(done).forEach(function(i) {
        if(done[i].parentNode.classList.contains(COMPLETED) == true) {
            const index = LIST.findIndex(element => element.done == true);
            removeToDo(done[i]);
            LIST.splice(index, 1);
        }
});

    filterSelection(activeFilterJob);
    filterShow(LIST.length);
    btnAllDoneShow();
    btnClearCompletedShow();

    checked = !checked;
    localStorage.setItem("TODO", JSON.stringify(LIST));
}

function removeToDo(element) {
    element.parentNode.parentNode.removeChild(element.parentNode);
}

// clickKeyup ==============
// =========================
function targetElement() {
    element = event.target;
    elementJob = element.attributes.job.value;
}

function itemIndex(element) {
    itemId = element.parentNode.getAttribute("id");
    index = LIST.findIndex(element => element.id == itemId);
}

function clickButton() {
    targetElement();
    itemIndex(element);

    if(elementJob == COMPLETED) {
        completeToDo(element);
        filterSelection(activeFilterJob);
        checked = !checked;
    }
    if(elementJob == DELETE) { 
        removeToDo(element);
        LIST.splice(index, 1);
    }
    if(elementJob == "clearCompleted") {
        clearCompleted();
    }
    if(elementJob == "all") {
        filterSelection("all");
    }
    if(elementJob == "completedFilter") {
        filterSelection(COMPLETED);
    }
    if(elementJob == ACTIVE) {
        filterSelection(ACTIVE);
    }
    if(elementJob == "checkeAll") {
        checkeAll();
    }

    itemsLeft(activeLength.length);
    filterShow(LIST.length);
    btnAllDoneShow();
    btnClearCompletedShow();

    localStorage.setItem("TODO", JSON.stringify(LIST));
}

function editItem() {
    if(elementJob == "read") {
        const item = `<li class="js-SearchElem"><input type="text" class="content__editToDo" value="${LIST[index].name}" id="inputEditItem"></li>`;
        const position = "afterend";

        element.parentNode.insertAdjacentHTML(position, item);
        input = document.getElementById("inputEditItem");
        removeToDo(element);
        editingIndex = index;
    }
}

function keyupListener() {
    if(event.keyCode == 13) {
        if(input.id == "inputAddItem") {
            keyupAddToDo();
        } else {
            keyupEditToDo();
        }
    }
    if(event.keyCode == 27) {
        removeItems();
        loadList(LIST);
    }
}

content.addEventListener("click", clickButton, false);

list.addEventListener("dblclick", editItem, false);

content.addEventListener("keyup", keyupListener, false);




// ================================================
// content.addEventListener("click", function() {
//     targetElement()
//     itemIndex(element)
//     console.log(LIST, "LIST")
//     console.log(element, "element")
//     console.log(elementJob, "elementJob")
//     console.log(itemId, "itemId")
//     console.log(index, "index")
//     console.log(editingIndex, "editingIndex")
//     console.log(input, "input")
//     console.log(btns, "btns")
// });
