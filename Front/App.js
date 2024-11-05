import React from 'react';
import Navigation from './Navigation';
// import EditProfileScreen from './src/screens/EditProfileScreen.js';
// import ProfileScreen from './src/screens/ProfileScreen.js';
import { UserProvider } from './userContext.js';

export default function App() {
  return (
    <UserProvider>
      {/* <EditProfileScreen />
      <ProfileScreen /> */}
      <Navigation />;
    </UserProvider>
  );
}
