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

  console.log("Todo item created:", todoItem);
});

function addTodoItemToUI(todoItem) {
  const todoListItem = document.getElementById("todoItemTemplate").content.cloneNode(true);
  todoListItem.querySelector(".todoTitle").textContent = todoItem.title;
  todoListItem.querySelector(".todoDescription").textContent = todoItem.description;
  todoListItem.querySelector(".todoDueDate").textContent = todoItem.dueDate.toISOString().split('T')[0];
  if (todoItem.assignee !== "0") {
    todoListItem.querySelector(".todoAssignee").textContent = todoItem.assignee;
  } else {
    todoListItem.querySelector(".todoAssigneeBadge").style.display = "none";
  }
  if (todoItem.attachments.length > 0) {
    console.log(todoItem.attachments.length);
    todoListItem.querySelector(".todoAttachements").textContent = todoItem.attachments.length + " attachment" + (todoItem.attachments.length > 1 ? "s" : "");
  } else {
    todoListItem.querySelector(".todoAttachmentsBadge").style.display = "none";

    console.log(todoItem.attachments.length);
  }
  todoListItem.querySelector(".todoCreatedDate").textContent = todoItem.createdDate.toISOString().split('T')[0];

  const todoElement = todoListItem.querySelector(".todoListItem");

  todoListItem.querySelector(".btnDelete").addEventListener("click", () => {
    todoElement.remove();
  });

  document.getElementById("todoList").appendChild(todoListItem);
}

// document.getElementsByClassName("btnDelete").addEventListener("click", event => {
//   const todoListItem = event.target.closest(".todoListItem");
//   todoListItem.remove();
// });

