import './App.css';
import {SocketProvider} from './context/socketContext'
import ChatManager from './components/chatManager'
import UserAuthProvider from './components/userAuthProvider'

function App() {
  return (
    <SocketProvider>
      <UserAuthProvider>
        <ChatManager />     
      </UserAuthProvider>
    </SocketProvider>
  );
}

export default App;
