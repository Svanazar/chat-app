import './App.css';
import {SocketProvider} from './context/socketContext'
import {UserProvider} from './context/userContext'
import ChatManager from './components/chatManager'
import UserField from './components/userField'

function App() {
  return (
    <UserProvider>
      <SocketProvider>
        <UserField />
        <ChatManager />     
      </SocketProvider>
    </UserProvider>
  );
}

export default App;
