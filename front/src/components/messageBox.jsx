import React, {useState, useEffect, useContext } from 'react'
import SocketContext from '../context/socketContext'
import styles from './messageBox.module.css'

function MessageBox(props){
  const [content, setContent] = useState("")
  const [reqStatus, setReqStatus] = useState("succeeded")
  const {socket} = useContext(SocketContext)
  const {chatId, append} = props

  useEffect(() => {
    if(chatId && reqStatus === "begin") {
      const data = {
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
  }, [reqStatus, chatId, socket, content, append])

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
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <label>
          Message:
          <input type="text" value={content} onChange={handleInputChange} />
        </label>
        <input type="submit" value="Send"/>
      </form>
    </div>
    </>
  )
}

export default MessageBox