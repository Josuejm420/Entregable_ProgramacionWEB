function handleFormSubmit(event) {

	event.preventDefault();
	const formData = new FormData(event.target);
	const task = Object.fromEntries(formData);
	task.id = Date.now();
	const errorMessage = document.getElementById("error-message");
	errorMessage.textContent = "";

	// VALIDACIONES

	if (task.title.trim() === "") {
		errorMessage.textContent = "El Titulo no puede estar vacio";
		return;
	}

	if (task.title.trim().length < 4) {
		errorMessage.textContent = "El Titulo debe tener almenos 4 caracteres";
		return;
	}

	if (task.description.length > 150) {
		errorMessage.textContent = "La Descripcion no puede exeder los 150 caracteres";
		return;
	}

	// VALIDAR DUPLICADOS

	const titles = document.querySelectorAll(".task-content h3");

	for (let title of titles) {

		if (title.textContent.toLowerCase() === task.title.toLowerCase()) {

			errorMessage.textContent = "Ya Existe Una Tarea Con Este TiTulo";

			return;
		}
	}

	const taskElement = createTaskElement(task);
	const ulContainer = document.getElementById("task-list-container");
	ulContainer.appendChild(taskElement);
	event.target.reset();
}

function createTaskElement(task) {

	const divTaskContent = document.createElement("div");
	divTaskContent.classList.add("task-content");

	const h3Title = document.createElement("h3");
	h3Title.textContent = task.title;

	const pDescription = document.createElement("p");
	pDescription.textContent = task.description;

	divTaskContent.appendChild(h3Title);
	divTaskContent.appendChild(pDescription);

	// ACTIONS

	const divTaskAction = document.createElement("div");
	divTaskAction.classList.add("task-actions");

	// EDIT BUTTON

	const editButton = document.createElement("button");

	editButton.textContent = "Edit";
	editButton.classList.add("edit-btn");
	editButton.addEventListener("click", () => {

		enableEditMode(
			task.id,
			h3Title,
			pDescription,
			divTaskAction
		);
	});

	// DELETE BUTTON

	const deleteButton = document.createElement("button");

	deleteButton.textContent = "Delete";
	deleteButton.classList.add("delete-btn");
	deleteButton.addEventListener("click", () => deleteTaskElement(task.id));

	divTaskAction.appendChild(editButton);
	divTaskAction.appendChild(deleteButton);

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

	// INPUTS

	const titleInput = document.createElement("input");
	titleInput.value = currentTitle;

	const descriptionInput = document.createElement("textarea");
	descriptionInput.value = currentDescription;
	titleElement.replaceWith(titleInput);
	descriptionElement.replaceWith(descriptionInput);
	actionContainer.innerHTML = "";

	// SAVE BUTTON

	const saveButton = document.createElement("button");

	saveButton.textContent = "Save";

	saveButton.classList.add("save-btn");

	saveButton.addEventListener("click", () => {

		const newTitle = titleInput.value.trim();

		const newDescription = descriptionInput.value.trim();

		if (newTitle === "") {
			alert("El Titulo No Puede Estar Vacio");
			return;
		}

		if (newTitle.length < 4) {
			alert("El Titulo Debe Tener Al Menos 4 Caracteres");
			return;
		}

		if (newDescription.length > 150) {
			alert("Descripcion Tiene Un Maxiomo De 150  Caracteres");
			return;
		}

		// DUPLICADOS

		const allTitles = document.querySelectorAll(".task-content h3");

		for (let title of allTitles) {

			if (
				title.textContent.toLowerCase() === newTitle.toLowerCase()
				&& title.textContent !== currentTitle
			) {
				alert("Task title already exists");
				return;
			}
		}

		const newH3 = document.createElement("h3");
		newH3.textContent = newTitle;
		const newP = document.createElement("p");
		newP.textContent = newDescription;
		titleInput.replaceWith(newH3);
		descriptionInput.replaceWith(newP);
		restoreButtons(taskId, newH3, newP, actionContainer);
	});

	// CANCEL BUTTON

	const cancelButton = document.createElement("button");
	cancelButton.textContent = "Cancel";
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

	actionContainer.appendChild(saveButton);
	actionContainer.appendChild(cancelButton);
}

function restoreButtons(taskId, titleElement, descriptionElement, actionContainer) {

	actionContainer.innerHTML = "";

	// EDIT

	const editButton = document.createElement("button");

	editButton.textContent = "Edit";

	editButton.classList.add("edit-btn");

	editButton.addEventListener("click", () => {

		enableEditMode(
			taskId,
			titleElement,
			descriptionElement,
			actionContainer
		);
	});

	// DELETE

	const deleteButton = document.createElement("button");

	deleteButton.textContent = "Delete";

	deleteButton.classList.add("delete-btn");

	deleteButton.addEventListener("click", () => deleteTaskElement(taskId));

	actionContainer.appendChild(editButton);

	actionContainer.appendChild(deleteButton);
}