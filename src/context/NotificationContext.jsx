import { createContext, useContext, useState, useCallback, useMemo } from 'react';

export const MOCK_NOTIFICATIONS = [
  { id: '1', type: 'request', title: 'New Lease Request', message: 'A tenant submitted a lease request for Corporate Tower B.', time: '5m ago', read: false },
  { id: '2', type: 'approved', title: 'Lease Approved', message: 'Lease request for Metro Business Center was approved.', time: '1h ago', read: false },
  { id: '3', type: 'rejected', title: 'Lease Rejected', message: 'Lease request for Riverside Hub was rejected.', time: '2h ago', read: true },
  { id: '4', type: 'lease', title: 'Lease Created', message: 'A new lease contract was drafted successfully.', time: '3h ago', read: true },
  { id: '5', type: 'property', title: 'Property Created', message: 'Corporate Tower X was added to the portfolio.', time: '5h ago', read: true },
];

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const markRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead, markRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications requires NotificationProvider');
  return ctx;
};

export default NotificationProvider;
