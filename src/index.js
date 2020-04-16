const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
// bad-words is used to filter bad words

const { generateMessage, generateLocation } = require('./utils/messages')
const { addUser, removedUser, getUser, getUsersInRoom } = require('./utils/users')

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

    // options = { username, room}
    socket.on('join', (options, callback) => {

        console.log("options", options)

        const { error, user } = addUser({ id: socket.id, ...options})

        if(error){
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('msg', generateMessage('Admin', `Welcome..!!`))

        // broadcast will emit  message to all the other clients, except itself
        socket.broadcast.to(user.room).emit('msg', generateMessage('Admin', `${user.username} joined the room`))

        io.to(user.room).emit('roomdata', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
    })

    socket.on('sendMessage', (msg, callback)=>{
        const user = getUser(socket.id)
        const filter = new Filter()

        if(filter.isProfane(msg)){
            return callback('Profanity is not allowed')
        }
        
        io.to(user.room).emit('msg', generateMessage(user.username, msg))

        // callback message helps to send a acknowledgement
        callback('Delivered')
    })

    // disconnect runs when the user is disconnected
    socket.on('disconnect', ()=>{
        const user = removedUser(socket.id)

        if(user){
            io.to(user.room).emit('msg', generateMessage('Admin', `${user.username} has left the chat`))

            io.to(user.room).emit('roomdata', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }        
    })

    socket.on('sendLocation', (coords, callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocation(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback('Location Shared')
    })
})

server.listen(port, ()=>{
    console.log(`listening to port ${port}`)
})