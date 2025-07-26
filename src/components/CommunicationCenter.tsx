
import React, { useState } from 'react';
import { Calendar, MessageSquare, Bell, Send, Plus } from 'lucide-react';

interface Update {
  id: string;
  title: string;
  time: string;
  type: 'meeting' | 'document' | 'notification';
  read: boolean;
}

export const CommunicationCenter = () => {
  const [updates, setUpdates] = useState<Update[]>([
    {
      id: '1',
      title: 'Weekly progress meeting scheduled for April 10, 2025 at 2:00 PM',
      time: '2 hours ago',
      type: 'meeting',
      read: false
    },
    {
      id: '2',
      title: 'New requirements document added to the project files',
      time: 'yesterday',
      type: 'document',
      read: true
    },
    {
      id: '3',
      title: 'Payment Gateway API integration completed',
      time: '2 days ago',
      type: 'notification',
      read: true
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [showMessageInput, setShowMessageInput] = useState(false);

  const markAsRead = (updateId: string) => {
    setUpdates(updates.map(update => 
      update.id === updateId ? { ...update, read: true } : update
    ));
  };

  const scheduleeMeeting = () => {
    console.log('Opening meeting scheduler');
    // Add logic to open meeting scheduler modal/page
    const newUpdate: Update = {
      id: Date.now().toString(),
      title: 'New meeting scheduled for discussion',
      time: 'just now',
      type: 'meeting',
      read: false
    };
    setUpdates([newUpdate, ...updates]);
  };

  const contactSupport = () => {
    console.log('Opening support contact form');
    setShowMessageInput(true);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      // Add logic to send message to support
      const newUpdate: Update = {
        id: Date.now().toString(),
        title: `Support message sent: ${newMessage.substring(0, 50)}...`,
        time: 'just now',
        type: 'notification',
        read: false
      };
      setUpdates([newUpdate, ...updates]);
      setNewMessage('');
      setShowMessageInput(false);
    }
  };

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'document':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'notification':
        return <Bell className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const addUpdate = () => {
    const newUpdate: Update = {
      id: Date.now().toString(),
      title: 'New project update added',
      time: 'just now',
      type: 'notification',
      read: false
    };
    setUpdates([newUpdate, ...updates]);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Communication Center</h2>
        <button
          onClick={addUpdate}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center sm:justify-start py-2 sm:py-0"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Update
        </button>
      </div>
      
      {/* Latest Updates */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Latest Updates</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {updates.map((update) => (
            <div 
              key={update.id} 
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                update.read ? 'bg-gray-50' : 'bg-blue-50 border-l-4 border-blue-500'
              }`}
              onClick={() => markAsRead(update.id)}
            >
              <div className="flex items-start space-x-2">
                {getUpdateIcon(update.type)}
                <div className="flex-1">
                  <p className={`text-sm ${update.read ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
                    {update.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Posted {update.time}</p>
                </div>
                {!update.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      {showMessageInput && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message to support..."
            className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none"
            rows={3}
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={() => setShowMessageInput(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={sendMessage}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            >
              <Send className="h-3 w-3 mr-1" />
              Send
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <button 
            onClick={scheduleeMeeting}
            className="w-full flex items-center justify-center px-4 py-3 sm:py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm transition-colors touch-manipulation"
          >
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            Schedule Meeting
          </button>
          <button 
            onClick={contactSupport}
            className="w-full flex items-center justify-center px-4 py-3 sm:py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm transition-colors touch-manipulation"
          >
            <MessageSquare className="h-4 w-4 mr-2 text-gray-500" />
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};
