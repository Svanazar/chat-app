const {Users, Chats, Messages} = require('../models/index')

async function createChat(userId1, userId2) {
  try {
    const createdChatId = await Chats.createChat(userId1, userId2)
    const createdChat = await Chats.getChat(createdChatId)
    return createdChat[0]
  } catch(e) {
    console.error(e)
    throw {code: 1, message: e.message}
  }
}

async function getChat(chatId) {
  try {
    const chat = await Chats.getChat(chatId)
    return chat[0]
  } catch(e) {
    console.error(e)
    throw({code: 1, message: e.message})
  }
}

async function getMessages(chatId, filters) {
  try {
    const {afterId} = filters
    const messages = Chats.getChatMessages(chatId, {afterId})
    return messages
  } catch(e) {
    console.error(e);
    throw {code: 1, message: e.message}
  }
}

async function createMessage(userId, chatId, content) {
  try {
    const createdMessageId = await Messages.createMessage(userId, chatId, content)
    const createdMessage = await Messages.getMessage(createdMessageId)
    return createdMessage[0]
  } catch(e) {
    console.error(e)
    throw {code: 1, message: e.message}
  }
}

async function getUserChats(userId) {
  try {
    const chatList = await Users.getChats(userId)
    return chatList
  } catch(e) {
    console.error(e)
    throw {code: 1, message: e.message}
  }
}

module.exports = {
  createChat,
  getChat,
  createMessage,
  getMessages,
  getUserChats
}