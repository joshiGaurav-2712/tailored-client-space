
import React from 'react';
import { DashboardHeader } from '../components/DashboardHeader';
import { MetricsCards } from '../components/MetricsCards';
import { ProjectHealth } from '../components/ProjectHealth';
import { RecentTickets } from '../components/RecentTickets';
import { Timeline } from '../components/Timeline';
import { CommunicationCenter } from '../components/CommunicationCenter';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
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
        <MetricsCards />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Project Health & Recent Tickets */}
          <div className="lg:col-span-2 space-y-8">
            <ProjectHealth />
            <RecentTickets />
          </div>

          {/* Right Column - Timeline & Communication */}
          <div className="space-y-8">
            <Timeline />
            <CommunicationCenter />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
