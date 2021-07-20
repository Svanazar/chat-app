import React, {useState} from 'react'
import itemStyles from './chatItem.module.css'
import styles from './groupCreate.module.css'

function GroupCreate(props) {
  const {users, submitData} = props
  const [selectedUsers, setSelectedUsers] = useState({})
  const [title, setTitle] = useState('')

  function selectToggle(userId) {
    setSelectedUsers(users =>{
      if(users[userId]){
        const {[userId]:temp, ...usersWithout} = users
        return usersWithout
      }
      return {...users, [userId]: true}
    })
  }

  function handleSubmit(){
    submitData({
      title: title,
      userIds: Object.keys(selectedUsers)
    })
  }

  const userList = users.map(user => (
    <li className={`${itemStyles.item} ${selectedUsers[user.id] && itemStyles.selected}`} key={user.id} onClick={() => selectToggle(user.id)}>
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
      <div className={styles.inputContainer}>
        <input className={styles.queryInput} type="text" placeholder="Enter Group Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
      </div>
      <div className={styles.header}>
        Select Members:
      </div>
      <ul className={itemStyles.itemList}>
        {userList}
      </ul>
      <div className={styles.submit}>
        <div onClick={handleSubmit}>
          Create
        </div>
      </div>
    </div>
    </>
  )
}

export default GroupCreate