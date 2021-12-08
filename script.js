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

function setProgressBar() {
  if (progressBar.classList.contains('d-none')) {
    progressBar.classList.remove('d-none')
  }
  const { barWidth, done, len } = setProgressionWidth()
  progressMessage.innerText = `Вы выполнили ${done} из ${len} задач`
  bar.style.width = `${barWidth}%`
}

filter.addEventListener('change', function (e) {
  const toDoList = JSON.parse(localStorage.getItem("toDoList"))
  if (toDoList) {
    let updToDos = []
    switch (e.target.value) {
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
    console.log(updToDos)
    if (updToDos.length !== 0) {
      document.getElementById("noTasksMessage")?.remove()
      updToDos.map((toDo, i) => {
        addToDoElement(toDo, i)
      })
    } else {
      const type = e.target.value === "done" ? "выполненных" : "невыполненных"
      const p = document.createElement("p")
      p.setAttribute("id", "noTasksMessage")
      p.innerText = `У вас нет ${type} задач`
      toDoContainer.append(p)
    }
  }
})
// Функция для добавления to do элемента
function addToDoElement(toDo, i) {
  const block = document.createElement("li");
  block.id = toDo._id
  block.setAttribute("draggable", true)
  const p = document.createElement("p")
  p.innerText = toDo.content
  const check = document.createElement("input")
  check.setAttribute("type", "checkbox")
  check.checked = toDo.done
  const span = document.createElement("span")
  span.innerText = (i + 1)
  const img = document.createElement("img")
  img.setAttribute("src", "./src/img/edit.png")
  const button = document.createElement("button")
  button.innerText = "Удалить"
  block.className = "toDoWrapper"
  block.append(span, p, check, img, button)
  toDoContainer.appendChild(block)
}

function createEmptyMessage() {
  const block = document.createElement("div");
  block.id = "emptyMessage"
  const p = document.createElement("p")
  p.innerText = "У вас нет запланированных дел, добавьте их"
  block.appendChild(p)
  toDoContainer.appendChild(block)
}

function createButtonDeleteAll() {
  const button = document.createElement("button")
  button.setAttribute("type", "submit")
  button.setAttribute("id", "deleteAllButton")
  button.innerText = "Удалить все"
  button.addEventListener('click', deleteAllToDo)
  btnRemoveAllContainer.append(button)
}

if (toDoList) {
  toDoList?.map((toDo, i) => {
    addToDoElement(toDo, i)
  })
  createButtonDeleteAll()
  setProgressBar()
} else {
  createEmptyMessage()
}

function generateId() {
  return new Date().getTime()
}

function addToDo(e) {
  e.preventDefault()
  const toDoList = JSON.parse(localStorage.getItem("toDoList"))
  const newToDoValue = inputAddToDo.value.replace(/\s+/g, ' ').trim()
  if (newToDoValue !== "") {
    // Проверка на повтор to do
    let isRepeat = false
    if (toDoList) {
      for (let i = 0; i < toDoList.length; i++) {
        if (toDoList[i].content === newToDoValue) {
          isRepeat = true
          break
        }
      }
      // Добавление to do
      if (!isRepeat) {
        const len = toDoList.length
        const newToDo = { _id: generateId(), content: newToDoValue, done: false }
        toDoList.push(newToDo)
        localStorage.setItem("toDoList", JSON.stringify(toDoList))
        addToDoElement(newToDo, len)
        setProgressBar()
      } else {
        alert('Такая задача уже есть в вашем списке')
      }
    } else {
      // Удаляем сообщение об отсутствии to dos
      const emptyMessage = document.getElementById('emptyMessage')
      if (emptyMessage) {
        emptyMessage.remove()
      }
      const newToDo = { _id: generateId(), content: newToDoValue, done: false }
      localStorage.setItem("toDoList", JSON.stringify([newToDo]))
      addToDoElement(newToDo, 0)
      createButtonDeleteAll()
      setProgressBar()
    }
    inputAddToDo.value = ""
  } else {
    alert('упс, похоже вы забыли добавить вашу задачу')
  }
}

buttonSubmit.addEventListener('click', e => addToDo(e))

function changeStatusDone(id) {
  const toDoList = JSON.parse(localStorage.getItem("toDoList"))
  const updToDos = toDoList.map(toDo => {
    return toDo._id == id ? { ...toDo, done: !toDo.done } : toDo
  })
  localStorage.setItem("toDoList", JSON.stringify(updToDos))
  setProgressBar()
}

function deleteToDo(id) {
  const toDoList = JSON.parse(localStorage.getItem("toDoList"))
  const updToDos = toDoList.filter(toDo => toDo._id != id)
  const deletedToDo = document.getElementById(id)
  deletedToDo?.remove()
  if (updToDos.length !== 0) {
    localStorage.setItem("toDoList", JSON.stringify(updToDos))
    setProgressBar()
  } else {
    document.getElementById("deleteAllButton").remove()
    createEmptyMessage()
    localStorage.clear()
    progressBar.classList.add('d-none')
  }
}

function openEditingWindow(id, el) {
  el.className = "editing"
  const parent = document.getElementById(id)
  const p = parent.querySelector("p")
  const input = document.createElement("input")
  input.setAttribute("type", "text")
  input.setAttribute("value", p.innerText)
  parent.replaceChild(input, p)
}

function closeEditingWindow(id, el) {
  el.classList.remove("editing")
  const parent = document.getElementById(id)
  const input = parent.querySelector("input")
  const p = document.createElement("p")
  p.innerText = input.value
  const toDoList = JSON.parse(localStorage.getItem("toDoList"))
  const updToDos = toDoList.map(toDo => {
    return toDo._id == id ? { ...toDo, content: input.value } : toDo
  })
  localStorage.setItem("toDoList", JSON.stringify(updToDos))
  parent.replaceChild(p, input)
}

function deleteAllToDo() {
  const toDoList = Array.from(toDoContainer.querySelectorAll("li"))
  for (let i = 0; i < toDoList.length; i++) {
    setTimeout(function () {
      toDoList[i].remove()
    }, i * 100)
  }
  localStorage.clear()
  document.getElementById("deleteAllButton").remove()
  progressBar.classList.add('d-none')
  createEmptyMessage()
}

toDoContainer.addEventListener('click', function (e) {
  const nodeName = e.target.nodeName
  const parent = e.target.closest("li")
  switch (nodeName) {
    case "INPUT":
      if (e.target.type === "checkbox") {
        changeStatusDone(parent.id)
      }
      break
    case "BUTTON":
      deleteToDo(parent.id)
      break
    case "IMG":
      if (e.target.className === "editing") {
        closeEditingWindow(parent.id, e.target)
      } else {
        openEditingWindow(parent.id, e.target)
      }
      break
  }
})


toDoContainer.addEventListener("dragstart", (e) => {
  e.target.classList.add("selected")
})

toDoContainer.addEventListener("dragend", (e) => {
  e.target.classList.remove("selected")
  const toDoList = Array.from(toDoContainer.querySelectorAll("li"))
  const toDoListlocal = JSON.parse(localStorage.getItem("toDoList"))
  let updToDos = []
  for (let i = 0; i < toDoList.length; i++) {
    toDoList[i].querySelector('span').innerText = i + 1
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