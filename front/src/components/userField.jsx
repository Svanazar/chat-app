import React, {useState, useContext} from 'react'
import UserContext from '../context/userContext'

function UserField(props) {
  const [username, setUsername] = useState("")
  const {user, setUser} = useContext(UserContext)

  function handleInputChange(e){
    setUsername(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if(username.length > 0) setUser(username)
  }
  if(user) return null
  
  return (
    <>
    <form onSubmit={handleSubmit}>
      <label>
        username:
        <input type="text" value={username} onChange={handleInputChange} />
      </label>
      <input type="submit" value="Change User"/>
    </form>
    </>
  )
}

export default UserField