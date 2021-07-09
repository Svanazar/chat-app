const userSocketMap = new Map()

function addUserId(userId, socketId){
  userSocketMap.set(userId, socketId)
}

function getSocketId(userId){
  return userSocketMap.get(userId)
}

function removeUserId(userId){
  userSocketMap.delete(userId)
}

function listAll(){
  console.log("map values:")
  for(let [key, value] of userSocketMap){
    console.log(key, value)
  }
}

module.exports = {
  addUserId,
  getSocketId,
  removeUserId,
  listAll
}