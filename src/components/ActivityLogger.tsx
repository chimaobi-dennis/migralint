import { useState, useEffect } from 'react';

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  description: string;
  stepId?: string;
  stepTitle?: string;
  type: 'program' | 'document' | 'form' | 'step' | 'account' | 'other';
}

const ACTIVITY_STORAGE_KEY = 'user_activity_log';

export const useActivityLogger = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const savedActivities = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    }
  }, []);

  const logActivity = (activity: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newActivity: ActivityLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...activity
    };

    const updatedActivities = [newActivity, ...activities].slice(0, 100); // Keep last 100 activities
    setActivities(updatedActivities);
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(updatedActivities));
  };

  const clearActivities = () => {
    setActivities([]);
    localStorage.removeItem(ACTIVITY_STORAGE_KEY);
  };

  return {
    activities,
    logActivity,
    clearActivities
  };
};