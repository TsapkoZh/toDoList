const listToDo = localStorage.getItem("TODO");
const itemsList = document.getElementById("itemsList");
const content = document.getElementById("content");

const ACTIVE = "active";
const COMPLETED = "completed";
const CHECK = "toggleDone";
const UNCHECK = "toggleNotDone";
const LINE_THROUGH = "lineThrough";
const SHOW = "show";

let LIST, id, element, elementJob, itemId, index, editingIndex;
let input = document.getElementById("inputAddItem");
let activeItems = document.getElementsByClassName(ACTIVE);
let activeFilterJob = "all";

if (listToDo) {
    LIST = JSON.parse(listToDo);
    id = LIST.length;

    loadList(LIST);
    countItemsLeft(activeItems.length);
    showFilter(LIST.length);
    showBtnAllDone(LIST.length);
    showBtnClearCompleted();
} else {
    LIST = [];
    id = 0;
}

function loadList(array) {
    array.forEach((item) => {addToDo(item.name, item.id, item.done);});
}

function countItemsLeft(num) {
    activeItems = document.getElementsByClassName(ACTIVE);
    document.getElementById("num").textContent = num;
}

function showFilter(listLength) {
    if(listLength > 0) {
        document.querySelector(".js-filter").classList.add(SHOW);
    } else {
        document.querySelector(".js-filter").classList.remove(SHOW);
    }
}

function showBtnAllDone(listLength) {
    if(listLength > 0) {
        document.querySelector(".js-content__allDone").classList.add(SHOW);
    } else {
        document.querySelector(".js-content__allDone").classList.remove(SHOW);
    }
}

function showBtnClearCompleted() {
    if(activeItems.length < LIST.length) {
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
                      <span class="textItem ${LINE}" job="edit">${toDo}</span>
                      <button class="destroy" job="delete"></button>
                  </li>`;

    const position = "beforeend";
    
    itemsList.insertAdjacentHTML(position, item);
}

function handleKeyUpAddToDo() {
    const toDo = input.value;

    if (/\S/.test(toDo)) {
        if(toDo){
            addToDo(toDo, id, false);
            LIST.push({
                name : toDo,
                id : id,
                done : false,
            });
    
            id++;
    
            countItemsLeft(activeItems.length);
            filterSelection(activeFilterJob);
            showFilter(LIST.length);
            showBtnAllDone(LIST.length);
    
            localStorage.setItem("TODO", JSON.stringify(LIST));
        }
        input.value = "";
    }
}

function removeItems() {
    const done = document.querySelectorAll('.js-SearchElem');
    Object.keys(done).forEach(i => {done[i].parentNode.removeChild(done[i]);});
}

function handleEditToDo() {
    const toDo = input.value;

    if (/\S/.test(toDo)) {
        if(toDo) {
            LIST[editingIndex].name = toDo;
            localStorage.setItem("TODO", JSON.stringify(LIST));
            removeItems();
            loadList(LIST);
        }
        input.value = "";
    }
}

// filter ===================
// ==========================
filterSelection("all")

function filterSelection(name) {
    const className = document.getElementsByClassName("js-SearchElem");
    activeFilterJob = name;

    if(name == "all") name = "";
    Object.keys(className).forEach(i => {
        removeClass(className[i], SHOW);
        if(className[i].className.indexOf(name) > -1) {
            addClass(className[i], SHOW);
        }
    });
}

function addClass(element, name) {
    let arr1, arr2;

    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
        Object.keys(arr2).forEach(i => {
            if(arr1.indexOf(arr2[i]) == -1) {
                element.className += " " + arr2[i];
        }
    });
}

function removeClass(element, name) {
    let arr1, arr2;

    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    Object.keys(arr2).forEach(i => {
        while (arr1.indexOf(arr2[i]) > -1) {
            arr1.splice(arr1.indexOf(arr2[i]), 1);
        }
    });

    element.className = arr1.join(" ");
}

const btnContainer = document.getElementById("filterBtnContainer");
const btns = btnContainer.getElementsByClassName("filterSwitch__btn");

Object.keys(btns).forEach(i => {
    btns[i].addEventListener("click", (elem) => {
        let current = document.getElementsByClassName("included");
        current[0].className = current[0].className.replace(" included", "");
        elem.target.className += " included";
    });
});

// btnDone =================
// =========================
let checked = false;

function checkeAll() {
    const btnCheck = document.querySelectorAll('button[type=button]');

    Object.keys(btnCheck).forEach(i => {
        if(btnCheck[i].parentNode.classList.contains(ACTIVE) == checked) {
            completeToDo(btnCheck[i]);
        } 

        completeToDo(btnCheck[i]);
    });

    filterSelection(activeFilterJob);
    showBtnAllDone(LIST.length);
    showBtnClearCompleted();

    checked = !checked;
    localStorage.setItem("TODO", JSON.stringify(LIST));
}

function completeToDo(element) {
    getIndex(element);

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
    showFilter(LIST.length);
    showBtnAllDone(LIST.length);
    showBtnClearCompleted();

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

function getIndex(element) {
    itemId = element.parentNode.getAttribute("id");
    index = LIST.findIndex(element => element.id == itemId);
}

function handleClick() {
    targetElement();
    getIndex(element);

    if(elementJob == COMPLETED) {
        completeToDo(element);
        filterSelection(activeFilterJob);
        checked = !checked;
    }
    if(elementJob == "delete") { 
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

    countItemsLeft(activeItems.length);
    showFilter(LIST.length);
    showBtnAllDone(LIST.length);
    showBtnClearCompleted();

    localStorage.setItem("TODO", JSON.stringify(LIST));
}

function handleDblClick() {
    if(elementJob == "edit") {
        const item = `<li class="js-SearchElem"><input type="text" class="content__editToDo" value="${LIST[index].name}" id="inputEditItem"></li>`;
        const position = "afterend";

        element.parentNode.insertAdjacentHTML(position, item);
        input = document.getElementById("inputEditItem");
        removeToDo(element);
        editingIndex = index;
    }
}

function handleKeyUp() {
    if(event.keyCode == 13) {
        if(input.id == "inputAddItem") {
            handleKeyUpAddToDo();
        } else {
            handleEditToDo();
        }
    }
    if(event.keyCode == 27) {
        removeItems();
        loadList(LIST);
    }
}

document.addEventListener('click', function(event) {
    const e = document.getElementById("inputEditItem");
        if (!e.contains(event.target)) {
            handleEditToDo()
        };
});

content.addEventListener("click", handleClick, false);

itemsList.addEventListener("dblclick", handleDblClick, false);

content.addEventListener("keyup", handleKeyUp, false);
