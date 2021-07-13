import React, {useState, useEffect, useContext} from 'react'
import SocketContext from '../context/socketContext'
import UserContext from '../context/userContext'
import MessageManager from './messageManager'
import ChatList from './chatList'
import ChatItem from './chatItem'

import styles from './chatManager.module.css'

function ChatManager(props) {
  //TODO: for 'message:new', if the chat doesn't exist then a new chat should be created
  const {socket} = useContext(SocketContext)
  const {userId} = useContext(UserContext)

  const [chatIds, setChatIds] = useState([])
  const [chats, setChats] = useState({})
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    if(userId) {
      console.log("chats:load")
      socket.emit("chats:load", (resp) => {
        if(resp.status === "ok"){
          const chatMap = {}
          const idArray = []
          for(const chat of resp.body) {
            chatMap[chat.id] = chat
            idArray.push(chat.id)
          }
          setChats(chatMap)
          setChatIds(idArray)
        }
        else {
          //User changing and failed
          setChats([])
          setChatIds({})
        }
        setSelectedId(null)
      })
    }
  }, [socket, userId])

  useEffect(() => {
    const listener = (newMessage) => {
      if(newMessage.source === userId || newMessage.chat === selectedId) return;
      setChats(chats => ({
          ...chats,
          [newMessage.chat]: {...chats[newMessage.chat], hasNew: true}
        })
      )
    }
    socket.on('message:new', listener)
    return () => socket.off('message:new', listener)
  }, [socket, userId, selectedId])

  function appendChat(newChat){
    //calling setChatIds before setChats results in a error in render for ChatItem
    //because the id in added in chatArray so chatItem exists, but the data in chatMap is yet to be created
    setChats(chats => ({...chats, [newChat.id]: newChat}))
    setChatIds(chatIds => chatIds.concat(newChat.id))
  }

  const chatList = chatIds.map(id => <ChatItem key={id} chat={chats[id]} isSelected={selectedId === id} setSelected={() => setSelectedId(id)}/>)

  return (
    <div className={styles.mainLayout}>
      <div className={styles.sideBar}>
        <ChatList chats={chatList} append={appendChat} />
      </div>
      <div className={styles.midPane}>
        {selectedId
        ? <MessageManager selChatId={selectedId} hasNew={chats[selectedId].hasNew} updateHasNew={() => setChats(chats => ({...chats, [selectedId]: {...chats[selectedId], hasNew:false}}))}/>
        : "Select chat to view messages"
        }
      </div>
    </div>
  )
}

export default ChatManager