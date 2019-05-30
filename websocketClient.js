'use strict';

const WebSocket = require('ws')

const ws = new WebSocket('ws://localhost:3030')

let user = {
    id: '',
    username: '',
    email: '',
}

ws.on('open', function open() {
    const objToSend = {
        type: 'hello'
    }

    ws.send(JSON.stringify(objToSend))
})

ws.on('message', function incoming(data) {
    data = JSON.parse(data)
    
    switch (data.type) {
        case 'user':
            user.id = data.id
            user.username = data.username
        break;
    
        case 'message':
            const date = new Date()
            console.log(`${date.getHours()}:${date.getMinutes()} - ${data.author} said : ${data.message}.`)
        break

        default:
            console.log(data)
        break;
    }
})

setTimeout(() => {
    setConnection('Doe', 'johndoe@gmail.com')
}, 1000);

setTimeout(() => {
    sendMessage('Bonjour, je voudrais plus d\'informations sur *** s\'il vous plait')
}, 3000);

setTimeout(() => {
    sendMessage('OK merci')
}, 10000);

function sendMessage(message) {
    const msgToSend = {
        type: 'message',
        id: user.id,
        message: message,
    }
    
    ws.send(JSON.stringify(msgToSend))
}

function setConnection(username, email) {
    const objToSend = {
        type: 'user',
        id: user.id,
        username: username,
        email: email,
    }
    
    ws.send(JSON.stringify(objToSend))
}

