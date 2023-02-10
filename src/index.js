import "./styles/dashboard.css";

// Factory fuction to create todos

const projectList = document.querySelector(".sub-menu");
const projectForm = document.querySelector("[data-new-project-form");
const projectFormInput = document.querySelector("[data-new-project-input");
const deleteProject = document.querySelector(".btn-delete");
const projectTitle = document.querySelector("[data-project-title]");

const tasksContainer = document.querySelector("[data-tasks]");
const taskTemplate = document.getElementById("taskTemplate");
const newTaskForm = document.querySelector("[data-new-task-form]");
const newTaskName = document.querySelector("[data-new-task-title]");
const newTaskDate = document.querySelector("[data-new-task-date]");
const newTaskPriority = document.querySelector("[data-new-task-priority]");

const LOCAL_STORAGE_PROJECTS_KEY = "projects.lists";
const LOCAL_STORAGE_SELECTED_PROJECTS_KEY = "projects.selectedID";

let projects =
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY)) || [];

let selectedProjectId = localStorage.getItem(
  LOCAL_STORAGE_SELECTED_PROJECTS_KEY
);

projectForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const projectName = projectFormInput.value;
  if (projectName == null || projectName === "") return;
  const project = createProject(projectName);
  projectFormInput.value = null;
  projects.push(project);
  saveAndRender();
});

newTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskName = newTaskName.value;
  const taskDate = newTaskDate.value;
  const taskPriority = newTaskPriority.value;
  if (taskName == null || taskName === "") return;
  const task = createTask(taskName, taskDate, taskPriority);

  newTaskName.value = null;
  newTaskDate.value = null;
  newTaskPriority.value = null;

  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  );
  selectedProject.tasks.push(task);
  saveAndRender();
});

function createTask(title, date, priority) {
  return {
    id: Date.now().toString(),
    title,
    date,
    priority,
    complete: false,
  };
}

function createProject(name) {
  return {
    id: Date.now().toString(),
    name,
    tasks: [],
  };
}
projectList.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedProjectId = e.target.dataset.projectId;
    saveAndRender();
  }
});

deleteProject.addEventListener("click", (e) => {
  projects = projects.filter((project) => project.id !== selectedProjectId);
  selectedProjectId = null;
  saveAndRender();
});
function saveAndRender() {
  save();
  render();
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(projects));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_PROJECTS_KEY, selectedProjectId);
}

function render() {
  clearElement(projectList);
  renderProjects();
  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  );
  projectTitle.innerText = selectedProject.name;
  clearElement(tasksContainer);
  renderTasks(selectedProject);
}

function renderTasks(selectedProject) {
  selectedProject.tasks.forEach((i) => {
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkbox = taskElement.querySelector("input");
    const name = taskElement.querySelector("h4");
    const date = taskElement.querySelector(".dueDate");

    name.append(i.title);
    date.append(i.date);
    tasksContainer.appendChild(taskElement);
  });
}

function renderProjects() {
  projects.forEach((project) => {
    const tag = document.createElement("li");
    tag.dataset.projectId = project.id;
    tag.classList.add(".sub-item");
    tag.innerText = project.name;
    if (project.id === selectedProjectId) {
      tag.classList.add("activeProject");
    }
    projectList.appendChild(tag);
  });
}
function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

// LOgic for opening and clopsing form
const formOperation = (() => {
  document.querySelector(".formButton").addEventListener("click", () => {
    document.querySelector(".popup").classList.add("active");
  });

  document.querySelector(".close-btn").addEventListener("click", () => {
    document.querySelector(".popup").classList.remove("active");
  });
})();
// logic fdor opening/closing project form
const projectCreation = (() => {
  document.querySelector(".btn-add").addEventListener("click", () => {
    document.querySelector(".popup2").classList.add("active");
  });

  document.querySelector(".close-btn2").addEventListener("click", () => {
    document.querySelector(".popup2").classList.remove("active");
  });
})();

render();
