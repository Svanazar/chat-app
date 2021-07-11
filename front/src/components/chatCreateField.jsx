import React, {useState, useEffect, useContext} from 'react'
import SocketContext from '../context/socketContext'

import styles from './chatCreateField.module.css'

function ChatCreateField(props){
  const [content, setContent] = useState("")
  const [reqStatus, setReqStatus] = useState("succeeded")
  const {socket} = useContext(SocketContext)
  const {append} = props

  useEffect(() => {
    if(content && reqStatus === "begin") {
      const data = {user2: content}
      socket.emit("chat:create", data, (resp) => {
        if(resp.status === "ok") {
          setReqStatus("succeeded")
          setContent("")
          append(resp.body)
        }
        else setReqStatus("failed")
      })
      setReqStatus("pending")
    }
  }, [reqStatus, socket, content, append])

  function handleInputChange(e){
    setContent(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setReqStatus("begin")
  }

  return (
    <div className={styles.container}>
    <form onSubmit={handleSubmit}>
        <input className={styles.queryInput} placeholder="Enter User to create chat" type="text" value={content} onChange={handleInputChange} />
    </form>
    </div>
  )
}

export default ChatCreateField