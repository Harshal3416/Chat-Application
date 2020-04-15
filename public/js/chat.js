const socket = io()

// event emitted with a key 'countUpdate' and variable 'count'
// socket.on('countUpdate', (count)=> console.log(`count=${count}`))

// emit the 'increament' event to increase the count in the server (index.js)
// document.querySelector('#inc').addEventListener('click', ()=>  socket.emit('increament'))



// Elements
const $mesageForm = document.querySelector('#msg-form')
const $mesageFormInput = $mesageForm.querySelector('input')
const $mesageFormButton = $mesageForm.querySelector('button')

const $location = document.querySelector('#sendLocation')

const $messages = document.querySelector('#messages')

// Templates
const mesageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

socket.on('msg', (msg)=> {
    console.log(msg)
    // Mustach helps us to user variables in HTML in the form of string interpolation
    const html = Mustache.render(mesageTemplate, {
        msg: msg.text,
        creeatedAt: moment(msg.creeatedAt).format("MMM Do YY, h:mm:ss a")
    })
    // https://momentjs.com/ --> moment library

    // insert ihe content of 'html' in $messages element
    $messages.insertAdjacentHTML('beforeend', html)
})


$mesageForm.addEventListener('submit', (e)=> {
    e.preventDefault()

    $mesageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value
 
    socket.emit('textMsg', message, (error)=>{

        $mesageFormButton.removeAttribute('disabled')
        $mesageFormInput.value = ''
        $mesageFormInput.focus()

        // error is an ack message from server
        if(error) return console.log(error)
        
        console.log('This message was delivered..!')
    })
})

socket.on('locationMessage', (msg)=>{
    console.log('URL', msg.url)
    const html = Mustache.render(locationTemplate, {
        url: msg.url,
        creeatedAt: moment(msg.creeatedAt).format("MMM Do YY, h:mm:ss a")
     })
    $messages.insertAdjacentHTML('beforeend', html)
})

$location.addEventListener('click', ()=>{

    $location.setAttribute('disabled', 'disabled')

    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }

    console.log('location')
    navigator.geolocation.getCurrentPosition((position)=>{

        socket.emit('sendLocation', {
            latitude : position.coords.latitude,
            longitude :  position.coords.longitude
        }, (message) =>{
            $location.removeAttribute('disabled')
            console.log(message)
        })
    })
    
})