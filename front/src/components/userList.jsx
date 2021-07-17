import React, {useState, useEffect, useContext} from 'react'
import SocketContext from '../context/socketContext'

import styles from './userList.module.css'
import itemStyles from './chatItem.module.css'

function UserList(props) {
  const {append, chats} = props
  const [users, setUsers] = useState([])
  const [selectedUsername, setSelectedUsername] = useState(null)
  const [reqStatus, setReqStatus] = useState('begin')
  const {socket} = useContext(SocketContext)
  
  useEffect(() => {
    if(reqStatus === 'begin') {
      socket.emit('users:load', (resp) => {
        if(resp.status === 'ok'){
          setUsers(resp.body)
          setReqStatus('success')
        }
        else {
          setReqStatus('fail')
        }
      })
      setReqStatus('loading')
    }
  })

  useEffect(() => {
    if(reqStatus === 'begin:create') {
      const data = {user2: selectedUsername}
      socket.emit("chat:create", data, (resp) => {
        if(resp.status === "ok") {
          append(resp.body)
        }
        else setReqStatus("failed")
      })
      setReqStatus("creating")
    }
  })


  function beginRequest(username){
    setSelectedUsername(username)
    setReqStatus('begin:create')
  }

  const userList = users.map(user =>  (
    <li key={user.username} className={itemStyles.item} onClick={() => beginRequest(user.username)}>
      <div className={itemStyles.icon}>
        <div></div>
      </div>
      <div className={itemStyles.content}>
        <span className={itemStyles.title}>{user.username}</span>
      </div>
    </li>
  ))

  return (
    <>
    <div className={styles.header}>
      Select user to chat with
    </div>
    <ul>
      {userList}
    </ul>
    </>
  )
}

export default UserList