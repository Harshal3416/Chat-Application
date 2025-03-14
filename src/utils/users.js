const users = []

const addUser = ({ id, username, room}) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate Data
    if(!username || !room) return { error: 'Username and Room are required'}

    // Checking existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate Username
    if(existingUser) return { error: 'Username is in use'}

    // Store User
    const user = { id, username, room}
    users.push(user)
    return { user }
}

const removedUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}
const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser, removedUser, getUser, getUsersInRoom
}