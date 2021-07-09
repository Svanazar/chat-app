import React, {useState} from 'react'

const UserContext = React.createContext()

function UserProvider(props) {
  const [user, setUser] = useState('')
  return <UserContext.Provider value={{user, setUser}} {...props} />
}

export default UserContext
export {UserProvider}