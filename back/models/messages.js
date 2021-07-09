const db = require('../db')
const {tb_users, tb_chats, tb_messages} = require('./consts')

async function getMessage(messageId){
  const message = await db(tb_messages).whereRaw(`id = ${messageId}`)
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