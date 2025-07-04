
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from './Dashboard';

const Index = () => {
  return (
    <AuthProvider>
      <Dashboard />
      <Toaster />
    </AuthProvider>
  );
};

export default Index;
