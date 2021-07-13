const express = require('express')
const UserService = require('../services/userService')
const ChatService = require('../services/chatService')

const router = express.Router()

router.post('/user', async (req, res) => {
  try {
    const { username } = req.body
    const createdUserId = await UserService.createUser(username)
    res.json({createdUserId})
  } catch(e){
    res.status(500).json(e)
  }
})

router.get('/createChat', async (req, res) => {
  try{
    const {user1, user2} = req.body
    const createdChatId = await ChatService.createChat(user1, user2)
    res.json({createdChatId})
  } catch(e){
    res.status(500).json(e)
  }
})

router.get('/createMessage', async (req, res) => {
  try{
    const {userId, chatId, content} = req.body
    const createdMessageId = await ChatService.createMessage(userId, chatId, content)
    res.json({createdMessageId})
  } catch(e){
    res.status(500).json(e)
  }
})

router.get('/userChats', async (req, res) => {
  try {
    const {userId} =  req.body
    const chatList = await ChatService.getUserChats(userId)
    res.json({chatList})
  } catch(e){
    res.status(500).json(e)
  }
})

module.exports = router