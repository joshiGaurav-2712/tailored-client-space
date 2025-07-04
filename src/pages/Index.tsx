
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import Dashboard from './Dashboard';

const Index = () => {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
};

export default Index;
