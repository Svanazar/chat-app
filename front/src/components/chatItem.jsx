import React from 'react'

import styles from './chatItem.module.css'

function ChatItem(props){
  const {chat, isSelected, setSelected} = props

  function handleClick() {
    setSelected()
  }

  return (
    <li className={`${styles.item} ${isSelected && styles.selected}`} onClick={handleClick}>
      <div className={styles.icon}>
        <div></div>
      </div>
      <div className={styles.content}>
        <span className={styles.title}>{chat.chatName}</span>
      </div>
      <div className={styles.info}>
        {chat.hasNew && <span className={styles.greenDot}></span>}
      </div>
    </li>
  )
}

export default ChatItem