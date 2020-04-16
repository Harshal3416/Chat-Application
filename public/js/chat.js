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
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible Height
    const VisibleHeight = $messages.offsetHeight

    // Height of message container
    const containerHeight = $messages.scrollHeight

    // How far have i scrolled?
    const scrollOffset = $messages.scrollTop + VisibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('msg', (msg)=> {
    console.log(msg)
    // Mustach helps us to user variables in HTML in the form of string interpolation
    const html = Mustache.render(mesageTemplate, {
        username: msg.username,
        msg: msg.text,
        creeatedAt: moment(msg.creeatedAt).format("MMM Do YY, h:mm:ss a")
    })
    // https://momentjs.com/ --> moment library

    // insert ihe content of 'html' in $messages element
    $messages.insertAdjacentHTML('beforeend', html)

    autoscroll()
})


$mesageForm.addEventListener('submit', (e)=> {
    e.preventDefault()

    $mesageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value
 
    socket.emit('sendMessage', message, (error)=>{

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
        username: msg.username,
        url: msg.url,
        creeatedAt: moment(msg.creeatedAt).format("MMM Do YY, h:mm:ss a")
     })
    $messages.insertAdjacentHTML('beforeend', html)

    autoscroll()
})

socket.on('roomdata', ({ room, users }) => {
   const html = Mustache.render(sidebarTemplate, {
       room,
       users
   })
    document.querySelector('#sidebar').innerHTML = html
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

socket.emit('join', { username, room }, (error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})