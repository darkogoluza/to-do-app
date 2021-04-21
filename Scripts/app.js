const inputField = document.querySelector("#input-field");
const renameInputField = document.querySelector("#rename-input");

const cancleRenameButton = document.querySelector("#rename-cancle");
const submitButton = document.querySelector("#submit-btn");
const renameButton = document.querySelector("#rename-submit");

const itemHolder = document.querySelector(".items-holder");

const renameScreen = document.querySelector(".rename-item-screen");

let itemToRename = null;

submitButton.addEventListener("click", () => {
  inputField.value !== ""
    ? addItem(inputField.value)
    : alert("Pleas add some name for your To Do item");
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

  item.innerHTML = createItemHTML(content);

  itemHolder.appendChild(item);

  removeItemAction(item);
  markItemAction(item);
  renameItemAction(item);
}

function createItemHTML(task) {
  return `<div class="item-content">
            <p class="item-task">Task: ${task}</p>
            <p>Created on: ${new Date()}</p>
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
    e.target.parentElement.classList.contains("item-done")
      ? (e.target.textContent = "Unmark as Done")
      : (e.target.textContent = "Mark as Done");
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
