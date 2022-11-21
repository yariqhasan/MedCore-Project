let status = document.getElementById("status")
let chatbox = document.getElementById("main-box")
let id = Math.floor(Math.random() * 1000 + 1)
let ul = document.getElementById("conversation")
let chat = document.getElementById("chat-container")
let input = document.getElementById("chat-input")
let fab = document.getElementById("fab")
let fab_close = document.getElementById("fab-close")

const url = "127.0.0.1:8000/index"

input.addEventListener("keyup", function (event) {
  event.preventDefault()
  if (event.keyCode === 13) {
    document.getElementById("btn").click()
  }
})

function openchat() {
  chatbox.style.display = "block"
  fab.style.display = "none"
  fab_close.style.display = "block"
}

function closechat() {
  chatbox.style.display = "none"
  fab_close.style.display = "none"
  fab.style.display = "block"
}

function start(msg) {
  createSender(msg)
  document.getElementById("typing").style.display = "inline"
  respond(msg)
}

function speak(msg) {
  var speech = new SpeechSynthesisUtterance(msg)
  speech.voice = speechSynthesis.getVoices()[5]
  window.speechSynthesis.speak(speech)
}

function createSender(msg) {
  let li = document.createElement("li")
  li.appendChild(document.createTextNode(msg))
  li.className = "sender"
  ul.appendChild(li)
  document.getElementById("chat-input").value = ""
  chat.scrollTop = chat.scrollHeight
}

function createResponder(msg) {
  let li = document.createElement("li")
  li.innerHTML = msg
  if (voice() == true) speak(li.innerText)
  li.className = "responder"
  ul.appendChild(li)
  chat.scrollTop = chat.scrollHeight
}

function send() {
  let message = document.getElementById("chat-input").value
  if (message != "") {
    createSender(message)
    document.getElementById("typing").style.display = "inline"
    respond(message)
  }
}

function respond(msg) {
  data = {
    query: msg,
  }
  if (msg.includes("billing")) {
    document.getElementById("typing").style.display = "none"
    createResponder(
      ' View the billing page after logging in here: <a href="/PatientLogin"> Login Page </a>'
    )
  } else if (msg.includes("appointment")){
    document.getElementById("typing").style.display = "none"
    createResponder(
      ' You can make the appointment on our home page at the appointment section'
    )
  }
    else if (msg.includes("bill")){
    document.getElementById("typing").style.display = "none"
    createResponder(
      ' View the billing page after logging in here: <a href="/PatientLogin"> Login Page </a>'
    )
  }
  else if (msg.includes("how to check my appointment")){
    document.getElementById("typing").style.display = "none"
    createResponder(
      ' You can check you appointment on your profile account once you login and locate to the appointment section.'
    )
  }
  else if (msg.includes("Speak to a associate")){
    document.getElementById("typing").style.display = "none"
    createResponder(
      ' You can speak to an associate on the help section on located on your profile.'
    )
  }
  else if (msg.includes("how are you")){
    document.getElementById("typing").style.display = "none"
    createResponder(
      ' Im doing great, at your service.'
    )
  }
  else if (msg.includes("Didn't recieve my medical report")){
    document.getElementById("typing").style.display = "none"
    createResponder(
      ' You can speak to an associate to help you with the issue on help section on located on your profile.'
    )
  }
  
  else {
    document.getElementById("typing").style.display = "none"
    createResponder(
      'Sorry, I\'m unable to process this request. If you\'d like to speak with an admin, go to this page: N/A '
    )
  }
  
}

function voice() {
  let speaker = document.getElementById("voice").checked
  if (speaker == true) return true
  else return false
}

function listen() {
  let mic = document.getElementById("mic")
  mic.style.color = "red"
  mic.className = "animated pulse infinite"
  let hear = new webkitSpeechRecognition()
  hear.continuous = false
  hear.lang = "en-IN"
  hear.start()

  hear.onresult = function (e) {
    mic.style.color = "black"
    mic.className = ""
    userVoiceText = e.results[0][0].transcript
    hear.stop()
    createSender(userVoiceText)
    respond(userVoiceText)
  }
}
