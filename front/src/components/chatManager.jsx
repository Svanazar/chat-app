import React, {useState, useEffect, useContext} from 'react'
import SocketContext from '../context/socketContext'
import UserContext from '../context/userContext'
import MessageManager from './messageManager'
import ChatList from './chatList'
import ChatItem from './chatItem'
import CreateButton from './createButton'
import UserList from './userList'

import styles from './chatManager.module.css'

function ChatManager(props) {
  //TODO: for 'message:new', if the chat doesn't exist then a new chat should be created
  const {socket} = useContext(SocketContext)
  const {userId, username} = useContext(UserContext)

  const [chatIds, setChatIds] = useState([])
  const [chats, setChats] = useState({})
  const [selectedId, setSelectedId] = useState(null)
  const [isCreating, setIsCreating] = useState(false)

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
    const listener = (newChat) => {
      setChats(chats => ({...chats, [newChat.id]: newChat}))
      setChatIds(chatIds => chatIds.concat(newChat.id))
    }
    socket.on('group:new', listener)
    return () => socket.off('group:new', listener)
  }, [socket])

  useEffect(() => {
    const listener = (newMessage) => {
      if(newMessage.source === userId || newMessage.chat === selectedId) return;
      else if(!chats.hasOwnProperty(newMessage.chat)){
        const data = {
          userId,
          chatId: newMessage.chat
        }
        socket.emit('chats:get', data, (resp) => {
          if(resp.status === 'ok'){
            const newChat = resp.body
            newChat.hasNew = true
            setChats(chats => ({...chats, [newChat.id]: newChat}))
            setChatIds(chatIds => chatIds.concat(newChat.id)) 
          }
        })
        return;
      }
      setChats(chats => ({
          ...chats,
          [newMessage.chat]: {...chats[newMessage.chat], hasNew: true}
        })
      )
    }
    socket.on('message:new', listener)
    return () => socket.off('message:new', listener)
  }, [socket, chats, userId, selectedId])

  function appendChat(newChat){
    //calling setChatIds before setChats results in a error in render for ChatItem
    //because the id in added in chatArray so chatItem exists, but the data in chatMap is yet to be created
    if(!chats.hasOwnProperty(newChat.id)){
      setChats(chats => ({...chats, [newChat.id]: newChat}))
      setChatIds(chatIds => chatIds.concat(newChat.id))
    }
    setSelectedId(newChat.id)
    setIsCreating(false)
  }

  const chatList = chatIds.map(id => <ChatItem key={id} chat={chats[id]} isSelected={selectedId === id} setSelected={() => setSelectedId(id)}/>)

  return (
    <div className={styles.mainLayout}>
      <div className={`${styles.sideHead} ${isCreating && styles.greenBackground}`}>
        <div className={styles.userWrap}>
          <span>
            {isCreating
            ? `New Chat`
            : `signed in as: ${username}` 
            }
          </span>
        </div>
        <CreateButton isCreating={isCreating} toggle={() => setIsCreating(isCreating => !isCreating)}/>
      </div>
      <div className={styles.sideBar}>
        <ChatList chats={chatList} append={appendChat} />
        {isCreating && 
          <div className={styles.sideOverlay}>
            <UserList append={appendChat}/>
          </div>
        }
      </div>
      {!selectedId
      ? <div className={styles.initial}>
          Select Chat to view messages
        </div>
      : <>
          <div className={styles.chatHead}>
            <h2></h2>
          </div>
          <div className={styles.midPane}>
            <MessageManager selChatId={selectedId} hasNew={chats[selectedId].hasNew} updateHasNew={() => setChats(chats => ({...chats, [selectedId]: {...chats[selectedId], hasNew:false}}))}/>
          </div>
        </>
      }
    </div>
  )
}

export default ChatManager