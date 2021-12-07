const inputAddToDo = document.getElementById('addToDo')
const buttonSubmit = document.getElementById('addToDoSubmit')
const toDoList = JSON.parse(localStorage.getItem("toDoList"))
const toDoContainer = document.getElementById('todos-list')
const checkInputs = toDoContainer.getElementsByTagName("input")

console.log(checkInputs)
// Функция для добавления to do элемента
function addToDoElement(toDo, i) {
  const block = document.createElement("div");
  block.id = toDo._id
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

if (toDoList) {
  toDoList?.map((toDo, i) => {
    addToDoElement(toDo, i)
  })
} else {
  p()
}

function generateId() {
  return new Date().getTime()
}

function addToDo() {
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
    }
    inputAddToDo.value = ""
  } else {
    alert('упс, похоже вы забыли добавить вашу задачу')
  }
}

buttonSubmit.addEventListener('click', addToDo)

function changeStatusDone(id) {
  const toDoList = JSON.parse(localStorage.getItem("toDoList"))
  const updToDos = toDoList.map(toDo => {
    return toDo._id == id ? { ...toDo, done: !toDo.done } : toDo
  })
  localStorage.setItem("toDoList", JSON.stringify(updToDos))
}

function deleteToDo(id) {
  const toDoList = JSON.parse(localStorage.getItem("toDoList"))
  const updToDos = toDoList.filter(toDo => toDo._id != id)
  const deletedToDo = document.getElementById(id)
  deletedToDo?.remove()
  if (updToDos.length !== 0) {
    localStorage.setItem("toDoList", JSON.stringify(updToDos))
  } else {
    localStorage.clear()
    createEmptyMessage()
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

toDoContainer.addEventListener('click', function (e) {
  const nodeName = e.target.nodeName
  const parent = e.target.closest("div")
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