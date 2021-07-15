const db = require('../db')
const {tb_users, tb_chats, tb_messages} = require('./consts')

async function createChat(user1, user2){
  //Check against (u, v) and (v, u) existing simultaneously by allowing only ordered pairs
  if(user1 > user2) {
    [user1, user2] = [user2, user1]
  }
  const newChat = await db(tb_chats).insert({user1, user2})
  return newChat[0]
}

async function getChatOfUser(userId, chatId, columns){
  const chat = await db.column(columns).select()
    .from('chats')
    .joinRaw(`
      LEFT JOIN Users
      ON chats.user1 = Users.id OR chats.user2 = Users.id
    `)
    .whereRaw(`
      chats.id = ${chatId}
      AND Users.id != ${userId}
    `)
  return chat
}

async function getChatMessages(chatId, filters={}){
  /*
  TODO: the client uses message.source to determine message belongs to user or not
        should it be changed to username so that passing sourceId can be avoided?
  */
  const {afterId} = filters
  const queryString =
    `SELECT messages.id, source, Users.username as sourceName, chat, content, created
     FROM messages
     INNER JOIN Users
       ON messages.source = Users.id
     WHERE messages.chat = ${chatId}
     ${afterId ? `AND messages.id > ${afterId}` : ""}
     ORDER BY messages.id
     `
  const [messages, buffer] = await db.raw(queryString)
  return messages
}

module.exports = {
  createChat,
  getChatOfUser,
  getChatMessages
}