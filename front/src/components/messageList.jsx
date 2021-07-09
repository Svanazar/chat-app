import React, {useState, useEffect, useContext} from 'react'
import SocketContext from '../context/socketContext'
import MessageBox from './messageBox'

function MessageList(props){
  const {socket} = useContext(SocketContext)
  const {chatId} = props
  const [messages, setMessages] = useState([])

  useEffect(() => {
    if(chatId) {
      console.log("messages:load")
      socket.emit("messages:load", chatId, (resp) => {
        console.log(resp)
        if(resp.status === "ok"){
          setMessages(resp.body)
        }
        else {
          setMessages([])
        }
      })
    }
    else {
      setMessages([])
    }
  }, [socket, chatId, setMessages])

  useEffect(() => {
    const listener = (newMessage) => {
      if(newMessage.chat === chatId){
        setMessages(messages => messages.concat(newMessage))
      }
    }
    socket.on("message:new", listener)
    return () => socket.off("message:new", listener)
  }, [socket, chatId])

  const messageList = <ul>{messages.map((message) => <li key={message.id}>{message.source} : {message.content} @ {message.created}</li>)}</ul>
  return (
    <>
    {messages.length > 0 ? messageList : "EMPTY"}
    <MessageBox chatId={chatId} append={(data) => setMessages(messages => messages.concat(data))} />
    </>
  )
}

export default MessageList