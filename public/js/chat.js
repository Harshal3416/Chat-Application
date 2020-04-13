const socket = io()

// event emitted with a key 'countUpdate' and variable 'count'
// socket.on('countUpdate', (count)=> console.log(`count=${count}`))

// emit the 'increament' event to increase the count in the server (index.js)
// document.querySelector('#inc').addEventListener('click', ()=>  socket.emit('increament'))

socket.on('msg', (msg)=> console.log(msg))


document.querySelector('#msg-form').addEventListener('submit', (e)=> {
    e.preventDefault()

    const message = e.target.elements.message.value
 
    socket.emit('textMsg', message)
})