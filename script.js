const inputAddToDo = document.getElementById('addToDo')
const buttonSubmit = document.getElementById('addToDoSubmit')
const toDoList = JSON.parse(localStorage.getItem("toDoList"))
const toDoContainer = document.getElementById('todos-list')

// Функция для добавления to do элемента
function addToDoElement(toDo, i) {
  const block = document.createElement("div");
  const p = document.createElement("p")
  p.innerText = toDo.content
  const check = document.createElement("input")
  check.setAttribute("type", "checkbox")
  check.checked = toDo.done
  const span = document.createElement("span")
  span.innerText = (i + 1)
  const button = document.createElement("button")
  button.innerText = "Удалить"
  block.className = "toDoWrapper"
  block.append(span, p, check, button)
  toDoContainer.appendChild(block)
}

if (toDoList) {
  toDoList?.map((toDo, i) => {
    addToDoElement(toDo, i)
  })
} else {
  const block = document.createElement("div");
  block.id = "emptyMessage"
  const p = document.createElement("p")
  p.innerText = "У вас нет запланированных дел, добавьте их"
  block.appendChild(p)
  toDoContainer.appendChild(block)
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
        const newToDo = { id: len + 1, content: newToDoValue, done: false }
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
      const newToDo = { id: 1, content: newToDoValue, done: false }
      localStorage.setItem("toDoList", JSON.stringify([newToDo]))
      addToDoElement(newToDo, 0)
    }
    inputAddToDo.value = ""
  } else {
    alert('упс, похоже вы забыли добавить вашу задачу')
  }
}

buttonSubmit.addEventListener('click', addToDo)