const listToDo = localStorage.getItem("TODO");
const itemsList = document.getElementById("itemsList");
const content = document.getElementById("content");

const ACTIVE = "active";
const COMPLETED = "completed";
const CHECK = "toggleDone";
const UNCHECK = "toggleNotDone";
const LINE_THROUGH = "lineThrough";
const SHOW = "show";
const ENTER = 13;
const ESC = 27;

let LIST, id, element, elementJob, itemId, index, editingIndex;
let input = document.getElementById("inputAddItem");
let activeItems = document.querySelectorAll('[data-done="active"]');
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
    input = document.getElementById("inputAddItem");
}

function countItemsLeft(num) {
    activeItems = document.querySelectorAll('[data-done="active"]');
    document.getElementById("num").textContent = num;
}

function showFilter(listLength) {
    if(listLength > 0) {
        document.querySelector('[data-filter="filter"]').classList.add(SHOW);
    } else {
        document.querySelector('[data-filter="filter"]').classList.remove(SHOW);
    }
}

function showBtnAllDone(listLength) {
    if(listLength > 0) {
        document.querySelector('[data-job="checkeAll"]').classList.add(SHOW);
    } else {
        document.querySelector('[data-job="checkeAll"]').classList.remove(SHOW);
    }
}

function showBtnClearCompleted() {
    if(activeItems.length < LIST.length) {
        document.querySelector('[data-job="clearCompleted"]').classList.add(SHOW);
    } else {
        document.querySelector('[data-job="clearCompleted"]').classList.remove(SHOW);
    }
}

// addNewItem ===============
// ==========================
function addToDo(toDo, id, done) {
    const MADE = done ? COMPLETED : ACTIVE;
    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";

    const item = `<li class=" list__item item ${SHOW}" id="${id}" data-search="searchElem" data-done="${MADE}">
                      <button class="${DONE}" data-job="checkbox" id="${id}"></button>
                      <span class="textItem ${LINE}" data-job="edit">${toDo}</span>
                      <button class="destroy" data-job="delete"></button>
                  </li>`;

    const position = "beforeend";
    
    itemsList.insertAdjacentHTML(position, item);
}

function handleKeyUpAddToDo() {
    const toDo = input.value;

    if(toDo.trim()) {
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

function removeItems() {
    const done = document.querySelectorAll('[data-search="searchElem"]');
    Object.keys(done).forEach(i => {done[i].parentNode.removeChild(done[i]);});
}

function handleEditToDo() {
    const toDo = input.value;

    if(toDo.trim()) {
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

function filterSelection(filterName) {
    const className = document.querySelectorAll('[data-search="searchElem"]');
    activeFilterJob = filterName;

    countItemsLeft(activeItems.length);
    replaceClass(className, filterName);
}

function replaceClass(element, filterName) {
    Object.keys(element).forEach(i => {
        if(element[i].dataset.done !== filterName) {
            element[i].classList.add(SHOW);
        } else {
            element[i].classList.remove(SHOW);
        }
    });
}

function switchFrame(element) {
    const btnsFilter = document.querySelectorAll('[data-search="btnFilter"]');

    Object.keys(btnsFilter).forEach(i => {
        btnsFilter[i].classList.remove("included");
        element.classList.add("included");
    });
}

// btnDone =================
// =========================
function checkeAll() {
    const allElements = document.querySelectorAll('[data-job="checkbox"]');
    const completedElements = document.querySelectorAll('[data-done="completed"]');

    Object.keys(allElements).forEach(i => {
        if(completedElements.length === allElements.length) {
            completeToDo(allElements[i]);
        } else if (allElements[i].parentNode.getAttribute('data-done') === ACTIVE) {
            completeToDo(allElements[i]);
        }
    });

    filterSelection(activeFilterJob);
    showBtnAllDone(LIST.length);
    showBtnClearCompleted();

    localStorage.setItem("TODO", JSON.stringify(LIST));
}

function completeToDo(element) {
    getIndex(element);

    if(element.parentNode.dataset.done === ACTIVE) {
        element.parentNode.dataset.done = COMPLETED;
        element.classList.add(CHECK);
        element.classList.remove(UNCHECK);
        element.parentNode.querySelector('[data-job="edit"]').classList.add(LINE_THROUGH);
        LIST[index].done = true;
    } else {
        element.parentNode.dataset.done = ACTIVE;
        element.classList.remove(CHECK);
        element.classList.add(UNCHECK);
        element.parentNode.querySelector('[data-job="edit"]').classList.remove(LINE_THROUGH);
        LIST[index].done = false;
    }
}

// btnClear ================
// =========================
function clearCompleted() {
    const done = document.querySelectorAll('[data-job="checkbox"]');

    Object.keys(done).forEach(i => {
        if(done[i].parentNode.getAttribute('data-done') === COMPLETED) {
            const index = LIST.findIndex(element => element.done === true);
            removeToDo(done[i]);
            LIST.splice(index, 1);
        }
    });

    filterSelection(activeFilterJob);
    showFilter(LIST.length);
    showBtnAllDone(LIST.length);
    showBtnClearCompleted();

    localStorage.setItem("TODO", JSON.stringify(LIST));
}

function removeToDo(element) {
    element.parentNode.parentNode.removeChild(element.parentNode);
}

// clickKeyup ==============
// =========================
function targetElement() {
    element = event.target;
    elementJob = element.getAttribute('data-job');
}

function getIndex(element) {
    itemId = element.parentNode.getAttribute("id");
    index = LIST.findIndex(element => element.id == itemId);
}

function handleClick() {
    targetElement();
    getIndex(element);

    if(elementJob === "checkbox") {
        completeToDo(element);
        filterSelection(activeFilterJob);
    }
    if(elementJob === "delete") { 
        removeToDo(element);
        LIST.splice(index, 1);
    }
    if(elementJob === "clearCompleted") {
        clearCompleted();
    }
    if(elementJob === "all") {
        filterSelection("all");
        switchFrame(element);
    }
    if(elementJob === "completed") {
        filterSelection(COMPLETED);
        switchFrame(element);
    }
    if(elementJob === ACTIVE) {
        filterSelection(ACTIVE);
        switchFrame(element);
    }
    if(elementJob === "checkeAll") {
        checkeAll();
    }

    countItemsLeft(activeItems.length);
    showFilter(LIST.length);
    showBtnAllDone(LIST.length);
    showBtnClearCompleted();

    localStorage.setItem("TODO", JSON.stringify(LIST));
}

function handleDblClick() {
    if(input === document.getElementById("inputAddItem")) {
        if(elementJob === "edit") {
            const item = `<li data-search="searchElem"><input type="text" class="content__editToDo" value="${LIST[index].name}" id="inputEditItem"></li>`;
            const position = "afterend";

            element.parentNode.insertAdjacentHTML(position, item);
            input = document.getElementById("inputEditItem");
            removeToDo(element);
            editingIndex = index;
        }
    }
}

function handleKeyUp() {
    if(event.keyCode === ENTER) {
        if(input.id === "inputAddItem") {
            handleKeyUpAddToDo();
        } else {
            handleEditToDo();
        }
    }
    if(event.keyCode === ESC) {
        removeItems();
        loadList(LIST);
    }
}

document.addEventListener('click', function(event) {
    if(input === document.getElementById("inputEditItem")) {
        const e = document.getElementById("inputEditItem");

        if (!e.contains(event.target)) {
            handleEditToDo()
        };
    }
});

content.addEventListener("click", handleClick, false);

itemsList.addEventListener("dblclick", handleDblClick, false);

content.addEventListener("keyup", handleKeyUp, false);
