import React, {useState, useEffect, useContext} from 'react'
import SocketContext from '../context/socketContext'
import GroupCreate from './groupCreate'

import styles from './userList.module.css'
import itemStyles from './chatItem.module.css'

function UserList(props) {
  const {append, chats} = props
  const [users, setUsers] = useState([])
  const [formData, setFormData] = useState({})
  const [isPrivate, setIsPrivate] = useState(true)
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
  }, [socket, reqStatus])

  useEffect(() => {
    if(reqStatus === 'begin:create') {
      const data = {
        ...formData,
        private: isPrivate
      }
      socket.emit("chat:create", data, (resp) => {
        if(resp.status === "ok") {
          append(resp.body)
        }
        else setReqStatus("failed")
      })
      setReqStatus("creating")
    }
  }, [socket, reqStatus, append, formData, isPrivate])


  function beginRequest(selUserId){
    setFormData({
      userIds: [selUserId]
    })
    setReqStatus('begin:create')
  }

  function handleGroupData(data) {
    setFormData(data)
    setReqStatus('begin:create')
  }

  if(!isPrivate) {
    return <GroupCreate users={users} submitData={handleGroupData}/>
  }

  const userList = users.map(user =>  (
    <li key={user.id} className={itemStyles.item} onClick={() => beginRequest(user.id)}>
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
    <div className={styles.container}>
      <div className={styles.createGroup} onClick={()=>setIsPrivate(isPrivate => !isPrivate)}>
        Create A Group...
      </div>
      <div className={styles.header}>
        Select user to chat with
      </div>
      <ul className={itemStyles.itemList}>
        {userList}
      </ul>
    </div>
    </>
  )
}

export default UserList