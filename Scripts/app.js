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
      if (index === 0) {
        this.makeOptionActive(option);
      }
      option.addEventListener("click", () => {
        this.optionsContainer.classList.remove("active");

        this.deactivateOptions();
        this.makeOptionActive(option);
        this.onOption();
      });
    });
  }

  deactivateOptions() {
    this.options.forEach((item) => {
      item.classList.remove("active-option");
    });
  }

  makeOptionActive(option) {
    option.classList.add("active-option");
    this.activeOptionId = option.textContent;
  }
}

const inputField = document.querySelector("#input-field");
const renameInputField = document.querySelector("#rename-input");

const cancleRenameButton = document.querySelector("#rename-cancle");
const submitButton = document.querySelector("#submit-btn");
const renameButton = document.querySelector("#rename-submit");

const itemHolder = document.querySelector(".items-holder");

const renameScreen = document.querySelector(".rename-item-screen");

const filterBox = new SelectBox("#filter-box", () => {
  document.querySelectorAll(".todo-item").forEach((item) => {
    switch (filterBox.activeOptionId) {
      case "All":
        item.classList.remove("hide-item");
        break;
      case "Not Done":
        item.classList.contains("item-done")
          ? item.classList.remove("hide-item")
          : item.classList.add("hide-item");
        break;
      case "Done":
        item.classList.contains("item-done")
          ? item.classList.add("hide-item")
          : item.classList.remove("hide-item");
        break;
    }
  });
});

const sortbox = new SelectBox("#sort-box", () => {
  const items = Array.prototype.slice.call(
    document.querySelectorAll(".todo-item")
  );

  const sortedItems = getSortedItems(items);

  for (var i = 0, len = sortedItems.length; i < len; i++) {
    const detatchedItem = itemHolder.removeChild(sortedItems[i]);
    itemHolder.appendChild(detatchedItem);
  }
});

let itemToRename = null;

submitButton.addEventListener("click", () => {
  inputField.value !== ""
    ? addItem(inputField.value)
    : alert("Pleas add some name for your To Do item");

  inputField.value = "";
});

cancleRenameButton.addEventListener("click", () => {
  renameScreen.classList.remove("show-rename");
  itemToRename = null;
});

renameButton.addEventListener("click", () => {
  renameScreen.classList.remove("show-rename");
  renameItem(itemToRename, renameInputField.value);
  itemToRename = null;
});

function addItem(content) {
  const item = document.createElement("div");
  item.classList.add("todo-item");
  if (filterBox.activeOptionId === "Not Done") {
    item.classList.add("hide-item");
  }

  item.innerHTML = createItemHTML(content);

  itemHolder.appendChild(item);

  removeItemAction(item);
  markItemAction(item);
  renameItemAction(item);
}

function createItemHTML(task) {
  return `<div class="item-content">
            <p class="item-task">Task: ${task}</p>
            <p class="item-date">Created on: ${new Date().toLocaleString()}</p>
        </div>
        <button class="mark-item-done">Mark as Done</button>
        <button class="rename-item">Rename Item </button>
        <button class="remove-item">Remove Item</button>`;
}

function removeItemAction(item) {
  item.querySelector(".remove-item").addEventListener("click", (e) => {
    itemHolder.removeChild(e.target.parentElement);
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
  });
}

function renameItemAction(item) {
  item.querySelector(".rename-item").addEventListener("click", (e) => {
    renameScreen.classList.add("show-rename");
    renameInputField.value = "";
    itemToRename = e.target.parentElement;
  });
}

function renameItem(item, newName) {
  item.querySelector(".item-task").textContent = `Task: ${newName}`;
}

function getTaskName(task) {
  return task.textContent.slice(6);
}

function getTaskDate(task) {
  return Date.parse(task.textContent.slice(12));
}

function getSortedItems(items) {
  switch (sortbox.activeOptionId) {
    case "Name Ascending":
      return getSortedItemsByName(items);

    case "Name Deescending":
      return getSortedItemsByName(items).reverse();

    case "Date Ascending":
      return getSortedItemsByDate(items);
  }
}

function getSortedItemsByName(items) {
  return items.sort((a, b) => {
    const nameA = getTaskName(a.querySelector(".item-task")).toUpperCase();
    const nameB = getTaskName(b.querySelector(".item-task")).toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  });
}

function getSortedItemsByDate(items) {
  return items.sort((a, b) => {
    const dateA = getTaskDate(a.querySelector(".item-date"));
    const dateB = getTaskDate(b.querySelector(".item-date"));

    console.log(dateA);

    if (dateA < dateB) {
      return -1;
    }
    if (dateA > dateB) {
      return 1;
    }

    // names must be equal
    return 0;
  });
}
