import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
  databaseURL: "https://realtime-database-fa32a-default-rtdb.europe-west1.firebasedatabase.app/",
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const messagesInDB = ref(database, "messages")

const publishBtn = document.getElementById("publish-btn")
const endorsementEl = document.getElementById("endorsement-field")
const fromEl = document.getElementById("from-field")
const toEl = document.getElementById("to-field")
const endorsementsContainer = document.getElementById("endorsements")

publishBtn.addEventListener("click", () => {
  let endorsementValue = endorsementEl.value
  let fromValue = fromEl.value
  let toValue = toEl.value

  if ((endorsementValue, fromValue, toValue)) {
    push(messagesInDB, {
      message: endorsementValue,
      author: fromValue,
      to: toValue,
      isLiked: false,
      likes: 0,
    })
    clearInputs()
  } else {
    console.log("It is necessary to fill in all fields!")
  }
})

onValue(messagesInDB, (snapshot) => {
  if (snapshot.exists()) {
    let messagesArray = Object.entries(snapshot.val())
    clearInnerHTML()
    for (let message of messagesArray) {
      renderMessages(message[0], message[1])
      addLike(message[0], message[1])
    }
  } else {
    endorsementsContainer.innerHTML = `<p id="no-msg">No messages here... yet</p>`
  }
})

function clearInnerHTML() {
  endorsementsContainer.innerHTML = ""
}

function clearInputs() {
  endorsementEl.value = ""
  fromEl.value = ""
  toEl.value = ""
}

function addLike(id, item) {
  document.addEventListener("click", (e) => {
    if (e.target.dataset.like === id) {
      let exactLocation = ref(database, `messages/${id}`)
      update(exactLocation, { isLiked: !item.isLiked })
      if (item.isLiked) {
        update(exactLocation, { likes: item.likes - 1 })
      } else if (!item.isLiked) {
        update(exactLocation, { likes: item.likes + 1 })
      }
    }
  })
}

function renderMessages(id, item) {
  endorsementsContainer.innerHTML += `
        <div id="comment">
            <p id="to-content">To ${item.to}</p>
            <p id="comment-content">${item.message}</p>
            <p id="from-content">From ${item.author}</p>
            <i class="${item.isLiked ? "bx bxs-heart" : "bx bx-heart"}"
            data-like="${id}"></i> <p id="num-likes">${item.likes}</p>
        </div>
        `
}
