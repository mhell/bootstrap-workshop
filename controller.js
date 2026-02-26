import TodoItem from "./TodoItem.js";

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
  addTodoItemToUI(todoItem);
  event.target.reset();
  // Show the todo list if it's hidden
  if(document.getElementById("todoHolder").classList.contains("d-none")) {
    document.getElementById("todoHolder").classList.remove("d-none");
  }
});

document.getElementById("attachmentInput").addEventListener("change", event => {
  const fileList = event.target.files;
  const attachmentList = document.getElementById("attachmentList");
  for (let i = 0; i < fileList.length; i++) {
    const listItem = document.createElement("li");
    listItem.classList.add("list-group-item", "border-0", "bi", "bi-file-earmark");
    listItem.textContent = fileList[i].name;
    attachmentList.appendChild(listItem);
  }
});

function addTodoItemToUI(todoItem) {
  const todoListItem = document.getElementById("todoItemTemplate").content.cloneNode(true);
  // Populate the template with the todo item data
  todoListItem.querySelector(".todoTitle").textContent = todoItem.title;
  todoListItem.querySelector(".todoDescription").textContent = todoItem.description;
  todoListItem.querySelector(".todoDueDate").textContent = todoItem.dueDate.toISOString().split('T')[0];
  if (todoItem.assignee !== "0") {
    todoListItem.querySelector(".todoAssignee").textContent = todoItem.assignee;
  } else {
    todoListItem.querySelector(".todoAssigneeBadge").style.display = "none";
  }
  if (todoItem.attachments.length === 0 || todoItem.attachments.length === 1 && todoItem.attachments[0].size === 0) {  
    todoListItem.querySelector(".todoAttachmentsBadge").style.display = "none";
  } else {
    todoListItem.querySelector(".todoAttachements").textContent = todoItem.attachments.length + " attachment" + (todoItem.attachments.length > 1 ? "s" : "");
  }
  todoListItem.querySelector(".todoCreatedDate").textContent = todoItem.createdDate.toISOString().split('T')[0];
  // Store the real element (not the template) for deletion
  const todoElement = todoListItem.querySelector(".todoListItem");
  // Add event listener for delete button
  todoListItem.querySelector(".btnDelete").addEventListener("click", () => {
    todoElement.remove();
  });
  // Append the populated template to the todo list
  document.getElementById("todoList").appendChild(todoListItem);
}

