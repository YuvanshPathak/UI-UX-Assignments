const form = document.getElementById('taskForm');
const titleInput = document.getElementById('title');
const descInput = document.getElementById('description');
const taskList = document.getElementById('taskList');

form.addEventListener('submit', function(e){
  e.preventDefault();
  const title = titleInput.value.trim();
  const desc = descInput.value.trim();
  if(!title){
    titleInput.focus();
    return;
  }
  addTask(title, desc);
  form.reset();
  titleInput.focus();
});

function addTask(title, description){
  const task = document.createElement('div');
  task.className = 'task';

  const head = document.createElement('div');
  head.className = 'task-head';

  const titleEl = document.createElement('h3');
  titleEl.textContent = title;

  const actions = document.createElement('div');
  actions.className = 'actions';


  const markBtn = document.createElement('button');
  markBtn.type = 'button';
  markBtn.className = 'small';
  markBtn.textContent = 'Mark as Completed';

  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'small';
  editBtn.textContent = 'Edit';

  const delBtn = document.createElement('button');
  delBtn.type = 'button';
  delBtn.className = 'small danger';
  delBtn.textContent = 'Delete';

  actions.appendChild(markBtn);
  actions.appendChild(editBtn);
  actions.appendChild(delBtn);

  head.appendChild(titleEl);
  head.appendChild(actions);

  const descEl = document.createElement('p');
  descEl.textContent = description;

  task.appendChild(head);
  task.appendChild(descEl);

  // Add behavior
  let completed = false;

  markBtn.addEventListener('click', () => {
    completed = !completed;
    titleEl.classList.toggle('completed', completed);
    descEl.classList.toggle('completed', completed);
    markBtn.textContent = completed ? 'Mark as Incomplete' : 'Mark as Completed';
  });

  delBtn.addEventListener('click', () => {
    task.remove();
  });

  editBtn.addEventListener('click', () => {
    if(editBtn.textContent === 'Edit'){
      // switch to edit mode
      const titleInputEdit = document.createElement('input');
      titleInputEdit.type = 'text';
      titleInputEdit.value = titleEl.textContent;
      titleInputEdit.className = 'edit-title';

      const descInputEdit = document.createElement('textarea');
      descInputEdit.value = descEl.textContent;
      descInputEdit.className = 'edit-desc';

      head.replaceChild(titleInputEdit, titleEl);
      task.replaceChild(descInputEdit, descEl);

      editBtn.textContent = 'Save';
      titleInputEdit.focus();
    } else {
      // save changes
      const newTitleInput = head.querySelector('.edit-title');
      const newDescInput = task.querySelector('.edit-desc');
      const newTitle = newTitleInput.value.trim() || 'Untitled';
      const newDesc = newDescInput.value.trim();

      const newTitleEl = document.createElement('h3');
      newTitleEl.textContent = newTitle;
      if(completed) newTitleEl.classList.add('completed');

      const newDescEl = document.createElement('p');
      newDescEl.textContent = newDesc;
      if(completed) newDescEl.classList.add('completed');

      head.replaceChild(newTitleEl, newTitleInput);
      task.replaceChild(newDescEl, newDescInput);

      const updatedTitle = head.querySelector('h3');
      const updatedDesc = task.querySelector('p');

      editBtn.textContent = 'Edit';
    }
  });

  taskList.prepend(task);
}

