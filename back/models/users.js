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

async function getUsernamesExceptId(userId) {
  const userList = await db.column('username').select()
    .from('Users')
    .whereRaw(`id != ${userId}`)
  
  return userList
}

async function getChats(userId){
  const queryString = 
    `SELECT chats.id, username AS chatName
     FROM chats
     LEFT JOIN Users
       ON chats.user1 = Users.id OR chats.user2 = Users.id
     WHERE Users.id != ${userId}
        AND (chats.user1 = ${userId} OR chats.user2 = ${userId})
     ORDER BY chats.id
    `
  const [chatList, buffer] = await db.raw(queryString)
  return chatList
}

module.exports = {
  createUser,
  getUserId,
  getUsernamesExceptId,
  getOnlineUsers,
  getChats
}