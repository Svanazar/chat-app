import React from 'react'

import styles from './messageItem.module.css'

function MessageItem(props){
  const {message, fromUser} = props

  function timeFromString(utcString){
    const date = new Date(utcString)
    return date.toLocaleTimeString([], {hour12: false, hour: '2-digit', minute: '2-digit'})
  }

  return(
    <li className={`${styles.container} ${fromUser ? styles.fromUser : ""}`}>
      <div className={styles.blob}>
        <h2 className={styles.username}>{message.sourceName}</h2>
        <p className={styles.content}>{message.content}</p>
        <span className={styles.time}>{timeFromString(message.created)}</span>
      </div>
    </li>
  )
}

export default MessageItem