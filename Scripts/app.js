class SelectBox {
  constructor(selector, onOption) {
    this.main = document.querySelector(selector);

    this.optionsContainer = this.main.querySelector(".options-container");
    this.selectBoxBtn = this.main.querySelector(".selected-btn");
    this.options = this.main.querySelectorAll(".option");
    this.onOption = onOption;

    this.selectBoxBtn.addEventListener("click", () => {
      this.optionsContainer.classList.toggle("active");
    });

    this.options.forEach((option, index) => {
      if (index === 0 && localStorage.getItem("sort") == null) {
        //this.makeOptionActive(option.textContent);
      }
      option.addEventListener("click", () => {
        this.optionsContainer.classList.remove("active");

        this.deactivateOptions();
        this.makeOptionActive(option.textContent);
        this.onOption();
      });
    });
  }

  deactivateOptions() {
    this.options.forEach((item) => {
      item.classList.remove("active-option");
    });
  }

  makeOptionActive(optionId) {
    this.options.forEach((option) => {
      if (option.textContent === optionId) {
        option.classList.add("active-option");
        this.activeOptionId = optionId;
      }
    });

    localStorage.setItem("sort", optionId);
  }
}

const inputField = document.querySelector("#input-field");
const renameInputField = document.querySelector("#rename-input");
const inputSearch = document.querySelector("#input-search");

const cancleRenameButton = document.querySelector("#rename-cancle");
const submitButton = document.querySelector("#submit-btn");
const renameButton = document.querySelector("#rename-submit");

const itemHolder = document.querySelector(".items-holder");

const renameScreen = document.querySelector(".rename-item-screen");

const nameWarrning = document.querySelector(".name-warrning");

const filterBox = new SelectBox("#filter-box", () => {
  filterItems();
  filterItemsBySearch();
});

const sortbox = new SelectBox("#sort-box", sortItems);

let itemToRename = null;

submitButton.addEventListener("click", () => {
  addItem(inputField.value);
  inputField.value = "";

  checkSubmitButtonValidity();
});

checkSubmitButtonValidity();
inputField.addEventListener("input", () => {
  checkSubmitButtonValidity();
});

inputSearch.addEventListener("input", filterItemsBySearch);

cancleRenameButton.addEventListener("click", () => {
  renameScreen.classList.remove("show-rename");
  itemToRename = null;
});

renameButton.addEventListener("click", () => {
  renameScreen.classList.remove("show-rename");
  renameItem(itemToRename, renameInputField.value);
  itemToRename = null;

  saveItems();
});

function addItem(content, date = null, done = false) {
  const item = document.createElement("div");
  item.classList.add("todo-item");
  if (done) item.classList.add("item-done");
  if (filterBox.activeOptionId === "Not Done") {
    item.classList.add("hide-item");
  }

  item.innerHTML = createItemHTML(content, date);

  itemHolder.appendChild(item);

  removeItemAction(item);
  markItemAction(item);
  renameItemAction(item);
  draggableItemAction(item);

  sortItems();

  saveItems();
}

function createItemHTML(task, date = null) {
  if (date === null) date = moment().format("MMMM Do YYYY, h:mm:ss a");
  return `<div class="item-content">
            <p class="item-task">Task: ${task}</p>
            <p class="item-date">Created on: ${date}</p>
        </div>
        <button class="mark-item-done">Mark as Done</button>
        <button class="rename-item">Rename Item </button>
        <button class="remove-item">Remove Item</button>`;
}

function removeItemAction(item) {
  item.querySelector(".remove-item").addEventListener("click", (e) => {
    itemHolder.removeChild(e.target.parentElement);
    saveItems();
  });
}

function markItemAction(item) {
  item.querySelector(".mark-item-done").addEventListener("click", (e) => {
    e.target.parentElement.classList.toggle("item-done");
    if (e.target.parentElement.classList.contains("item-done")) {
      e.target.textContent = "Unmark as Done";
      if (filterBox.activeOptionId === "Done") {
        e.target.parentElement.classList.add("hide-item");
      }
    } else {
      e.target.textContent = "Mark as Done";
      if (filterBox.activeOptionId === "Not Done") {
        e.target.parentElement.classList.add("hide-item");
      }
    }
    saveItems();
  });
}

function renameItemAction(item) {
  item.querySelector(".rename-item").addEventListener("click", (e) => {
    renameScreen.classList.add("show-rename");
    renameInputField.value = "";
    itemToRename = e.target.parentElement;
  });
}

