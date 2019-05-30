document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded')
})

function openChat() {
    document.getElementById('openChat').style.display = 'none'
    document.getElementById('connectionForm').style.display = 'block'
}

function connecToChat() {
    document.getElementById('connectionForm').style.display = 'none'
    
    const username = document.getElementById('connectionForm_username').value
    const email = document.getElementById('connectionForm_email').value

    setConnection(username, email)

    document.getElementById('chat').style.display = 'block'
}

function setConnection(username, email) {
    const objToSend = {
        type: 'user',
        id: user.id,
        username: username,
        email: email,
    }
    user.username = username
    user.email = email
    ws.send(JSON.stringify(objToSend))
}

function sendMessage() {
    const message = document.getElementById('chat_message').value
    const msgToSend = {
        type: 'message',
        id: user.id,
        message: message,
    }
    
    ws.send(JSON.stringify(msgToSend))
    msgToSend.author = user.username
    displayMessage(msgToSend)
}

function displayMessage(message) {
    const date = new Date()

    const messagesView = document.getElementById('chat_messages-history')
    const element = document.createElement('p')
    var text = document.createTextNode(`${date.getHours()}:${date.getMinutes()} - ${message.author} said : ${message.message}.`)

    element.appendChild(text)
    messagesView.appendChild(element)
}

const ws = new WebSocket('ws://localhost:3030')

let user = {
    id: '',
    username: '',
    email: '',
}

ws.onopen = function (event) {
    const objToSend = {
        type: 'hello'
    }

    ws.send(JSON.stringify(objToSend))
}


ws.onmessage = function (messageEvent) {
    data = JSON.parse(messageEvent.data)
    
    switch (data.type) {
        case 'user':
            user.id = data.id
            user.username = data.username
        break;
    
        case 'message':
            displayMessage(data)
        break

        default:
            console.log(data)
        break;
    }
}