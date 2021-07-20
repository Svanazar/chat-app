const {Users} = require('../models/index')

async function createUser(username) {
  try {
    const createdUserId = await Users.createUser(username)
    return createdUserId
  } catch(e) {
    console.error(e)
    throw {code: 1, message: e.message}
  }
}

async function getUserId(username) {
  try {
    const userId = await Users.getUserId(username)
    return userId
  } catch(e) {
    console.error(e)
    throw {code:1, message: e.message}
  }
}

async function getUsers(userId) {
  try {
    const userList = await Users.getUsersExceptId(userId)
    return userList
  } catch(e) {
    console.error(e)
    throw {code: 1, message: e.message}
  }
}

module.exports = {
  createUser,
  getUserId,
  getUsers
}