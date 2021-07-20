const db = require('../db')
const {tb_users, tb_chats, tb_messages} = require('./consts')

async function createChat(title, userIds, private){
  //Check against (u, v) and (v, u) existing simultaneously by allowing only ordered pairs
  // if(user1 > user2) {
  //   [user1, user2] = [user2, user1]
  // }
  if(private) {

  }
  const [newChatId] = await db(tb_chats).insert({title, private})
  for(const id of userIds) {
    await db('participants').insert({user: id, chat: newChatId})
  }
  return newChatId
}

async function getChat(chatId, userId) {
  const queryString = `
    SELECT chats.id, chats.title as chatName, chats.private
    from chats
    where chats.id = ${chatId}
    and chats.private = 0
    UNION (
      SELECT chats.id, Users.username as chatName, chats.private
      from chats
      inner join participants
        on chats.id = participants.chat
        and chats.id = ${chatId}
        and chats.private = 1
        and participants.user != ${userId}
      inner join Users
        on participants.user = Users.id
    )
  `
  const [chat, buffer] = await db.raw(queryString)
  return chat
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
  getChat,
  getChatOfUser,
  getChatMessages
}