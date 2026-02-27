let identity = 0;

class TodoItem {
  constructor(title, description, dueDate, assignee, attachments) {
    this.id = identity++;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.assignee = assignee;
    this.attachments = attachments;
    this.createdDate = new Date();
  }
}

export default TodoItem;
