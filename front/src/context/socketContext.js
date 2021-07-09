import React, {useEffect, useContext} from 'react'
import UserContext from './userContext'
import socketio from 'socket.io-client'

const socket = socketio('localhost:5000', {autoConnect: false})
const SocketContext = React.createContext()

function SocketProvider(props) {
  const {user} = useContext(UserContext)

  useEffect(() => {
    if(user){
      console.log("connection started")
      socket.auth = {user: parseInt(user, 10)}
      socket.connect()
    }
    return () => socket.disconnect()
  }, [user])
  
  return <SocketContext.Provider value={{socket}} {...props} />
}

export default SocketContext
export {SocketProvider}
