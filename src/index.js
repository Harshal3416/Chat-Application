const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
// bad-words is used to filter bad words

const { generateMessage, generateLocation } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

// Windows does paths with backslashes where Unix does paths with forward slashes. 
// node.js provides path.join() to always use the correct slash.
// here __dirname is E:\chat-app\src
const publicDirectoryPath = path.join(__dirname, '../public')

// To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express.
app.use(express.static(publicDirectoryPath))

// 'connection' runs when the user is connected
io.on('connection', (socket)=>{
    console.log('new socket connection')

    socket.emit('msg', generateMessage('Welcome..!!'))

    // socket.emit('countUpdate', count)

    // socket.on('increament', ()=>{
    //     count++

    //     // socket.emit will emit data for a particular client
    //     // emits data to all the connection(client)
    //     io.emit('countUpdate', count)
    // })

    // broadcast will emit  message to all the other clients, except itself
    socket.broadcast.emit('msg', generateMessage('New User..!!'))

    socket.on('textMsg', (msg, callback)=>{

        const filter = new Filter()

        if(filter.isProfane(msg)){
            return callback('Profanity is not allowed')
        }
        
        io.emit('msg', generateMessage(msg))

        // callback message helps to send a acknowledgement
        callback('Delivered')
    })

    // disconnect runs when the user is disconnected
    socket.on('disconnect', ()=>{
        io.emit('msg', generateMessage('User left the group'))
    })

    socket.on('sendLocation', (coords, callback)=>{
        io.emit('locationMessage', generateLocation(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback('Location Shared')
    })
})

server.listen(port, ()=>{
    console.log(`listening to port ${port}`)
})