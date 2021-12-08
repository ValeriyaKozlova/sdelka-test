const inputAddToDo = document.getElementById('addToDo')
const buttonSubmit = document.getElementById('addToDoSubmit')
const toDoList = JSON.parse(localStorage.getItem("toDoList"))
const toDoContainer = document.getElementById('todos-list')
const checkInputs = toDoContainer.getElementsByTagName("input")
const btnRemoveAllContainer = document.getElementById("btn-remove")
const filter = document.getElementById('todo-filter')
const progressBar = document.getElementById('progressBar')
const progressMessage = document.getElementById('progressMessage')
const bar = document.getElementById('bar')
const buttonDeleteAll = document.getElementById("buttonDeleteAll")
const buttonCheckAll = document.getElementById("buttonCheckAll")
const btnContainer = document.getElementById("btn-container")

// First check if there are some tods in the local storage
if (toDoList) {
  toDoList?.map((toDo, i) => {
    addToDoElement(toDo, i)
  })
  btnContainer.classList.remove("d-none")
  setProgressBar()
  checkUnDoneTodo()
} else {
  createEmptyMessage()
}

// Add new todo 
buttonSubmit.addEventListener('click', e => addToDo(e))

// Generate unique id for new todo
function generateId() {
  return new Date().getTime()
}

function addToDo(e) {
  e.preventDefault()
  const toDoList = JSON.parse(localStorage.getItem("toDoList"))
  const newToDoValue = inputAddToDo.value.replace(/\s+/g, ' ').trim()
  if (newToDoValue !== "") {
    // Check if there is the same todo in the list
    let isRepeat = false
    if (toDoList) {
      for (let i = 0; i < toDoList.length; i++) {
        if (toDoList[i].content === newToDoValue) {
          isRepeat = true
          break
        }
      }
      // Add new todo
      if (!isRepeat) {
        const len = toDoList.length
        const newToDo = { _id: generateId(), content: newToDoValue, done: false }
        toDoList.push(newToDo)
        localStorage.setItem("toDoList", JSON.stringify(toDoList))
        addToDoElement(newToDo, len)
        setProgressBar()
        checkUnDoneTodo()
      } else {
        alert('Такая задача уже есть в вашем списке')
      }
    } else {
      // Delete message 
      const emptyMessage = document.getElementById('emptyMessage')
      if (emptyMessage) {
        emptyMessage.remove()
      }
      const newToDo = { _id: generateId(), content: newToDoValue, done: false }
      localStorage.setItem("toDoList", JSON.stringify([newToDo]))
      addToDoElement(newToDo, 0)
      btnContainer.classList.remove("d-none")
      setProgressBar()

    }
    inputAddToDo.value = ""
  } else {
    alert('упс, похоже вы забыли добавить вашу задачу')
  }
}

// Add a new HTML todo element
function addToDoElement(toDo, i) {
  const block = document.createElement("li");
  block.id = toDo._id
  block.setAttribute("draggable", true)
  const input = document.createElement("input")
  input.setAttribute("type", "text")
  input.value = toDo.content
  const check = document.createElement("input")
  const label = document.createElement("label")
  check.setAttribute("type", "checkbox")
  label.append(check)
  const button = document.createElement("button")
  button.style.backgroundImage = "url(./src/img/add.svg)"
  button.style.backgroundRepeat = "no-repeat"
  button.style.backgroundPosition = "center center"
  block.className = "toDoWrapper"
  block.classList.add(toDo.done ? "done" : "undone")
  block.append(label, input, button)
  toDoContainer.appendChild(block)
}


// Progression bar
// Calculate progression bar width
function setProgressionWidth() {
  const toDoList = JSON.parse(localStorage.getItem("toDoList"))
  const len = toDoList.length
  let done = 0
  let unDone = 0
  toDoList.forEach(toDo => {
    return toDo.done ? (done = done + 1) : (unDone = unDone + 1)
  }
  )
  const barWidth = (100 / len * done).toFixed(2)
  return { barWidth, done, len }
}
// Set progression bar
function setProgressBar() {
  if (bar.classList.contains('d-none')) {
    bar.classList.remove('d-none')
    progressMessage.classList.remove('d-none')
  }
  const { barWidth, done, len } = setProgressionWidth()
  progressMessage.innerText = `Вы выполнили ${done} из ${len} задач`
  bar.style.width = `${barWidth}%`
}

// Filter todos: all - done - undone
filter.addEventListener('change', e => filterTodo(e.target.value))

function filterTodo(value) {
  ("filter")
  const toDoList = JSON.parse(localStorage.getItem("toDoList"))
  if (toDoList) {
    let updToDos = []
    switch (value) {
      case "done":
        updToDos = toDoList.filter(toDo => toDo.done === true)
        break
      case "notDone":
        updToDos = toDoList.filter(toDo => toDo.done !== true)
        break
      default:
        updToDos = toDoList
    }
    const activeToDoList = Array.from(toDoContainer.querySelectorAll("li"))
    for (let i = 0; i < activeToDoList.length; i++) {
      activeToDoList[i].remove()
    }

    if (updToDos.length) {
      document.getElementById("noTasksMessage")?.remove()
      updToDos.map((toDo, i) => {
        addToDoElement(toDo, i)
      })
      if (btnContainer.classList.contains("d-none")) {
        btnContainer.classList.remove("d-none")
      }
    } else {
      const type = value === "done" ? "выполненных" : "невыполненных"
      const p = document.createElement("p")
      p.setAttribute("id", "noTasksMessage")
      p.innerText = `У вас нет ${type} задач`
      toDoContainer.append(p)
      btnContainer.classList.add("d-none")
    }
  }
}

