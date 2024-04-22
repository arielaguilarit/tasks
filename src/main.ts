import { v4 as uuid } from "uuid";
import "./css/style.css";
import { Task } from "./interfaces/task";
import { labels } from "./shared/labels";
import { getStorage, setStorage } from "./shared/localStorage";
const STORE_TASKS = "tasks";
const form = document.querySelector<HTMLFormElement>("#formTask");

let tasks: Array<Task> = [];
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = form["title"] as unknown as HTMLInputElement;
  const description = form["description"] as unknown as HTMLTextAreaElement;
  if (title.value && description.value) {
    tasks.push({
      title: title.value,
      description: description.value,
      id: uuid(),
    });
    setStorage(STORE_TASKS, tasks);
    form.reset();
    renderListTask(tasks);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  tasks = getStorage(STORE_TASKS);
  renderListTask(tasks);
});

const $tasks = document.querySelector<HTMLFormElement>("#listTasks");
/* $tasks?.addEventListener("drop", (e) => {
  console.log(e);
});
$tasks?.addEventListener("dragover", (e) => {
  console.log(e);
}); */
function renderListTask(tasks: Array<Task>) {
  if (!$tasks) return;
  if ($tasks) $tasks.innerHTML = "";

  const template =
    document.querySelector<HTMLTemplateElement>("#task-template");
  if (!template) return;

  tasks.forEach(({ title, description, id }: Task) => {
    if (!id) return;
    const clone = template.content.cloneNode(true) as DocumentFragment;

    const cardTask = clone.querySelector<HTMLDivElement>(".task-card");
    if (!cardTask) return;

    cardTask.setAttribute("draggable", "true");
    cardTask.addEventListener("dragstart", handleDragStart);
    cardTask.addEventListener("dragend", handleDragEnd);
    cardTask.addEventListener("dragover", handleDragOver);
    cardTask.addEventListener("dragenter", handleDragEnter);
    cardTask.addEventListener("dragleave", handleDragLeave);
    cardTask.addEventListener("drop", handleDrop);
    cardTask.dataset.id = id;

    const titleElement = clone.querySelector<HTMLSpanElement>(".task-title");
    const descriptionElement =
      clone.querySelector<HTMLSpanElement>(".task-description");
    const deleteButton = clone.querySelector<HTMLButtonElement>(".delete-btn");

    if (titleElement) titleElement.textContent = title;
    if (descriptionElement) descriptionElement.textContent = description;
    if (deleteButton) {
      deleteButton.innerHTML = labels.delete;
      deleteButton.dataset.id = id;
      deleteButton.addEventListener("click", () => deleteTask(id));
    }

    $tasks.appendChild(clone);
  });
}

function deleteTask(taskId: string | undefined) {
  if (!taskId) return;
  tasks = tasks.filter((task: Task) => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderListTask(tasks);
}

let elementSelected: HTMLDivElement | null = null;
function handleDragStart(e: DragEvent) {
  const element = e.target as HTMLDivElement;
  element.classList.add("opacity-20");
  elementSelected = element;
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", element.innerHTML);
  }
}

function handleDragEnd(e: DragEvent) {
  const element = e.target as HTMLDivElement;
  element.classList.add("opacity-100");

  document
    .querySelectorAll(".task-card")
    .forEach((el) => el.classList.remove("border-dotted", "opacity-20"));
}

function handleDragOver(e: DragEvent) {
  if (e.preventDefault) {
    e.preventDefault();
  }

  return false;
}

function handleDragEnter(e: DragEvent) {
  const element = e.target as HTMLDivElement;
  element.classList.add("border-dotted");
}

function handleDragLeave(e: DragEvent) {
  const element = e.target as HTMLDivElement;
  element.classList.remove("border-dotted");
}

function handleDrop(e: DragEvent) {
  e.stopPropagation();
  const element = e.target as HTMLDivElement;
  const elementSelectedId = elementSelected?.dataset.id;
  const elementId = element.dataset.id;

  if (elementSelectedId !== elementId) {
    if (elementSelected) elementSelected.innerHTML = element.innerHTML;
    if (e.dataTransfer) element.innerHTML = e.dataTransfer.getData("text/html");

    const taskSelected = tasks.find((t) => t.id === elementSelectedId);
    const task = tasks.find((t) => t.id === elementId);
    const newTasks: Array<Partial<Task>> = tasks.map((t) => {
      if (t.id === elementSelectedId) {
        return {
          ...task,
        };
      }
      if (t.id === elementId) {
        return {
          ...taskSelected,
        };
      }
      return {
        ...t,
      };
    });
    if (newTasks.length > 0) {
      tasks = newTasks as Array<Task>;
      setStorage(STORE_TASKS, newTasks || []);
    }
    //dropContent(e, element);
    //updateTasks(elementSelectedId, elementId);
  }

  return false;
}

/* function dropContent(e: DragEvent, element: HTMLDivElement) {
  if (e.dataTransfer) {
    if (elementSelected) elementSelected.innerHTML = element.innerHTML;
    if (element) element.innerHTML = e.dataTransfer.getData("text/html");
  }
} */

/* function updateTasks(
  elementSelectedId: string | undefined,
  elementId: string | undefined
) {
  if (elementSelectedId && elementId) {
    const taskSelected = tasks.find((t) => t.id === elementSelectedId);
    const task = tasks.find((t) => t.id === elementId);

    const newTasks = tasks.map((t) => {
      if (t.id === elementSelectedId) {
        return { ...task };
      }
      if (t.id === elementId) {
        return { ...taskSelected };
      }
      return { ...t };
    });

    tasks = newTasks as Array<Task>;
    setStorage(STORE_TASKS, newTasks || []);
  }
}
 */
