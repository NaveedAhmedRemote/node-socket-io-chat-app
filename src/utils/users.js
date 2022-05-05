const users=[]

// AddUser removeUser getUser,getUserInRoom
const addUser =({id,username,room})=>{
    // Clean The Data
    username=username.trim().toLowerCase();
    room=room.trim().toLowerCase();


    // Validate the Data
    if(!username || !room){
        return {
            error:'Username And Room Are Required!'
        }
    }
    // Check for Existing User

    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    // Validate User
    if(existingUser){
        return{
            error:'UserName is already Use'
        }
    }
    // Store User 
    const user = {id,username,room}
    users.push(user)
    return {user}
}
const removeUser =(id)=>{
    const index = users.findIndex(user=>user.id ===id)
    if(index!==-1){
        return users.splice(index,1)[0]
    }

}
// addUser({
//     id:11,
//     username:`naveed`,
//     room:'Room1'
// })
// Add users
// for(let i =0 ;i<10;i++){
//     addUser({
//         id:i,
//         username:`naveed${i}`,
//         room:'Room'
//     })
// }

const getUsersInRoom = (room) =>{
    return users.filter(user => user.room===room.trim().toLowerCase())
}
const userList = getUsersInRoom('Room1')
console.log("Here is Room",userList)

const getUser = (id)=>{
    return users.find((user)=>user.id===id)
}

const user= getUser(6)
console.log(user)

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}