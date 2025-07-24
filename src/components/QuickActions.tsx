import React from 'react';
import { Plus, Search, FileText, MessageCircle, BarChart, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const QuickActions = () => {
  const actions = [
    {
      title: 'New Ticket',
      description: 'Create a new support ticket',
      icon: Plus,
      onClick: () => console.log('Create new ticket'),
      className: 'bg-primary text-primary-foreground hover:bg-primary/90',
    },
    {
      title: 'Search',
      description: 'Find tickets and projects',
      icon: Search,
      onClick: () => console.log('Open search'),
      className: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    },
    {
      title: 'Reports',
      description: 'View analytics dashboard',
      icon: BarChart,
      onClick: () => console.log('View reports'),
      className: 'bg-accent text-accent-foreground hover:bg-accent/90',
    },
    {
      title: 'Messages',
      description: 'Check team communications',
      icon: MessageCircle,
      onClick: () => console.log('Open messages'),
      className: 'bg-muted text-muted-foreground hover:bg-muted/90',
    },
    {
      title: 'Calendar',
      description: 'View upcoming deadlines',
      icon: Calendar,
      onClick: () => console.log('Open calendar'),
      className: 'bg-card text-card-foreground hover:bg-card/90 border',
    },
    {
      title: 'Documentation',
      description: 'Access project docs',
      icon: FileText,
      onClick: () => console.log('Open docs'),
      className: 'bg-card text-card-foreground hover:bg-card/90 border',
    },
  ];

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action, index) => (
          <Button
            key={action.title}
            variant="ghost"
            className={`w-full justify-start h-auto p-3 ${action.className}`}
            onClick={action.onClick}
          >
            <action.icon className="h-5 w-5 mr-3 flex-shrink-0" />
            <div className="text-left min-w-0">
              <div className="font-medium truncate">{action.title}</div>
              <div className="text-xs opacity-70 truncate">{action.description}</div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};