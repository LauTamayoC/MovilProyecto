import React from 'react';
import Navigation from './Navigation';
import { UserProvider } from './userContext.js';

export default function App() {
  return (
    <UserProvider>
      <Navigation />;
    </UserProvider>
  );
}
