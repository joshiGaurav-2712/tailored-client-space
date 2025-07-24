
import React, { useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/LoginForm';
import { DashboardHeader } from '../components/DashboardHeader';
import { MetricsCards } from '../components/MetricsCards';
import { ProjectHealth } from '../components/ProjectHealth';
import { RecentTickets, RecentTicketsRef } from '../components/RecentTickets';
import { Timeline } from '../components/Timeline';
import { CommunicationCenter } from '../components/CommunicationCenter';

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const recentTicketsRef = useRef<RecentTicketsRef>(null);

  const handleTicketCreated = () => {
    console.log('Ticket created, refreshing list...');
    recentTicketsRef.current?.refreshTickets();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome to Troopod Dashboard</h1>
              <p className="text-gray-600 mt-1">Overview of your projects and tickets</p>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()} - {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="animate-fade-in delay-200">
          <MetricsCards />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Recent Tickets (Full Width) */}
          <div className="lg:col-span-3">
            <div className="animate-fade-in delay-400">
              <RecentTickets ref={recentTicketsRef} />
            </div>
          </div>

          {/* Additional components can be added here */}
          <div className="lg:col-span-2 space-y-8">
            <div className="animate-fade-in delay-300">
              <ProjectHealth />
            </div>
          </div>

          <div className="space-y-8">
            <div className="animate-fade-in delay-500">
              <Timeline />
            </div>
            <div className="animate-fade-in delay-600">
              <CommunicationCenter />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
