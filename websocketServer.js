'use-strict'

const WebSocket = require('ws')
const uuidv1 = require('uuid/v1');

const wsServer = new WebSocket.Server({ port: 3030 });

let indexOfClientsConnexion = 0
let _db_clientsConnection = []
// [
//     {
//         id: 'c5e83fe6-d769-4fb8-bf0f-6625a8e66d3d',
//         connection: connec{},
//     },
//     {
//         id: 'f0b39e4b-360d-4c94-999e-13ac4e890ba1',
//         connection: connec{},
//     },
// ]

let _db_users = []
// [
//     {
//         id: 'c5e83fe6-d769-4fb8-bf0f-6625a8e66d3d',
//         username: 'John',
//         email: 'johndoe@gmail.com'
//     },
//     {
//         id: 'f0b39e4b-360d-4c94-999e-13ac4e890ba1',
//         username: 'Samantha',
//         email: 'samanthaDel@outlook.com'
//     },
// ]

let _db_messages = []
// [
//     {
//         date: Date{},
//         author: 'username',
//         message: '',
//     },
//     {
//         date: Date{},
//         author: 'username',
//         message: '',
//     },
// ]

wsServer.on('connection', function (connec) {
    const uuid = uuidv1()
    const connection = {
        id: uuid,
        connection: connec
    }
    _db_clientsConnection.push(connection)

    const user = {
        type: 'user',
        id: uuid,
        username: 'invite' + indexOfClientsConnexion,
    }

    indexOfClientsConnexion++
    _db_users.push(user)
    
    connec.send(JSON.stringify(user))

    connec.on('message', function (data) {
        data = JSON.parse(data)

        switch (data.type) {

            case 'hello':
                console.log('New unknown client is connected')
            break

            case 'user':

                let user = _db_users.find(user => user.id === data.id)

                console.log(`Client ${user.username} is now identified has ${data.username}`)

                user.username = data.username
                user.email = data.email

                sendMessageToId(user.id, 'system', `Welecome ${user.username}, you\'re now connected. An advisor will answer your questions.`)
            break

            case 'message':
                const date = new Date()
                const author = getUserFromUserId(data.id).username
                console.log(`${date.getHours()}:${date.getMinutes()} - ${author} said : ${data.message}.`)
            break
        
            default:
                console.log(data)
            break
        }
    })
})

async function sendMessageToId(id, author, message) {
    await new Promise ((resolve, _) => {
        const connec = getConnectionFromId(id)

        const msgToSend = {
            type: 'message',
            author: author,
            message: message,
        }
        
        
        connec.send(JSON.stringify(msgToSend))
        resolve()
    })
}


function getConnectionFromId(id) {
    const connec = _db_clientsConnection.find(connection => connection.id === id)
    return connec.connection
}

function getUserFromUserId(id) {
    const user = _db_users.find(user => user.id === id)
    return user
}


// setTimeout(() => {
//     sendMessageToId(_db_users[0].id, 'Valley', 'Hello, I\'m Valley. I transfere your question to the french support')
// }, 5000);

// setTimeout(() => {
//     sendMessageToId(_db_users[0].id, 'Nadia', 'Bonjour, je suis Nadia. C\'est moi qui vais prendre en charge votre dossier.\nQue puis-je faire pour vous ?')
// }, 7000);

// setTimeout(() => {
//     sendMessageToId(_db_users[1].id, 'Valley', 'Hello, I\'m Valley. I transfere your question to the french support')
// }, 5000);

// setTimeout(() => {
//     sendMessageToId(_db_users[1].id, 'Nadia', 'Bonjour, je suis Nadia. C\'est moi qui vais prendre en charge votre dossier.\nQue puis-je faire pour vous ?')
// }, 7000);