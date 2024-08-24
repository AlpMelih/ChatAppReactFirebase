// src/App.tsx
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import Auth from './Auth';
import Chat from './Chat';

const App: React.FC = () => {
  const [user] = useAuthState(auth);

  return (
    <div>
      {user ? <Chat /> : <Auth />}
    </div>
  );
};

export default App;
