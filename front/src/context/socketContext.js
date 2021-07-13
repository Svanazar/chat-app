import React from 'react'
import socketio from 'socket.io-client'

const socket = socketio('localhost:5000', {autoConnect: false})
const SocketContext = React.createContext()

function SocketProvider(props) {
  return <SocketContext.Provider value={{socket}} {...props} />
}

export default SocketContext
export {SocketProvider}
