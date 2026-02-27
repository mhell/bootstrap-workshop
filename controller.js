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
document.querySelector(".attachmentInput").addEventListener("change", event => {
  updateAttachmentList(event.target.files, event.target.form);
});

function addTodoItem(todoItem) {
  // Add the new todo item to the in-memory list
  todoItems.push(todoItem);

  const todoListItem = document.getElementById("todoItemTemplate").content.cloneNode(true);
  // Populate the template with the todo item data
  todoListItem.id = "todoItem-" + todoItem.id;
  todoListItem.querySelector(".todoTitle").textContent = todoItem.title;
  todoListItem.querySelector(".todoDescription").textContent = todoItem.description;
  todoListItem.querySelector(".todoDueDate").textContent = todoItem.dueDate.toISOString().split('T')[0];
  if (todoItem.assignee !== "0") {
    todoListItem.querySelector(".todoAssignee").textContent = todoItem.assignee;
  } else {
    todoListItem.querySelector(".todoAssigneeBadge").classList.add("d-none");
  }
  if (todoItem.attachments.length === 0 || todoItem.attachments.length === 1 && todoItem.attachments[0].size === 0) {  
    todoListItem.querySelector(".todoAttachmentsBadge").classList.add("d-none");
  } else {
    todoListItem.querySelector(".todoAttachements").textContent = todoItem.attachments.length + " attachment" + (todoItem.attachments.length > 1 ? "s" : "");
  }
  todoListItem.querySelector(".todoCreatedDate").textContent = todoItem.createdDate.toISOString().split('T')[0];
  // Add event listener for delete button
  todoListItem.querySelector(".btnDelete").addEventListener("click",  () => {
    removeTodoItem(todoItem);
  });
  // Add event listener for edit button
  todoListItem.querySelector(".btnEdit").addEventListener("click", () => {
    editTodoItem(todoItem);
  });
  // Append the populated template to the todo list
  document.getElementById("todoList").appendChild(todoListItem);
}

function removeTodoItem(todoItem) {
  todoItems.splice(todoItems.indexOf(todoItem), 1);
  document.getElementById("todoItem-"+todoItem.id).remove();
}

function editTodoItem(todoItem) {
  const editForm = document.getElementById("todoForm").cloneNode(true);
  editForm.id = "editForm";
  const modalBody = document.querySelector("#editModal .modal-body");
  modalBody.innerHTML = ""; // Clear any previous form
  modalBody.appendChild(editForm);
  // Populate the form with the existing todo item data
  editForm.elements["title"].value = todoItem.title;
  editForm.elements["description"].value = todoItem.description;
  editForm.elements["dueDate"].valueAsNumber = todoItem.dueDate.valueOf()-todoItem.dueDate.getTimezoneOffset()*60000;
  editForm.elements["assignee"].value = todoItem.assignee;
  updateAttachmentList(todoItem.attachments, editForm);
  // Handle attachments preview
  editForm.querySelector(".attachmentInput").addEventListener("change", event => {
    updateAttachmentList(event.target.files, editForm);
  });

  // Handle form submission to update the todo item
}

function updateAttachmentList(fileList, form) {
  const attachmentList = form.querySelector("ul");
  for (let i = 0; i < fileList.length; i++) {
    const listItem = document.createElement("li");
    listItem.classList.add("list-group-item", "border-0", "bi", "bi-file-earmark");
    listItem.textContent = fileList[i].name;
    attachmentList.appendChild(listItem);
  }
}

