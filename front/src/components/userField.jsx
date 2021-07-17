import React, {useState, useEffect, useContext} from 'react'
import SocketContext from '../context/socketContext'

import styles from './userField.module.css'

function UserField(props) {
  const {socket} = useContext(SocketContext)
  const [username, setUsername] = useState("")
  const [mode, setMode] = useState('login')
  const [reqStatus, setReqStatus] = useState('idle')

  useEffect(() => {
    if(reqStatus === 'begin' && mode === 'login'){
      socket.auth = {username}
      socket.connect()
      setReqStatus('loading')
    }
  }, [socket, username, mode, reqStatus])
  
  useEffect(() => {
    async function fetchData(){
      if(reqStatus === 'begin' && mode === 'register'){
        setReqStatus('loading')
        try{
          const resp = await fetch('/api/user', {
            method: 'POST',
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify({username})
          })
          if(resp.ok) {
            setMode('login')
            setReqStatus('succeeded')
          }
          else {
            const reason = await resp.json()
            console.log("unable to register", reason)
            setReqStatus('failed')
          }
        } catch(e){
          console.log("http error", e)
          setReqStatus('failed')
        }
      }
    }
    fetchData()
  }, [socket, username, mode, reqStatus])

  useEffect(() => {
    const listener = (err) => {
      setReqStatus('failed')
      console.log("connection error", err.message)
    }
    socket.on('connect_error', listener)

    return socket.off('connect_error', listener)
  }, [socket])

  function handleInputChange(e){
    setUsername(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setReqStatus('begin')
  }

  function toggleMode(e){
    if(mode === 'login') setMode('register')
    else if(mode === 'register') setMode('login')
  }

  return (
    <div className={styles.container}>
    <div className={styles.header}>
      <h2>{mode === 'login' ? "Welcome Back!" : "New User!"}</h2>
    </div>
    <form onSubmit={handleSubmit}>
      <label>
        Enter Username
      </label>
      <input className={styles.userInput} required type="text" value={username} onChange={handleInputChange} />
    </form>
    <div className={styles.footerRow}>
      <button className={styles.toggleButton} onClick={toggleMode}>
        {mode === 'login' ? "Create New Account" : "Back"}
      </button>
      <button className={styles.submitButton} onClick={handleSubmit}>
        {mode === 'login' ? "Login" : "Register"}
      </button>
    </div>
    </div>
  )
}

export default UserField