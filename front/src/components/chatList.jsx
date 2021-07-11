import React from 'react'
import ChatCreateField from './chatCreateField'

function ChatList(props){
  const {chats, append} = props
  return (
    <ul className="chatList">
      <ChatCreateField append={append} />
      {chats}
    </ul>
  )
}

export default ChatList