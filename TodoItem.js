//let identity = 0; // works as well (this.id = identity++;)

class TodoItem {
  static identity = 0;

  constructor(title, description, dueDate, assignee, attachments) {
    this.id = TodoItem.identity++;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.assignee = assignee;
    this.attachments = attachments;
    this.createdDate = new Date();
  }
}

export default TodoItem;
