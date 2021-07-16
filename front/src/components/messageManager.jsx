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
  const {selChatId, hasNew, updateHasNew} = props

  const loadStatus = chatMap.hasOwnProperty(selChatId)
                     ? chatMap[selChatId].loadStatus
                     : 'init'

  useEffect(() => {
    // sets loadStatus on the basis of hasNew
    if(loadStatus === 'init' || (hasNew && loadStatus === 'idle')) {
      setChatMap(chatMap => ({
        ...chatMap,
        [selChatId]: {
            messages: [],
            ...chatMap[selChatId],
            loadStatus: 'begin:new'
          }
        })
      )
    }
    else if(!hasNew){
      setChatMap(chatMap => ({
        ...chatMap,
        [selChatId]: {
            ...chatMap[selChatId],
            loadStatus: 'idle'
          }
        })
      )
    }
  }, [selChatId, hasNew, loadStatus])

  useEffect(() => {
    // requests new messages
    if(['begin:new', 'begin:old'].includes(loadStatus)) {
      const {messages} = chatMap[selChatId]
      let firstMessageId
      let lastMessageId
      if(messages.length > 0){
        if(loadStatus === 'begin:old') firstMessageId = messages[0].id
        else lastMessageId = messages[messages.length - 1].id
      }
      const data = {chatId: selChatId, beforeId: firstMessageId, afterId: lastMessageId}
      socket.emit("messages:load", data, (resp) => {
        if(resp.status === "ok"){
          setChatMap(chatMap => {
            const {messages}= chatMap[selChatId]
            let newMessages
            if(firstMessageId) newMessages = resp.body.concat(messages)
            else newMessages = messages.concat(resp.body)
            return {
              ...chatMap, 
              [selChatId]: {
                loadStatus: 'success',
                messages: newMessages
              }
            }
          })
          updateHasNew()
        }
        else {
          setChatMap(prevChatMap => ({
            ...prevChatMap,
            [selChatId]: {
              ...prevChatMap[selChatId],
              loadStatus: 'fail'
            }
          }))
        }
      })

      setChatMap(prevChatMap => ({
        ...prevChatMap,
        [selChatId]: {
          ...prevChatMap[selChatId],
          loadStatus: 'loading'
        }
      }))
    }
  }, [socket, chatMap, loadStatus, hasNew, updateHasNew, selChatId])

  useEffect(() => {
    // adds new incoming messages if belongs to selected chat
    const listener = (newMessage) => {
      if(newMessage.chat === selChatId){
        setChatMap(chatMap => ({
          ...chatMap, 
          [selChatId]: {
            ...chatMap[selChatId],
            messages: chatMap[selChatId].messages.concat(newMessage)
          }
        }))
      }
    }
    socket.on("message:new", listener)
    return () => socket.off("message:new", listener)
  }, [socket, selChatId])

  const messageList = chatMap[selChatId] ? chatMap[selChatId].messages.map(message => <MessageItem key={message.id} message={message} fromUser={message.source === parseInt(userId, 10)} />) : [] 
  
  function appendToChat(message) {
    setChatMap(chatMap => ({
      ...chatMap, 
      [selChatId]: {
        ...chatMap[selChatId],
        messages: chatMap[selChatId].messages.concat(message)
      }
    }))
  }

  return (
    <>
    <div className={styles.container}>
      <div className={styles.messagePane}>
        {messageList.length> 0 ? <ul>{messageList}</ul> : "EMPTY"}
      </div>
      <MessageBox chatId={selChatId} append={appendToChat} />
    </div>
    </>
  )
}

export default MessageManager