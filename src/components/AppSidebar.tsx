import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  TicketPlus, 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  Settings,
  FolderOpen
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const navigationItems = [
  { title: 'Dashboard', url: '/', icon: Home },
  { title: 'All Tickets', url: '/tickets', icon: FolderOpen },
  { title: 'Create Ticket', url: '/create', icon: TicketPlus },
  { title: 'Calendar', url: '/calendar', icon: Calendar },
  { title: 'Messages', url: '/messages', icon: MessageSquare },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? 'bg-primary/10 text-primary font-medium border-r-2 border-primary' 
      : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground';

  return (
    <Sidebar
      className={`transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} border-r`}
      collapsible="icon"
    >
      <SidebarContent className="bg-background">
        {/* Logo/Brand Section */}
        <div className={`p-4 border-b ${collapsed ? 'px-2' : 'px-4'}`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">T</span>
            </div>
            {!collapsed && (
              <span className="font-bold text-lg text-foreground">Troopod</span>
            )}
          </div>
        </div>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}