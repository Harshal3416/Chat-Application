const socket = io()

// event emitted with a key 'countUpdate' and variable 'count'
// socket.on('countUpdate', (count)=> console.log(`count=${count}`))

// emit the 'increament' event to increase the count in the server (index.js)
// document.querySelector('#inc').addEventListener('click', ()=>  socket.emit('increament'))

socket.on('msg', (msg)=> console.log(msg))


document.querySelector('#msg-form').addEventListener('submit', (e)=> {
    e.preventDefault()

    const message = e.target.elements.message.value
 
    socket.emit('textMsg', message, (error)=>{
        // error is an ack message from server

        if(error){
            return console.log(error)
        }

        console.log('This message was delivered..!')
    })
})

document.querySelector('#sendLocation').addEventListener('click', ()=>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }

    console.log('location')
    navigator.geolocation.getCurrentPosition((position)=>{

        // console.log()
        socket.emit('sendLocation', {
            latitude : position.coords.latitude,
            longitude :  position.coords.longitude
        }, (message) =>{
            console.log(message)
        })
    })
    
})