// Add message element if there is no any todos
function createEmptyMessage() {
  const block = document.createElement("div");
  block.id = "emptyMessage"
  const p = document.createElement("p")
  p.innerText = "У вас нет запланированных дел, добавьте их"
  block.appendChild(p)
  toDoContainer.appendChild(block)
}

// TODO INTERACTION FUNCTIONS
// Event listener on the parent element
toDoContainer.addEventListener('click', function (e) {
  const nodeName = e.target.nodeName
  const parent = e.target.closest("li")
  switch (nodeName) {
    case "LABEL":
      changeStatusDone(parent.id, e.target.className)
      break
    case "BUTTON":
      deleteToDo(parent.id)
      break
    case "INPUT":
      if (e.target.type === "text") {
        editToDo(parent.id, e.target)
      }
      break
  }
})

// Toggle done - undone status
function changeStatusDone(id) {
  const toDoList = JSON.parse(localStorage.getItem("toDoList"))
  const parent = document.getElementById(id)
  const updToDos = toDoList.map(toDo => {
    return toDo._id == id ?
      ({ ...toDo, done: !toDo.done }) :
      toDo
  })
  const c = (parent.classList.contains("done") ? "toDoWrapper undone" : "toDoWrapper done")
  parent.className = c
  localStorage.setItem("toDoList", JSON.stringify(updToDos))
  setProgressBar()
  checkUnDoneTodo()
  if (filter.value !== "all") {
    filterTodo(filter.value)
  }

}

// Delete one selected todo
function deleteToDo(id) {
  const toDoList = JSON.parse(localStorage.getItem("toDoList"))
  const updToDos = toDoList.filter(toDo => toDo._id != id)
  const deletedToDo = document.getElementById(id)
  deletedToDo?.remove()
  if (updToDos.length !== 0) {
    localStorage.setItem("toDoList", JSON.stringify(updToDos))
    setProgressBar()
  } else {
    btnContainer.classList.add("d-none")
    createEmptyMessage()
    localStorage.clear()
    bar.classList.add('d-none')
    progressMessage.classList.add('d-none')
  }
}

// Edit todo
function editToDo(id, el) {
  el.addEventListener('keyup', function () {
    const toDoList = JSON.parse(localStorage.getItem("toDoList"))
    const updToDos = toDoList.map(toDo => {
      return toDo._id == id ? { ...toDo, content: el.value } : toDo
    })
    localStorage.setItem("toDoList", JSON.stringify(updToDos))
  })
}

// Delete all todos
buttonDeleteAll.addEventListener('click', deleteAllToDo)
function deleteAllToDo() {
  const toDoList = Array.from(toDoContainer.querySelectorAll("li"))
  for (let i = 0; i < toDoList.length; i++) {
    setTimeout(function () {
      toDoList[i].style.opacity = "0"
      toDoList[i].remove()
    }, i * 100)
  }
  localStorage.clear()
  btnContainer.classList.add("d-none")
  bar.classList.add('d-none')
  progressMessage.classList.add('d-none')
  createEmptyMessage()
}

// Check all todos
buttonCheckAll.addEventListener('click', checkAllToDo)
function checkAllToDo() {
  const toDoList = Array.from(toDoContainer.querySelectorAll("li"))
  const toDoListLocal = JSON.parse(localStorage.getItem("toDoList"))
  let updToDos = []
  for (let i = 0; i < toDoList.length; i++) {
    toDoList[i].className = "toDoWrapper done"
    updToDos.push({ ...toDoListLocal[i], done: true })
  }
  localStorage.setItem("toDoList", JSON.stringify(updToDos))
  buttonCheckAll.setAttribute("disabled", "disabled")
  setProgressBar()
}

// Check if there is un done todos 
function checkUnDoneTodo() {
  const toDoList = JSON.parse(localStorage.getItem("toDoList"))
  let undone = 0
  toDoList.forEach(toDo => {
    if (!toDo.done) undone = undone + 1
  })
  if (!undone) {
    buttonCheckAll.setAttribute("disabled", "disabled")
  } else {
    buttonCheckAll.removeAttribute("disabled")
  }
}
// Drag & drop  functions
toDoContainer.addEventListener("dragstart", (e) => {
  e.target.classList.add("selected")
})

toDoContainer.addEventListener("dragend", (e) => {
  e.target.classList.remove("selected")
  const toDoList = Array.from(toDoContainer.querySelectorAll("li"))
  const toDoListlocal = JSON.parse(localStorage.getItem("toDoList"))
  let updToDos = []
  for (let i = 0; i < toDoList.length; i++) {
    toDoListlocal.forEach(toDo => {
      if (toDo._id == toDoList[i].id) {
        updToDos.push(toDo)
      }
    })
  }
  localStorage.setItem("toDoList", JSON.stringify(updToDos))
})

toDoContainer.addEventListener("dragover", (e) => {
  e.preventDefault()
  const activeEl = toDoContainer.querySelector(".selected");
  const currentEl = e.target;
  const isMoveable = activeEl !== currentEl && currentEl.classList.contains('toDoWrapper')
  if (!isMoveable) {
    return
  }

  const nextEl = getNextElement(e.clientY, currentEl)
  if (nextEl && activeEl === nextEl.previosElementSibling || activeEl === nextEl) {
    return
  }
  toDoContainer.insertBefore(activeEl, nextEl)
})

const getNextElement = (cursorPosition, currentEl) => {
  const currentElCoord = currentEl.getBoundingClientRect();
  const currentElCenter = currentElCoord.y + currentElCoord.height / 2
  const nextEl = (cursorPosition < currentElCenter) ? currentEl : currentEl.nextElementSibling;
  return nextEl
}