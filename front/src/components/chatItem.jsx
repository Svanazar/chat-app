import React, {useState, useEffect, useContext} from 'react'
import SocketContext from '../context/socketContext'
import UserContext from '../context/userContext'

function ChatItem(props){
  const {user: userId} = useContext(UserContext)
  const {socket} = useContext(SocketContext)
  const {chat, isSelected, setSelected} = props
  const [isNew, setIsNew] = useState(false)

  useEffect(() => {
    if(isSelected) return;
    const listener = (newMessage) => {
      if(newMessage.source === userId) {
        return;
      }
      if(newMessage.chat === chat.id) {
        setIsNew(true)
      }
    }
    socket.on("message:new", listener)
    return () => socket.off("message:new", listener)
  }, [socket, userId, isSelected, chat])

  function handleClick() {
    setIsNew(false)
    setSelected()
  }

  return (
    <li onClick={handleClick}>{chat.user1} and {chat.user2} {isSelected ? "(sel)" : ""} {isNew ? "(new)" : ""}</li>
  )
}

export default ChatItem