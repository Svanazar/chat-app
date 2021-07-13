import React, {useState, useContext, useEffect} from 'react'
import UserField from './userField'
import SocketContext from '../context/socketContext'
import UserContext from '../context/userContext'

function UserAuthProvider(props){
  const {socket} = useContext(SocketContext)
  const [userData, setUserData] = useState({
    userId: null,
    username: null,
  })

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const listener = (data) => {
      setUserData(data)
      setIsLoggedIn(true)
    }
    socket.on('session', listener)
    

    return () => socket.off('session', listener)
  }, [socket])

  return (
    isLoggedIn
    ? <UserContext.Provider value={userData} {...props} />
    : <UserField />
  )
}

export default UserAuthProvider