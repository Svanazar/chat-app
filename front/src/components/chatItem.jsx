import React from 'react'

function ChatItem(props){
  const {chat, isSelected, setSelected} = props

  function handleClick() {
    setSelected()
  }

  return (
    <li onClick={handleClick}>{chat.user1} and {chat.user2} {isSelected ? "(sel)" : ""} {chat.hasNew ? "(new)" : ""}</li>
  )
}

export default ChatItem