const {Server} = require('socket.io')
const ChatService = require('../services/chatService')
const socketMapService = require('../services/socketMapService')

module.exports = (server) => {
  const io = new Server(server)
  io.use((socket, next) => {
    const {user: userId} = socket.handshake.auth
    socket.userId = userId
    next()
  })
  io.on('connection', (socket) => {
    const userId = socket.userId
    console.log(`user ${userId} vi socket ${socket.id} connected`)
    socketMapService.addUserId(userId, socket.id)

    socket.on("disconnect", () => {
      console.log(`user ${userId} vi socket ${socket.id} disconnected`)
      socketMapService.removeUserId(userId)
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
        const chat = await ChatService.createChat(userId, data.user2)
        callback({status: "ok", body: chat})
      } catch(e) {
        console.error(e)
        callback({status: "error", message: e.message})
      }
    })

    socket.on("message:create", async(data, callback) => {
      try {
        const chat  = await ChatService.getChat(data.chatId)
        const message = await ChatService.createMessage(userId, data.chatId, data.content)
        callback({status: "ok", body: message})
        let otherUserId = userId === chat.user1 ? chat.user2 : chat.user1
        let otherSocket = socketMapService.getSocketId(otherUserId)
        if(otherSocket) {
          io.to(otherSocket).emit("message:new", message)
        }
      } catch(e){
        console.error(e)
        callback({status: "error", message: e.message})
      }
    })
  })
}