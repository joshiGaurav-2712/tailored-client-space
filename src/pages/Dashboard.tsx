
import React from 'react';
import { DashboardHeader } from '../components/DashboardHeader';
import { MetricsCards } from '../components/MetricsCards';
import { ProjectHealth } from '../components/ProjectHealth';
import { RecentTickets } from '../components/RecentTickets';
import { Timeline } from '../components/Timeline';
import { CommunicationCenter } from '../components/CommunicationCenter';

const Dashboard = () => {
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
              <h1 className="text-2xl font-bold text-gray-900">Welcome to BSC Dashboard</h1>
              <p className="text-gray-600 mt-1">Overview of your projects and tickets</p>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: April 8, 2025 - 10:45 AM
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="animate-fade-in delay-200">
          <MetricsCards />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Project Health & Recent Tickets */}
          <div className="lg:col-span-2 space-y-8">
            <div className="animate-fade-in delay-300">
              <ProjectHealth />
            </div>
            <div className="animate-fade-in delay-400">
              <RecentTickets />
            </div>
          </div>

          {/* Right Column - Timeline & Communication */}
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
