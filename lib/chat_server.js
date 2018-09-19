const socketio = require('socket.io')
let io
let guestNumber = 1
let nickNames = {}
let nameUsed = []
let currenttRoom = {}

exports.listen = (server) => {
    io = socketio.listen(server)
    io.set('log level', 1)

    io.sockets.on('connection', socket => {
        guestNumber = assignGuestName(socket, guestNumber, nickNames, nameUsed)
        joinRoom(socket, 'Lobby')

        handleMessageBroadcasting(socket, nickNames)
        handleNameChangeAttempts(socket, nickNames, nameUsed)
        handleRoomJoining(socket)

        socket.on('rooms', () => {
            socket.emit('rooms', io.sockets.rooms)
        })

        handleClientDisconnection(socket, nickNames, nameUsed)
    })
}

const assignGuestName = (socket, guestNumber, nickNames, nameUsed) => {
    const name = 'Guest' + guestNumber
    nickNames[socket.id] = name
    socket.emit('nameResult', {
        success: true,
        name: name
    })
    nameUsed.push(name)
    return guestNumber + 1
}

const joinRoom = (socket, room) => {
    socket.join(room)
    currenttRoom[socket.id] = room
    socket.emit('joinResult', {
        room: room
    })
    socket.broadcast.to(room).emit('message', {
        text: nickNames[socket.id] + 'has joined' + room + '.'
    })

    // let userInRoom = io.sockets.clients(room)
    var userInRoom = io.of('/').in(room).clients;
    if (userInRoom.length > 1) {
        let usersInRoomSummary = `Users currently in ${room}: `
        for (let index in userInRoom) {
            let userSocketId = userInRoom[index].id
            if (userSocketId !== socket.id) {
                if (index > 0) {
                    usersInRoomSummary += ', '
                }
                usersInRoomSummary += nickNames[userSocketId]
            }
        }
        usersInRoomSummary += '.'
        socket.emit('message', {
            text: usersInRoomSummary
        })
    }
}

const handleNameChangeAttempts = (socket, nickNames, nameUsed) => {
    socket.on('nameAttempt', (name) => {
        if (name.indexOf('Guest') === 0) {
            socket.emit('nameResult', {
                success: false,
                message: `Names cannot begin with "Guest"`
            })
        } else {
            if (nameUsed.indexOf(name) == -1) {
                const previousName = nickNames[socket.id]
                const previousNameIndex = nameUsed.indexOf(previousName)
                nameUsed.push(name)
                nickNames[socket.id] = name
                delete nameUsed[previousNameIndex]
                socket.emit('nameResult', {
                    success: true,
                    name: name
                })
                socket.broadcast.to(currenttRoom[socket.id].emit('message', {
                    text: `${previousName} is now known as ${name}.`
                }))
            } else {
                socket.emit('nameResult', {
                    success: false,
                    message: 'That name is already in use'
                })
            }
        }
    })
}

const handleMessageBroadcasting = (socket, nickNames) => {
    socket.on('message', (message) => {
        socket.broadcast.to(message.room).emit('message', {
            text: nickNames[socket.id] + ':' + message.text
        })
    })
}

const handleRoomJoining = (socket) => {
    socket.on('join', (room) => {
        socket.leave(currenttRoom[socket.id])
        joinRoom(socket, room.newRoom)
    })
}

const handleClientDisconnection = (socket, nickNames, nameUsed) => {
    socket.on('disconnect', () => {
        const nameIndex = nameUsed.indexOf(nickNames[socket.id])
        delete nameUsed[nameIndex]
        delete nickNames[socket.id]
    })
}