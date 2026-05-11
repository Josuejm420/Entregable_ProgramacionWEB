
function handleFormSubmit(event) {

	event.preventDefault();

	const formData = new FormData(event.target);

	const task = Object.fromEntries(formData);

	// ID UNICO

	task.id = Date.now();

	// FECHA Y HORA

	task.createdAt = new Date().toLocaleString();

	const errorMessage = document.getElementById("error-message");

	errorMessage.textContent = "";

	// VALIDACIONES

	if (task.title.trim() === "") {

		errorMessage.textContent = "El titulo no puede estar vacio";

		return;
	}

	if (task.title.trim().length < 4) {

		errorMessage.textContent = "El titulo debe tener al menos 4 caracteres";

		return;
	}

	if (task.description.length > 150) {

		errorMessage.textContent = "La descripcion no puede exceder los 150 caracteres";

		return;
	}

	// VALIDAR TITULOS DUPLICADOS

	const titles = document.querySelectorAll(".task-content h3");

	for (let title of titles) {

		if (title.textContent.toLowerCase() === task.title.toLowerCase()) {

			errorMessage.textContent = "Ya existe una tarea con este titulo";

			return;
		}
	}

	// CREAR TAREA

	const taskElement = createTaskElement(task);

	const ulContainer = document.getElementById("task-list-container");

	ulContainer.appendChild(taskElement);

	event.target.reset();
}

function createTaskElement(task) {

	// CONTENIDO PRINCIPAL

	const divTaskContent = document.createElement("div");

	divTaskContent.classList.add("task-content");

	// TITULO

	const h3Title = document.createElement("h3");

	h3Title.textContent = task.title;

	// DESCRIPCION

	const pDescription = document.createElement("p");

	pDescription.textContent = task.description;

	// ESTADO

	const statusBadge = document.createElement("span");

	statusBadge.textContent = task.status;

	statusBadge.classList.add("task-status");

	// COLORES SEGUN ESTADO

	if (task.status === "Inicial") {

		statusBadge.classList.add("status-inicial");
	}

	if (task.status === "En proceso") {

		statusBadge.classList.add("status-proceso");
	}

	if (task.status === "Finalizada") {

		statusBadge.classList.add("status-finalizada");
	}

	// FECHA

	const smallDate = document.createElement("small");

	smallDate.textContent = `📅 ${task.createdAt}`;

	// AGREGAR ELEMENTOS

	divTaskContent.appendChild(h3Title);
	divTaskContent.appendChild(pDescription);
	divTaskContent.appendChild(statusBadge);
	divTaskContent.appendChild(document.createElement("br"));
	divTaskContent.appendChild(smallDate);

	// CONTENEDOR BOTONES

	const divTaskAction = document.createElement("div");
	divTaskAction.classList.add("task-actions");

	// BOTON EDITAR

	const editButton = document.createElement("button");
	editButton.textContent = "🖋️Editar";
	editButton.classList.add("edit-btn");

	editButton.addEventListener("click", () => {
        enableEditMode(
			task.id,
			h3Title,
			pDescription,
			divTaskAction
		);
	});

	// BOTON ELIMINAR

	const deleteButton = document.createElement("button");

	deleteButton.textContent = "🗑️Eliminar";

	deleteButton.classList.add("delete-btn");

	deleteButton.addEventListener("click", () => {

		deleteTaskElement(task.id);
	});

	// AGREGAR BOTONES

	divTaskAction.appendChild(editButton);

	divTaskAction.appendChild(deleteButton);

	// CREAR LI

	const li = document.createElement("li");

	li.classList.add("task-item");

	li.id = task.id;

	li.appendChild(divTaskContent);

	li.appendChild(divTaskAction);

	return li;
}

function deleteTaskElement(taskId) {

	const li = document.getElementById(taskId);

	li.remove();
}

function enableEditMode(taskId, titleElement, descriptionElement, actionContainer) {

	const currentTitle = titleElement.textContent;

	const currentDescription = descriptionElement.textContent;

	// INPUT TITULO

	const titleInput = document.createElement("input");

	titleInput.value = currentTitle;

	// INPUT DESCRIPCION

	const descriptionInput = document.createElement("textarea");

	descriptionInput.value = currentDescription;

	// REEMPLAZAR

	titleElement.replaceWith(titleInput);

	descriptionElement.replaceWith(descriptionInput);

	actionContainer.innerHTML = "";

	// BOTON GUARDAR

	const saveButton = document.createElement("button");

	saveButton.textContent = "💾Guardar";

	saveButton.classList.add("save-btn");

	saveButton.addEventListener("click", () => {

		const newTitle = titleInput.value.trim();

		const newDescription = descriptionInput.value.trim();

		// VALIDACIONES

		if (newTitle === "") {

			alert("El titulo no puede estar vacio");

			return;
		}
		if (newTitle.length < 4) {

			alert("El titulo debe tener al menos 4 caracteres");

			return;
		}
		if (newDescription.length > 150) {

			alert("La descripcion no puede exceder los 150 caracteres");

			return;
		}

		// VALIDAR DUPLICADOS

		const allTitles = document.querySelectorAll(".task-content h3");

		for (let title of allTitles) {

			if (
				title.textContent.toLowerCase() === newTitle.toLowerCase()
				&& title.textContent !== currentTitle
			) {

				alert("Ya existe una tarea con este titulo");

				return;
			}
		}

		// NUEVOS ELEMENTOS

		const newH3 = document.createElement("h3");

		newH3.textContent = newTitle;

		const newP = document.createElement("p");

		newP.textContent = newDescription;

		// REEMPLAZAR

		titleInput.replaceWith(newH3);

		descriptionInput.replaceWith(newP);

		restoreButtons(taskId, newH3, newP, actionContainer);
	});

	// BOTON CANCELAR

	const cancelButton = document.createElement("button");

	cancelButton.textContent = "❌Cancelar";

	cancelButton.classList.add("cancel-btn");

	cancelButton.addEventListener("click", () => {

		const originalH3 = document.createElement("h3");

		originalH3.textContent = currentTitle;

		const originalP = document.createElement("p");

		originalP.textContent = currentDescription;

		titleInput.replaceWith(originalH3);

		descriptionInput.replaceWith(originalP);

		restoreButtons(taskId, originalH3, originalP, actionContainer);
	});

	// AGREGAR BOTONES

	actionContainer.appendChild(saveButton);

	actionContainer.appendChild(cancelButton);
}

function restoreButtons(taskId, titleElement, descriptionElement, actionContainer) {

	actionContainer.innerHTML = "";

	// BOTON EDITAR

	const editButton = document.createElement("button");

	editButton.textContent = "🖋️Editar";

	editButton.classList.add("edit-btn");

	editButton.addEventListener("click", () => {

		enableEditMode(
			taskId,
			titleElement,
			descriptionElement,
			actionContainer
		);
	});

	// BOTON ELIMINAR

	const deleteButton = document.createElement("button");

	deleteButton.textContent = "🗑️Eliminar";

	deleteButton.classList.add("delete-btn");

	deleteButton.addEventListener("click", () => {

		deleteTaskElement(taskId);
	});

	actionContainer.appendChild(editButton);

	actionContainer.appendChild(deleteButton);
}

