const db = require('../db')
const {tb_users, tb_chats, tb_messages} = require('./consts')

async function createChat(user1, user2){
  //TODO: check against (u, v) and (v, u) existing simultaneously
  if(user1 > user2) {
    [user1, user2] = [user2, user1]
  }
  const newChat = await db(tb_chats).insert({user1, user2})
  return newChat[0]
}

async function getChat(chatId){
  const chat = await db(tb_chats).whereRaw(`id = ${chatId}`)
  return chat
}

async function getChatMessages(chatId, filters={}){
  const {afterId} = filters
  const messages = await db(tb_messages) 
                         .whereRaw(`chat = ${chatId}`)
                         .modify(builder => {
                           if(afterId) {
                             builder.whereRaw(`id > ${afterId}`)
                           }
                         })
  return messages
}

module.exports = {
  createChat,
  getChat,
  getChatMessages
}