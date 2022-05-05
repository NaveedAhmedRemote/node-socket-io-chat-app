const socket = io()

// Elements
const $messsageForm = document.querySelector('#message-form')
const $messsageFormInput = $messsageForm.querySelector('#input')
const $messsageFormButton = $messsageForm.querySelector('button')
const $locationButton =document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML



// Tepmplates
const messageTamplates = document.querySelector('#message-template').innerHTML
const locationTamplates = document.querySelector('#location-template').innerHTML
// AutoScroll

const autoScroll = ()=>{
    // New Message element
    const $newMessage = $messages.lastElementChild
    // Get Height of Last Message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
    // visible Height 
    const visibleHeight = $messages.offsetHeight

    // Height of Messages Container
    const containerHeight = $messages.scrollHeight

    // How Far have i Scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight
    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop =  $messages.scrollHeight
    }
}

// Options
 const {username,room} = Qs.parse(location.search,{
        ignoreQueryPrefix:true
    })
socket.emit('join',{username,room},(error)=>{
if(error){
alert(error)
location.href ='/'
}
})


// Global Welcome Message For All Client/Users
// socket.on('message',(msg)=>{
// console.log("_WELCOME BUDDY",msg.text)
// })

socket.on('locationSendMessage',(locUrl)=>{
const html = Mustache.render(locationTamplates,{
    locUrl:locUrl.url,
    username:locUrl.username
})
$messages.insertAdjacentHTML('beforeend',html)
autoScroll();
})

socket.on('roomData',({room,users})=>{
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML= html
})

// Listening For the Event Either User Has Joined Of left Chat
socket.on('message',(message,callBack)=>{
    console.log(message)
    console.log("___callBack",message)
    const html = Mustache.render(messageTamplates,{
        message:message.text,
        username:message.username,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
$messages.insertAdjacentHTML('beforeend',html)
autoScroll();
})


// send-location
$locationButton.addEventListener('click',()=>{
    if(!navigator.geolocation){
       return alert("Geolocation Is Not Supported")         
    }
    $locationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },(loc)=>{
            // Receivere the Acknowledgement From Server
            $locationButton.removeAttribute('disabled')
            console.log(loc)
        })
        //Sending Acknowledgement To the Server ()=>{}
    })
})

$messsageForm.addEventListener('submit',(e)=>{
e.preventDefault();
$messsageFormButton.setAttribute('disabled','disabled')
let userMsg =e.target.elements.message.value;
socket.emit('sendMessage',userMsg,(err)=>{
$messsageFormButton.removeAttribute('disabled')
$messsageFormInput.value=''
$messsageFormInput.focus()
        if(err){
            return  console.log(err)
        }
        console.log("Message Delivered")
    })
})



// Counter Increment And Decrement Start
// 
// socket.on('countUpdated',(count)=>{
//     console.log('The count has been updated',count)
// })

// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log("Button Clicked")
//     socket.emit('increment',44)
// })

// document.querySelector('#decrement').addEventListener('click',()=>{
// console.log("Button --- Clicked")
// socket.emit('decrement')

// })
// Counter Increment And Decrement End
