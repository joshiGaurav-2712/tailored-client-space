
import React, { useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/LoginForm';
import { DashboardHeader } from '../components/DashboardHeader';
import { MetricsCards } from '../components/MetricsCards';
import { ProjectHealth } from '../components/ProjectHealth';
import { RecentTickets, RecentTicketsRef } from '../components/RecentTickets';
import { Timeline } from '../components/Timeline';
import { CommunicationCenter } from '../components/CommunicationCenter';
import { MobileProjectHealth } from '../components/MobileProjectHealth';
import { QuickActions } from '../components/QuickActions';
import { AppSidebar } from '../components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const recentTicketsRef = useRef<RecentTicketsRef>(null);

  const handleTicketCreated = () => {
    console.log('Ticket created, refreshing list...');
    recentTicketsRef.current?.refreshTickets();
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navigation Bar */}
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center justify-between px-4 sm:px-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div className="hidden sm:block">
                  <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
                  <p className="text-xs text-muted-foreground">Welcome back!</p>
                </div>
              </div>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Create Ticket</span>
                <span className="sm:hidden">New</span>
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-4 sm:p-6 space-y-6">
              {/* Welcome Section - Mobile */}
              <div className="sm:hidden bg-card rounded-lg border p-4">
                <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">Overview of your projects and tickets</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>

              {/* Overview Cards */}
              <div className="animate-fade-in">
                <MetricsCards />
              </div>

              {/* Recent Tickets - Full Width */}
              <div className="animate-fade-in delay-200">
                <RecentTickets ref={recentTicketsRef} />
              </div>

              {/* Mobile Accordion Sections */}
              <div className="animate-fade-in delay-300">
                <MobileProjectHealth />
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:grid lg:grid-cols-4 gap-6 animate-fade-in delay-400">
                {/* Project Health - Spans 2 columns */}
                <div className="lg:col-span-2">
                  <ProjectHealth />
                </div>

                {/* Quick Actions - 1 column */}
                <div className="lg:col-span-1">
                  <QuickActions />
                </div>

                {/* Timeline - 1 column */}
                <div className="lg:col-span-1">
                  <Timeline />
                </div>

                {/* Communication Center - Full width */}
                <div className="lg:col-span-4">
                  <CommunicationCenter />
                </div>
              </div>

              {/* Mobile Quick Actions */}
              <div className="lg:hidden animate-fade-in delay-500">
                <QuickActions />
              </div>

              {/* Mobile Communication Center */}
              <div className="lg:hidden animate-fade-in delay-600">
                <CommunicationCenter />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
