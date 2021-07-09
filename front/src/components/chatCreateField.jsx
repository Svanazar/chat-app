import React, {useState, useEffect, useContext} from 'react'
import SocketContext from '../context/socketContext'

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
    <>
    <form onSubmit={handleSubmit}>
      <label>
        new chat with user:
        <input type="text" value={content} onChange={handleInputChange} />
      </label>
      <input type="submit" value="create"/>
    </form>
    </>
  )
}

export default ChatCreateField