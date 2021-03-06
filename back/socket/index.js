const {Server, Socket} = require('socket.io')
const UserService = require('../services/userService')
const ChatService = require('../services/chatService')
const SocketMapService = require('../services/socketMapService')

module.exports = (server) => {
  const io = new Server(server)
  io.use(async (socket, next) => {
    const {username} = socket.handshake.auth
    try{
      const userId = await UserService.getUserId(username)
      socket.userId = userId
      socket.username = username
      return next()
    } catch(e){
      return next(new Error(e.message))
    }
  })

  io.on('connection', async (socket) => {
    const userId = socket.userId
    console.log(`user ${userId} vi socket ${socket.id} connected`)
    SocketMapService.addUserId(userId, socket)
    
    const chats = await ChatService.getUserChats(userId)
    for(const {id} of chats){
      socket.join(`Chat ${id}`)
    }

    socket.emit('session', {userId, username: socket.username})

    socket.on("disconnect", () => {
      console.log(`user ${userId} vi socket ${socket.id} disconnected`)
      SocketMapService.removeUserId(userId)
    })

    socket.on("users:load", async(callback) => {
      try {
        const userList = await UserService.getUsers(userId)
        callback({status: "ok", body: userList})
      } catch(e) {
        console.error(e)
        callback({status: "error", message: e.message})
      }
    })

    socket.on("chats:load", async(callback) => {
      try{
        const chatList = await ChatService.getUserChats(userId)
        callback({status: "ok", body: chatList})
      } catch(e){
        console.error(e)
        callback({status: "error", message: e.message})
      }
    })

    socket.on("chats:get", async (data, callback) => {
      try{
        const chat = await ChatService.getChat(data.chatId)
        callback({status: "ok", body: chat})
      } catch(e){
        console.error(e)
        callback({status: "error", message: e.message})
      }
    })

    socket.on("messages:load", async(data, callback) => {
      try{
        const {chatId, ...filters} = data 
        const messages = await ChatService.getMessages(chatId, filters)
        callback({status: "ok", body: messages})
      } catch(e) {
        console.error(e)
        callback({status: "error", message: e.message})
      }
    })

    socket.on("chat:create", async(data, callback) => {
      try {
        const chat = await ChatService.createChat(data.title, data.userIds, data.private, userId)
        callback({status: "ok", body: chat})
        socket.join(`Chat ${chat.id}`)
        for(const id of data.userIds){
          let otherSocket = SocketMapService.getSocket(parseInt(id, 10))
          if(otherSocket) {
            otherSocket.join(`Chat ${chat.id}`)
          }
        }
        if(!chat.private) {
          socket.to(`Chat ${chat.id}`).emit('group:new', chat)
        }
      } catch(e) {
        console.error(e)
        callback({status: "error", message: e.message})
      }
    })

    socket.on("message:create", async(data, callback) => {
      try {
        // const chat  = await ChatService.getChatOfUser(userId, data.chatId, {
        //   columns: ['user1', 'user2']
        // })
        const message = await ChatService.createMessage(userId, data.chatId, data.content)
        callback({status: "ok", body: message})
        socket.to(`Chat ${message.chat}`).emit('message:new', message)
        // let otherUserId = userId === chat.user1 ? chat.user2 : chat.user1
        // let otherSocket = SocketMapService.getSocketId(otherUserId)
        // if(otherSocket) {
        //   io.to(otherSocket).emit("message:new", message)
        // }
      } catch(e){
        console.error(e)
        callback({status: "error", message: e.message})
      }
    })
  })
}