import React, {useState, useContext, useEffect} from 'react'
import SocketContext from '../context/socketContext'
import MessageBox from './messageBox'

function MessageManager(props){
  const {socket} = useContext(SocketContext)
  const [chatMap, setChatMap] = useState({})
  const [loadStatus, setLoadStatus] = useState('begin:new')
  const {selChatId} = props


  useEffect(() => {
    if(selChatId) setLoadStatus('begin:new')
  }, [selChatId])
  
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
          }
          else {
            setChatMap(chatMap => ({...chatMap, [selChatId]: chatMap[selChatId] || []}))
            setLoadStatus('failed')
          }
        })
        setLoadStatus('loading')
      }
    }
  }, [socket, chatMap, loadStatus, selChatId])

  useEffect(() => {
    const listener = (newMessage) => {
      if(newMessage.chat === selChatId){
        setChatMap(chatMap => ({...chatMap, [selChatId]: chatMap[selChatId].concat(newMessage)}))
      }
    }
    socket.on("message:new", listener)
    return () => socket.off("message:new", listener)
  }, [socket, selChatId])

  const messageList = chatMap[selChatId] ? chatMap[selChatId].map((message) => <li key={message.id}>{message.source} : {message.content} @ {message.created}</li>) : [] 
  return (
    <>
    {messageList.length> 0 ? <ul>{messageList}</ul> : "EMPTY"}
    <MessageBox chatId={selChatId} append={(data) => setChatMap(chatMap => ({...chatMap, [selChatId]: chatMap[selChatId].concat(data)}))} />
    </>
  )
}

export default MessageManager