import React, {useState, useEffect, useContext } from 'react'
import UserContext from '../context/userContext'
import SocketContext from '../context/socketContext'

function MessageBox(props){
  const [content, setContent] = useState("")
  const [reqStatus, setReqStatus] = useState("succeeded")
  const {user: userId} = useContext(UserContext)
  const {socket} = useContext(SocketContext)
  const {chatId, append} = props

  useEffect(() => {
    if(chatId && reqStatus === "begin") {
      const data = {
        userId,
        chatId,
        content
      }
      socket.emit("message:create", data, (resp) => {
        if(resp.status === "ok") {
          setReqStatus("succeeded")
          setContent("")
          append(resp.body)
        }
        else setReqStatus("failed")
      })
      setReqStatus("pending")
    }
  }, [reqStatus, userId, chatId, socket, content, append])

  function handleInputChange(e){
    setContent(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setReqStatus("begin")
  }

  if(!chatId) return null

  return (
    <>
    <form onSubmit={handleSubmit}>
      <label>
        Message:
        <input type="text" value={content} onChange={handleInputChange} />
      </label>
      <input type="submit" value="Send"/>
    </form>
    </>
  )
}

export default MessageBox