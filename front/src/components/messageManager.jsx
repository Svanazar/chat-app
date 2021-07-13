import React, {useState, useContext, useEffect} from 'react'
import SocketContext from '../context/socketContext'
import MessageBox from './messageBox'
import MessageItem from './messageItem'
import UserContext from '../context/userContext'

import styles from './messageManager.module.css'

function MessageManager(props){
  const {userId} = useContext(UserContext)
  const {socket} = useContext(SocketContext)
  const [chatMap, setChatMap] = useState({})
  const [loadStatus, setLoadStatus] = useState('begin:new')
  const {selChatId, hasNew, updateHasNew} = props
  
  useEffect(() => {
    if(selChatId && hasNew) setLoadStatus('begin:new')
  }, [selChatId, hasNew])
  
  useEffect(() => {
    if(selChatId){
      if(loadStatus === 'begin:old' || loadStatus === 'begin:new') {
        const messages = chatMap[selChatId]
        let firstMessageId
        let lastMessageId
        if(messages && messages.length > 0){
          if(loadStatus === 'begin:old') firstMessageId = messages[0].id
          else lastMessageId = messages[messages.length - 1].id
        }
        const data = {chatId: selChatId, beforeId: firstMessageId, afterId: lastMessageId}
        socket.emit("messages:load", data, (resp) => {
          if(resp.status === "ok"){
            setChatMap(chatMap => {
              const messages = chatMap[selChatId] || []
              if(firstMessageId) return {...chatMap, [selChatId]: resp.body.concat(messages)}
              return {...chatMap, [selChatId]: messages.concat(resp.body)}
            })
            setLoadStatus('succeeded')
            updateHasNew()
          }
          else {
            setChatMap(chatMap => ({...chatMap, [selChatId]: chatMap[selChatId] || []}))
            setLoadStatus('failed')
          }
        })
        setLoadStatus('loading')
      }
    }
  }, [socket, chatMap, hasNew, updateHasNew, loadStatus, selChatId])

  useEffect(() => {
    const listener = (newMessage) => {
      if(newMessage.chat === selChatId){
        setChatMap(chatMap => ({...chatMap, [selChatId]: chatMap[selChatId].concat(newMessage)}))
      }
    }
    socket.on("message:new", listener)
    return () => socket.off("message:new", listener)
  }, [socket, selChatId])

  const messageList = chatMap[selChatId] ? chatMap[selChatId].map(message => <MessageItem key={message.id} message={message} fromUser={message.source === parseInt(userId, 10)} />) : [] 
  
  return (
    <>
    <div className={styles.messagePane}>
      {messageList.length> 0 ? <ul>{messageList}</ul> : "EMPTY"}
    </div>
    <MessageBox chatId={selChatId} append={(data) => setChatMap(chatMap => ({...chatMap, [selChatId]: chatMap[selChatId].concat(data)}))} />
    </>
  )
}

export default MessageManager