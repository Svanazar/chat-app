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

async function getChats(userId){
  const chatList = await db(tb_chats).whereRaw(`user1 = ${userId} OR user2 = ${userId}`);
  return chatList
}

module.exports = {
  createUser,
  getUserId,
  getOnlineUsers,
  getChats
}