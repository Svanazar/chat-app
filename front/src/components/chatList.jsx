import React, {useState, useEffect, useContext} from 'react'
import SocketContext from '../context/socketContext'
import UserContext from '../context/userContext'
import ChatCreateField from './chatCreateField'
import MessageManager from './messageManager'
import ChatItem from './chatItem'

function ChatList(props) {
  //TODO: for 'message:new', if the chat doesn't exist then a new chat should be created
  const {socket} = useContext(SocketContext)
  const {user: userId} = useContext(UserContext)

  const [chats, setChats] = useState([])
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    if(userId) {
      console.log("chats:load")
      socket.emit("chats:load", (resp) => {
        if(resp.status === "ok"){
          setChats(resp.body)
        }
        else {
          setChats([])
        }
        setSelectedId(null)
      })
    }
  }, [socket, userId, setChats])

  const chatList = <ul>{chats.map((chat) => <ChatItem key={chat.id} chat={chat} isSelected={selectedId === chat.id} setSelected={() => setSelectedId(chat.id)}/>)}</ul>

  return (
    <>
    {chats.length > 0 ? chatList : "NOTHING HERE"}
    <ChatCreateField append={newChat => setChats(chats => chats.concat(newChat))}/>
    <MessageManager selChatId={selectedId} />
    </>
  )
}

export default ChatList