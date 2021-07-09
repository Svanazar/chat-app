import './App.css';
import {SocketProvider} from './context/socketContext'
import {UserProvider} from './context/userContext'
import ChatList from './components/chatList'
import UserField from './components/userField'

function App() {
  return (
    <UserProvider>
      <SocketProvider>
        <UserField />
        <ChatList />     
      </SocketProvider>
    </UserProvider>
  );
}

export default App;
