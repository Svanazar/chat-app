const db = require('../db')
const {tb_users, tb_chats} = require('./consts')

async function createUser(username){
  const createdUser = await db(tb_users).insert({username})
  return createdUser[0]
}

async function getUserId(username){
  const user = await db.select('id').from(tb_users).whereRaw(`username = "${username}"`)
  if(user.length == 0) throw new Error(`username ${username} does not exist`)
  return user[0].id
}

async function getOnlineUsers(){
  const userList = await db.select().from(tb_users)
  return userList
}

async function getUsersExceptId(userId) {
  const userList = await db.column('id', 'username').select()
    .from('Users')
    .whereRaw(`id != ${userId}`)
  
  return userList
}

async function getChats(userId){
  const queryString = 
    `(
      SELECT chats.id, chats.title AS chatName, chats.private
      FROM participants
      INNER JOIN chats
        ON participants.chat = chats.id
      WHERE participants.user = ${userId}
        AND chats.private = 0
     )
     UNION
     (
      SELECT chats.id, Users.username as chatName, chats.private
      FROM participants
      INNER JOIN chats
        ON participants.chat = chats.id
        AND chats.private = 1
        AND participants.user = ${userId}
      INNER JOIN (
        SELECT chats.id, user
        from participants
        inner join chats
          on participants.chat = chats.id
        where participants.user != ${userId}
        and chats.private = 1
      ) AS other
        ON chats.id = other.id
      INNER JOIN Users
        ON other.user = Users.id
     )
     ORDER BY id
    `
  const [chatList, buffer] = await db.raw(queryString)
  return chatList
}

module.exports = {
  createUser,
  getUserId,
  getUsersExceptId,
  getOnlineUsers,
  getChats
}