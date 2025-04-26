
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { differenceInDays, differenceInHours, parseISO } from 'date-fns';

export interface Sample {
  id: number;
  number: string;
  product: string;
  readyTime: string;
  fabrication: string;
  dlc: string;
  smell: string;
  texture: string;
  taste: string;
  aspect: string;
  ph: string;
  enterobacteria: string;
  yeastMold: string;
  createdAt: string;
  modifiedAt: string;
  status: 'pending' | 'inProgress' | 'completed';
  assignedTo?: string;
  modifiedBy?: string;
}

interface Notification {
  id: string;
  sampleId: number;
  sampleNumber: string;
  message: string;
  type: 'info' | 'warning' | 'urgent';
  createdAt: string;
  read: boolean;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load notifications from localStorage
  useEffect(() => {
    const storedNotifications = localStorage.getItem('qc_notifications');
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }
  }, []);

  // Save notifications to localStorage when they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('qc_notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  // Check for pending samples that need notifications
  useEffect(() => {
    const checkSamples = () => {
      try {
        const storedAnalysis = localStorage.getItem('savedAnalysis');
        if (!storedAnalysis) return;

        const { samples } = JSON.parse(storedAnalysis);
        const currentDate = new Date();
        
        samples.forEach((sample: Sample) => {
          if (!sample.createdAt) return;
          
          const sampleDate = parseISO(sample.createdAt);
          const hoursSince = differenceInHours(currentDate, sampleDate);
          const daysSince = differenceInDays(currentDate, sampleDate);
          
          // Check for enterobacteria notification (24h)
          if (hoursSince >= 24 && !sample.enterobacteria && !notifications.some(n => 
            n.sampleId === sample.id && n.type === 'warning' && !n.read)) {
            addNotification({
              sampleId: sample.id,
              sampleNumber: sample.number,
              message: `L'échantillon ${sample.number} (${sample.product}) nécessite une analyse des entérobactéries (24h écoulées)`,
              type: 'warning'
            });
          }
          
          // Check for yeast/mold notification (5 days)
          if (daysSince >= 5 && !sample.yeastMold && !notifications.some(n => 
            n.sampleId === sample.id && n.type === 'urgent' && !n.read)) {
            addNotification({
              sampleId: sample.id,
              sampleNumber: sample.number,
              message: `URGENT: L'échantillon ${sample.number} (${sample.product}) nécessite une analyse des levures/moisissures (5 jours écoulés)`,
              type: 'urgent'
            });
          }
        });
      } catch (error) {
        console.error('Error checking samples for notifications:', error);
      }
    };

    // Check immediately and then every 30 minutes
    checkSamples();
    const interval = setInterval(checkSamples, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user, notifications]);

  const addNotification = ({ 
    sampleId, 
    sampleNumber, 
    message, 
    type = 'info' 
  }: {
    sampleId: number;
    sampleNumber: string;
    message: string;
    type?: 'info' | 'warning' | 'urgent';
  }) => {
    const newNotification: Notification = {
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sampleId,
      sampleNumber,
      message,
      type,
      createdAt: new Date().toISOString(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast notification
    toast({
      title: type === 'urgent' ? 'Notification urgente' : 'Notification',
      description: message,
      variant: type === 'urgent' ? 'destructive' : 'default'
    });
    
    return newNotification.id;
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  };
};
