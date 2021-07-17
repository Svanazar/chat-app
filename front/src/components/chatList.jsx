import React from 'react'
import ChatCreateField from './chatCreateField'
import styles from './chatList.module.css'

function ChatList(props){
  const {chats, append} = props
  return (
    <div className={styles.container}>
      {/* <div className={styles.header}>
        <ChatCreateField append={append} />
      </div> */}
      <ul className={styles.chatList}>
        {chats}
      </ul>
    </div>
  )
}

export default ChatList