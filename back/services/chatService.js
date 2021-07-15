const {Users, Chats, Messages} = require('../models/index')

async function createChat(userId, otherUsername) {
  try {
    const otherUserId = await Users.getUserId(otherUsername)
    const createdChatId = await Chats.createChat(userId, otherUserId)
    let columns = ['chats.id', {chatName: 'username'}]
    const createdChat = await Chats.getChatOfUser(userId, createdChatId, columns)
    return createdChat[0]
  } catch(e) {
    console.error(e)
    throw {code: 1, message: e.message}
  }
}

/* Parameters
  filters = {
    columns: []
  }
*/

async function getChatOfUser(userId, chatId, filters={}) {
  let columns = ['chats.id', {chatName: 'username'}]
  if(filters.columns) {
    columns = filters.columns
  }
  try {
    const chat = await Chats.getChatOfUser(userId, chatId, columns)
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
  getChatOfUser,
  createMessage,
  getMessages,
  getUserChats
}