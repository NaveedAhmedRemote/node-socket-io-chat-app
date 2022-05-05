const path = require('path')
const http = require('http');
const express = require('express')
const socketio = require('socket.io')
const Fitler = require('bad-words')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')
const {generateMessage,generateLocationMessage} = require('./utils/messages')
const {addUser,removeUser,getUsersInRoom,getUser} = require('./utils/users')
// Server (emit) -> client (recevie) -- countUpdated
// client (emit) -> Server (recevie) -- Increment

app.use(express.static(publicDirectoryPath))
let count = 0
io.on('connection',(socket)=>{
    console.log("___connection__",count++)
   

    socket.on('join',(options,callBack)=>{
       
     const {error,user} = addUser({id:socket.id,...options})
        
     console.log(error)
     if(error){
             return callBack(error)
        }

        
        socket.join(user.room)
    // io.emit Send Message To Every Connected Client
    // socket.broadcast.emit Send Message To every Connected Client Except This
    // io.to.emit Event To Everybody in a specific Room Variation Of io.Emit
    // socket.broadcast.to.emit vairation of scoketboradcast
    socket.emit('message',generateMessage('Admin','Welcome!!'))
    socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username} Has Joined!!`))
    io.to(user.room).emit('roomData',{
        room:user.room,
        users:getUsersInRoom(user.room)
    })

        callBack()
})
    socket.on('sendMessage',(message,callBack)=>{
        const user = getUser(socket.id)
       const filter = new Fitler();
       if(filter.isProfane(message)){
           return callBack('Dont Use Bad Word')
       }          
        io.to(user.room).emit('message',  generateMessage(user.username,message)) //Emit Message For Every Single Connected Client
        callBack()
    })
    socket.on('sendLocation',(location,callBack)=>{
        // CalBack Sending acknowledgeMent to the user
        const user = getUser(socket.id)

        io.to(user.room).emit('locationSendMessage',
        generateLocationMessage(user.username,`https://google.com/maps?q=${location.latitude},${location.longitude}`)        )
        callBack('LocationShared')
        })

// Broad Cast Mesasge WhenEver Any User Joined the chat
    // socket.broadcast.emit('message',generateMessage('A New User Has Joined'))
    socket.on('disconnect',()=>{
        // BrodCast To EveryOne
   const user= removeUser(socket.id)
   if(user){
       io.to(user.room).emit('message', generateMessage(`A ${user.username} Has Left`))
       io.to(user.room).emit('roomData',{
        room:user.room,
        users:getUsersInRoom(user.room)
    })
    
   }


    })
  
// Counter Increment And Decrement Start
    // socket.emit('countUpdated',count++)
    // socket.on('increment',(e)=>{
    //     console.log("________E__________",e)
    //     count++
    //     io.emit('countUpdated',count)
    // })
    // socket.on('decrement',()=>{
    //     count--
    //     io.emit('countUpdated',count)
    // })
// Counter Increment And Decrement End

})



server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})

