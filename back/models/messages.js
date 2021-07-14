const db = require('../db')
const {tb_users, tb_chats, tb_messages} = require('./consts')

async function getMessage(messageId){
  const queryString = 
    `SELECT messages.id, source, username as sourceName, chat, content, created
     FROM messages
     LEFT JOIN Users
       ON messages.source = Users.id
     WHERE messages.id = ${messageId}
    `
  const [message, buffer] = await db.raw(queryString)
  return message
}
async function createMessage(userId, chatId, content){
  const createdMessage = await db(tb_messages).insert({
    source: userId,
    chat: chatId,
    content
  })
  return createdMessage[0]
}

module.exports = {
  getMessage,
  createMessage
}