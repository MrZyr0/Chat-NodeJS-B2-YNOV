'use-strict'

const Express = require('express')
const WebServer = Express()

const PORT = 8080


WebServer.set('view engine', 'pug')
WebServer.listen(PORT)

WebServer.get('/', function (req, res)
{
    res.render('index',
    {
        pageTitle : 'Chat',
    })
})

WebServer.get('/chat', function (req, res) {
    res.sendFile(__dirname + '/website/scripts/clientChat.js')
})

WebServer.get('/style', function (req, res) {
    res.sendFile(__dirname + '/website/styles/main.css')
})