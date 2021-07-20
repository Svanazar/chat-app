const userSocketMap = new Map()

function addUserId(userId, socket){
  userSocketMap.set(userId, socket)
}

function getSocket(userId){
  return userSocketMap.get(userId)
}

function removeUserId(userId){
  userSocketMap.delete(userId)
}

function listAll(){
  console.log("map values:")
  for(let [key, value] of userSocketMap){
    console.log(typeof key, value.id)
  }
}

module.exports = {
  addUserId,
  getSocket,
  removeUserId,
  listAll
}