import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { getAdminDashboardStats } from '../services/adminService';
import { buildPlatformNotifications, buildTenantNotifications } from '../services/activityService';
import leaseRequestService from '../api/services/leaseRequestService';
import leaseService from '../api/services/leaseService';
import { parseApiDate } from '../utils/formatters';
import { normalizeRole } from '../utils/roleRoutes';

const READ_STORAGE_KEY = 'ircm_read_notification_ids';
const POLL_INTERVAL_MS = 45000;

const loadReadIds = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(READ_STORAGE_KEY) || '[]'));
  } catch {
    return new Set();
  }
};

const saveReadIds = (ids) => {
  localStorage.setItem(READ_STORAGE_KEY, JSON.stringify([...ids]));
};

const applyReadState = (items) => {
  const readIds = loadReadIds();
  return items.map((n) => ({
    ...n,
    read: readIds.has(n.id) || (Date.now() - (parseApiDate(n.timestamp)?.getTime() ?? Date.now()) > 7 * 86400000),
  }));
};

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshNotifications = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setNotifications([]);
      return;
    }

    setLoading(true);
    try {
      const role = normalizeRole(user.role);
      let items = [];

      if (role === 'tenant') {
        const [requests, leases] = await Promise.all([
          leaseRequestService.getMyRequests(),
          leaseService.getMyLeases(),
        ]);
        items = buildTenantNotifications(user, { requests, leases });
      } else if (role === 'agent') {
        const stats = await getAdminDashboardStats();
        items = buildPlatformNotifications({
          users: [],
          properties: stats.properties.filter((p) => p.agent?.id === user.id),
          requests: stats.requests.filter((r) => r.agent?.id === user.id),
          leases: stats.leases.filter((l) => l.agent?.id === user.id),
        });
      } else {
        const stats = await getAdminDashboardStats();
        items = buildPlatformNotifications(stats);
      }

      setNotifications(applyReadState(items));
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id, user?.role, user?.fullName]);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  useEffect(() => {
    if (!isAuthenticated) return undefined;

    const onFocus = () => refreshNotifications();
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);

    const interval = setInterval(refreshNotifications, POLL_INTERVAL_MS);

    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
      clearInterval(interval);
    };
  }, [isAuthenticated, refreshNotifications]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const markAllRead = useCallback(() => {
    const readIds = loadReadIds();
    notifications.forEach((n) => readIds.add(n.id));
    saveReadIds(readIds);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, [notifications]);

  const markRead = useCallback((id) => {
    const readIds = loadReadIds();
    readIds.add(id);
    saveReadIds(readIds);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, loading, markAllRead, markRead, refreshNotifications }}>
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
