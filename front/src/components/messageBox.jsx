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


  function handleKey(e) {
    if(e.key === 'Enter' && !e.shiftKey) {
      setReqStatus('begin')
      e.preventDefault()
    }
  }

  function handleInputChange(e){
    setContent(e.target.value)
  }
  
  if(!chatId) return null

  return (
    <>
    <div className={styles.container}>
      <form>
        <label></label>
        <div className={styles.growWrapper}>
          <div>{content}</div>
          <textarea className={styles.textInput} placeholder="Type message here" type="text" value={content} onKeyDown={handleKey} onChange={handleInputChange} />
        </div>
      </form>
    </div>
    </>
  )
}

export default MessageBox