function draggableItemAction(item) {
  item.addEventListener("dragstart", () => {
    item.classList.add("dragging-item");
  });

  item.addEventListener("dragend", () => {
    item.classList.remove("dragging-item");
    saveItems();
    console.log("nesto");
  });

  itemHolder.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(itemHolder, e.clientY);
    const draggable = document.querySelector(".dragging-item");
    if (afterElement == null) {
      itemHolder.appendChild(draggable);
    } else {
      itemHolder.insertBefore(draggable, afterElement);
    }
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".draggable-item:not(.dragging-item)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    {
      offset: Number.NEGATIVE_INFINITY,
    }
  ).element;
}

function renameItem(item, newName) {
  item.querySelector(".item-task").textContent = `Task: ${newName}`;
}

function getTaskName(item) {
  return item.querySelector(".item-task").textContent.slice(6);
}

function getTaskDate(item) {
  return moment(
    item.querySelector(".item-date").textContent.slice(12),
    "MMMM Do YYYY, h:mm:ss a"
  );
}

function getSortedItems(items) {
  switch (sortbox.activeOptionId) {
    case "Name Ascending":
      return getSortedItemsByName(items);

    case "Name Deescending":
      return getSortedItemsByName(items).reverse();

    case "Newest":
      return getSortedItemsByDate(items);

    case "Oldest":
      return getSortedItemsByDate(items).reverse();
  }
}

function getSortedItemsByName(items) {
  return items.sort((a, b) => {
    const nameA = getTaskName(a).toUpperCase();
    const nameB = getTaskName(b).toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    return 0;
  });
}

function getSortedItemsByDate(items) {
  return items.sort((a, b) => {
    const dateA = getTaskDate(a);
    const dateB = getTaskDate(b);

    if (dateA < dateB) {
      return -1;
    }
    if (dateA > dateB) {
      return 1;
    }

    return 0;
  });
}

function sortItems() {
  if (sortbox.activeOptionId === "Custom") {
    document.querySelectorAll(".todo-item").forEach((item) => {
      item.classList.add("draggable-item");
      item.setAttribute("draggable", "true");
    });
    return;
  } else {
    document.querySelectorAll(".todo-item").forEach((item) => {
      item.classList.remove("draggable-item");
      item.setAttribute("draggable", "false");
    });
  }

  const items = Array.prototype.slice.call(
    document.querySelectorAll(".todo-item")
  );

  const sortedItems = getSortedItems(items);

  for (var i = 0, len = sortedItems.length; i < len; i++) {
    const detatchedItem = itemHolder.removeChild(sortedItems[i]);
    itemHolder.appendChild(detatchedItem);
  }
}

function checkSubmitButtonValidity() {
  if (inputField.value === "") {
    submitButton.style.backgroundColor = "rgb(50, 88, 76)";
    submitButton.style.pointerEvents = "none";
    nameWarrning.style.display = "block";
  } else {
    submitButton.style.backgroundColor = "#7fffd4";
    submitButton.style.pointerEvents = "initial";
    nameWarrning.style.display = "none";
  }
}

function filterItems() {
  document.querySelectorAll(".todo-item").forEach((item) => {
    switch (filterBox.activeOptionId) {
      case "All":
        item.classList.remove("hide-item");
        break;
      case "Done":
        item.classList.contains("item-done")
          ? item.classList.remove("hide-item")
          : item.classList.add("hide-item");
        break;
      case "Not Done":
        item.classList.contains("item-done")
          ? item.classList.add("hide-item")
          : item.classList.remove("hide-item");
        break;
    }
  });
}

function filterItemsBySearch() {
  if (inputSearch.value === "") {
    filterItems();
    return;
  }

  document.querySelectorAll(".todo-item").forEach((item) => {
    const regex = new RegExp(`^${inputSearch.value}`, "gi");
    if (!getTaskName(item).match(regex)) item.classList.add("hide-item");
  });
}

function saveItems() {
  const itemsObject = [];

  document.querySelectorAll(".todo-item").forEach((item) => {
    itemsObject.push({
      task: getTaskName(item),
      date: item.querySelector(".item-date").textContent.slice(12),
      isDone: item.classList.contains("item-done"),
    });
  });
  localStorage.setItem("items", JSON.stringify(itemsObject));
}

function loadItems() {
  const itemsObject = JSON.parse(localStorage.getItem("items"));

  sortbox.makeOptionActive(localStorage.getItem("sort"));
  itemsObject.forEach((item) => {
    addItem(item.task, item.date, item.isDone);
  });
}

loadItems();
