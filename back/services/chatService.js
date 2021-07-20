const {Users, Chats, Messages} = require('../models/index')

async function createChat(title, userIds, private=false, creatorId=undefined) {
  try {
    if(private) title = undefined
    const memberIds = [creatorId, ...userIds]
    const createdChatId = await Chats.createChat(title, memberIds, private)
    // let columns = ['chats.id', {chatName: 'username'}]
    // const createdChat = await Chats.getChatOfUser(userId, createdChatId, columns)
    const createdChat = await Chats.getChat(createdChatId, creatorId)
    return createdChat[0]
  } catch(e) {
    console.error(e)
    throw {code: 1, message: e.message}
  }
}

async function getChat(chatId, userId) {
  try {
    const [chat] = await Chats.getChat(chatId, userId)
    return chat
  } catch(e){
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
  getChat,
  getChatOfUser,
  createMessage,
  getMessages,
  getUserChats
}