import React from 'react'

import styles from './chatItem.module.css'

function ChatItem(props){
  const {chat, isSelected, setSelected} = props

  function handleClick() {
    setSelected()
  }

  return (
    <li className={styles.item} onClick={handleClick}>{chat.chatName} {isSelected ? "(sel)" : ""} {chat.hasNew ? "(new)" : ""}</li>
  )
}

export default ChatItem