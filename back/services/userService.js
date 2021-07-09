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

module.exports = {
  createUser
}