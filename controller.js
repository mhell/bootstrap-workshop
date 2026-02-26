import TodoItem from "./TodoItem.js";

const todoForm = document.getElementById("todoForm");

todoForm.addEventListener("submit", event => {
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
  todoForm.reset();
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

