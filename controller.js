import TodoItem from "./TodoItem.js";

let todoItems = [];

// Handle form submission
document.getElementById("todoForm").addEventListener("submit", event => {
  event.preventDefault();
  const formData = new FormData(event.target); 
  const todoItem = new TodoItem(
    formData.get("title"),
    formData.get("description"),
    new Date(formData.get("dueDate")),
    formData.get("assignee"),
    formData.getAll("attachments")
  );
  // Reset the form
  event.target.reset();
  event.target.querySelector(".attachmentList").innerHTML = "";
  // Add the new todo item
  addTodoItem(todoItem);
  // Show the todo list if it's hidden
  if(document.getElementById("todoHolder").classList.contains("d-none")) {
    document.getElementById("todoHolder").classList.remove("d-none");
  }
});

// Handle attachments preview
document.querySelector("#todoForm .attachments").addEventListener("change", event => {
  updateAttachmentList(event.target.files, event.target.form);
});

// Handle clear attachments button
document.querySelector("#todoForm .clearAttachments").addEventListener("click", (event) => {
  clearAttachments(document.querySelector("#todoForm"));
});

function addTodoItem(todoItem) {
  // Add the new todo item to the in-memory list
  todoItems.push(todoItem);
  // Use the template to create a new todo item element
  const todoListItem = document.getElementById("todoItemTemplate").content.cloneNode(true);
  todoListItem.firstElementChild.id = "todoItem-"+todoItem.id;
  fillTodoListItem(todoListItem, todoItem);
  // Add event listeners for buttons
  todoListItem.querySelector(".btnCompleted").addEventListener("click", (event) => {
    completeTodoItem(todoItem);
    event.currentTarget.classList.toggle("text-bg-success", todoItem.completed);
  });
  todoListItem.querySelector(".btnDelete").addEventListener("click", () => {
    removeTodoItem(todoItem);
  });
  todoListItem.querySelector(".btnEdit").addEventListener("click", () => {
    editTodoItem(todoItem);
  });
  // Append the populated template to the todo list
  document.getElementById("todoList").appendChild(todoListItem);
}

function removeTodoItem(todoItem) {
  // Remove the todo item from the in-memory list
  todoItems.splice(todoItems.indexOf(todoItem), 1);
  // Remove the todo item from the DOM
  document.getElementById("todoItem-"+todoItem.id).remove();
}

function editTodoItem(todoItem) {
  // Create a copy of the form template for editing
  const editForm = document.getElementById("todoForm").cloneNode(true);
  editForm.id = "editForm";
  const modalBody = document.querySelector("#editModal .modal-body");
  modalBody.innerHTML = ""; // Clear any previous form
  const button = editForm.querySelector("button[type='submit']");
  button.textContent = "Save Changes";
  button.setAttribute("data-bs-dismiss", "modal");
  button.setAttribute("data-bs-target", "#editModal");
  modalBody.appendChild(editForm);
  // Populate the form with the existing todo item data
  editForm.elements["title"].value = todoItem.title;
  editForm.elements["description"].value = todoItem.description;
  editForm.elements["dueDate"].valueAsNumber = todoItem.dueDate.valueOf()-todoItem.dueDate.getTimezoneOffset()*60000;
  editForm.elements["assignee"].value = todoItem.assignee;
  updateAttachmentList(todoItem.attachments, editForm);
  // Handle attachments preview
  editForm.querySelector(".attachments").addEventListener("change", event => {
    updateAttachmentList(event.target.files, editForm);
  });
  // Handle clear attachments button
  editForm.querySelector(".clearAttachments").addEventListener("click", (event) => {
    clearAttachments(editForm);
    todoItem.attachments = [];
  });
  // Handle form submission to update the todo item
  editForm.addEventListener("submit", event => {
    event.preventDefault();
    const formData = new FormData(event.target); 
    todoItem.title = formData.get("title");
    todoItem.description = formData.get("description");
    todoItem.dueDate = new Date(formData.get("dueDate"));
    todoItem.assignee = formData.get("assignee");
    todoItem.attachments = [ ...todoItem.attachments, ...formData.getAll("attachments")].filter(file => file.size > 0);
    fillTodoListItem(document.getElementById("todoItem-"+todoItem.id), todoItem);
  });
}

function completeTodoItem(todoItem) {
  todoItem.completed = !todoItem.completed;
  console.log(todoItem);
}

function updateAttachmentList(fileList, form) {
  const attachmentList = form.querySelector("ul");
  for (let i = 0; i < fileList.length; i++) {
    if (fileList[i].size === 0) continue; // Skip empty files
    const listItem = document.createElement("li");
    listItem.classList.add("list-group-item", "border-0", "bi", "bi-file-earmark");
    listItem.textContent = fileList[i].name;
    attachmentList.appendChild(listItem);
  }
}

function clearAttachments(form) {
  form.querySelector(".attachments").value = "";
  form.querySelector(".attachmentList").innerHTML = "";
}

function fillTodoListItem(todoListItem, todoItem) {
  todoListItem.querySelector(".todoTitle").textContent = todoItem.title;
  todoListItem.querySelector(".todoDescription").textContent = todoItem.description;
  todoListItem.querySelector(".todoDueDate").textContent = todoItem.dueDate.toISOString().split('T')[0];
  if (todoItem.assignee !== "0") {
    todoListItem.querySelector(".todoAssignee").textContent = todoItem.assignee;
    todoListItem.querySelector(".todoAssigneeBadge").classList.remove("d-none");
  } else {
    todoListItem.querySelector(".todoAssigneeBadge").classList.add("d-none");
  }
  if (todoItem.attachments.length === 0 || todoItem.attachments.length === 1 && todoItem.attachments[0].size === 0) {
    todoListItem.querySelector(".todoAttachmentsBadge").classList.add("d-none");
  } else {
    todoListItem.querySelector(".todoAttachements").textContent = todoItem.attachments.length + " attachment" + (todoItem.attachments.length > 1 ? "s" : "");
    todoListItem.querySelector(".todoAttachmentsBadge").classList.remove("d-none");
  }
  todoListItem.querySelector(".btnCompleted").classList.toggle("text-bg-success", todoItem.completed);
  todoListItem.querySelector(".todoCreatedDate").textContent = todoItem.createdDate.toISOString().split('T')[0];
}