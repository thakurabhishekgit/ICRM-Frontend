import {
  formatRelativeTime,
  formatDateTime,
  parseApiDate,
  normalizeLeaseStatus,
  normalizeRequestStatus,
  getLeaseStatusProps,
} from '../utils/formatters';

const withDisplayTime = (event) => ({
  ...event,
  time: formatRelativeTime(event.timestamp),
  dateTime: formatDateTime(event.timestamp),
});

const sortByNewest = (events) =>
  events
    .filter((e) => e.timestamp)
    .sort((a, b) => (parseApiDate(b.timestamp)?.getTime() ?? 0) - (parseApiDate(a.timestamp)?.getTime() ?? 0));

/** Build platform-wide activity feed from API collections. */
export const buildPlatformActivity = ({ users = [], properties = [], requests = [], leases = [] } = {}) => {
  const events = [];

  users.forEach((user) => {
    events.push({
      id: `user-${user.id}`,
      type: 'register',
      title: 'User Registered',
      description: `${user.fullName} joined as ${user.role}.`,
      timestamp: user.createdAt,
    });
  });

  properties.forEach((property) => {
    events.push({
      id: `property-${property.id}`,
      type: 'property',
      title: 'Property Listed',
      description: `${property.title} was added in ${property.location}.`,
      timestamp: property.createdAt || property.updatedAt,
    });
  });

  requests.forEach((request) => {
    events.push({
      id: `request-${request.id}`,
      type: 'request',
      title: 'Lease Request Submitted',
      description: `${request.tenant?.fullName || 'A tenant'} requested ${request.property?.title || 'a property'}.`,
      timestamp: request.requestedAt,
    });

    const status = normalizeRequestStatus(request.status);
    if (request.reviewedAt && status === 'approved') {
      events.push({
        id: `request-approved-${request.id}`,
        type: 'approved',
        title: 'Lease Request Approved',
        description: `${request.agent?.fullName || 'Agent'} approved ${request.tenant?.fullName}'s request for ${request.property?.title}.`,
        timestamp: request.reviewedAt,
      });
    }
    if (request.reviewedAt && status === 'rejected') {
      events.push({
        id: `request-rejected-${request.id}`,
        type: 'rejected',
        title: 'Lease Request Rejected',
        description: `Request for ${request.property?.title} was rejected.`,
        timestamp: request.reviewedAt,
      });
    }
  });

  leases.forEach((lease) => {
    const statusLabel = getLeaseStatusProps(lease.status).label;
    events.push({
      id: `lease-${lease.id}`,
      type: 'lease',
      title: 'Lease Created',
      description: `Lease for ${lease.property?.title} (${lease.tenant?.fullName}) — ${statusLabel}.`,
      timestamp: lease.createdAt,
    });

    if (normalizeLeaseStatus(lease.status) === 'active') {
      events.push({
        id: `lease-active-${lease.id}`,
        type: 'active',
        title: 'Lease Activated',
        description: `Lease for ${lease.property?.title} is now Active.`,
        timestamp: lease.createdAt,
      });
    }
  });

  return sortByNewest(events).slice(0, 20).map(withDisplayTime);
};

/** Notifications for a tenant — own requests, approvals, rejections, leases. */
export const buildTenantNotifications = (user, { requests = [], leases = [] } = {}, { limit = 12 } = {}) => {
  const events = [];

  requests.forEach((request) => {
    events.push({
      id: `request-${request.id}`,
      type: 'request',
      title: 'Lease Request Submitted',
      description: `You submitted a request for ${request.property?.title || 'a property'}.`,
      timestamp: request.requestedAt,
    });

    const status = normalizeRequestStatus(request.status);
    if (request.reviewedAt && status === 'approved') {
      events.push({
        id: `request-approved-${request.id}`,
        type: 'approved',
        title: 'Lease Request Approved',
        description: `${request.agent?.fullName || 'The agent'} approved your request for ${request.property?.title}.`,
        timestamp: request.reviewedAt,
      });
    }
    if (request.reviewedAt && status === 'rejected') {
      events.push({
        id: `request-rejected-${request.id}`,
        type: 'rejected',
        title: 'Lease Request Rejected',
        description: `Your request for ${request.property?.title} was rejected by ${request.agent?.fullName || 'the agent'}.`,
        timestamp: request.reviewedAt,
      });
    }
  });

  leases.forEach((lease) => {
    const statusLabel = getLeaseStatusProps(lease.status).label;
    events.push({
      id: `lease-${lease.id}`,
      type: 'lease',
      title: 'Lease Created',
      description: `A lease for ${lease.property?.title} was created (${statusLabel}).`,
      timestamp: lease.createdAt,
    });

    if (normalizeLeaseStatus(lease.status) === 'active') {
      events.push({
        id: `lease-active-${lease.id}`,
        type: 'active',
        title: 'Lease Activated',
        description: `Your lease for ${lease.property?.title} is now Active.`,
        timestamp: lease.updatedAt || lease.createdAt,
      });
    }
  });

  const typeMap = {
    request: { type: 'request', title: 'Lease Request Submitted' },
    approved: { type: 'approved', title: 'Lease Request Approved' },
    rejected: { type: 'rejected', title: 'Lease Request Rejected' },
    lease: { type: 'lease', title: 'Lease Update' },
    active: { type: 'lease', title: 'Lease Activated' },
  };

  return sortByNewest(events)
    .slice(0, limit)
    .map((item) => ({
      id: item.id,
      type: typeMap[item.type]?.type || item.type,
      title: typeMap[item.type]?.title || item.title,
      message: item.description,
      timestamp: item.timestamp,
      time: formatRelativeTime(item.timestamp),
      dateTime: formatDateTime(item.timestamp),
      read: false,
    }));
};

/** Notifications derived from the same real events (recent first). */
export const buildPlatformNotifications = (platformData, { limit = 12 } = {}) => {
  const activity = buildPlatformActivity(platformData);

  const typeMap = {
    register: { type: 'register', title: 'New User Registration' },
    property: { type: 'property', title: 'Property Listed' },
    request: { type: 'request', title: 'New Lease Request' },
    approved: { type: 'approved', title: 'Lease Request Approved' },
    rejected: { type: 'rejected', title: 'Lease Request Rejected' },
    lease: { type: 'lease', title: 'Lease Created' },
    active: { type: 'lease', title: 'Lease Activated' },
  };

  return activity.slice(0, limit).map((item) => ({
    id: item.id,
    type: typeMap[item.type]?.type || item.type,
    title: typeMap[item.type]?.title || item.title,
    message: item.description,
    timestamp: item.timestamp,
    time: item.time,
    dateTime: item.dateTime,
    read: false,
  }));
};

/** Activity scoped to a single user (admin user detail page). */
export const buildUserActivity = (user, { requests = [], leases = [], properties = [] } = {}) => {
  if (!user?.id) return [];

  const events = [];
  const role = String(user.role).toLowerCase();

  if (user.createdAt) {
    events.push({
      id: `user-${user.id}`,
      type: 'register',
      title: 'Account Created',
      description: `${user.fullName} registered as ${user.role}.`,
      timestamp: user.createdAt,
    });
  }

  if (role === 'tenant') {
    requests
      .filter((r) => r.tenant?.id === user.id)
      .forEach((request) => {
        events.push({
          id: `request-${request.id}`,
          type: 'request',
          title: 'Lease Request',
          description: `Submitted request for ${request.property?.title} (${normalizeRequestStatus(request.status)}).`,
          timestamp: request.requestedAt,
        });
      });

    leases
      .filter((l) => l.tenant?.id === user.id)
      .forEach((lease) => {
        events.push({
          id: `lease-${lease.id}`,
          type: normalizeLeaseStatus(lease.status) === 'active' ? 'active' : 'lease',
          title: `Lease — ${getLeaseStatusProps(lease.status).label}`,
          description: `${lease.property?.title} · ${formatDateTime(lease.createdAt)}`,
          timestamp: lease.createdAt,
        });
      });
  }

  if (role === 'agent') {
    properties
      .filter((p) => p.agent?.id === user.id)
      .forEach((property) => {
        events.push({
          id: `property-${property.id}`,
          type: 'property',
          title: 'Property Listed',
          description: `${property.title} in ${property.location}.`,
          timestamp: property.createdAt,
        });
      });

    requests
      .filter((r) => r.agent?.id === user.id && r.reviewedAt)
      .forEach((request) => {
        const status = normalizeRequestStatus(request.status);
        if (status === 'approved' || status === 'rejected') {
          events.push({
            id: `review-${request.id}`,
            type: status === 'approved' ? 'approved' : 'rejected',
            title: status === 'approved' ? 'Request Approved' : 'Request Rejected',
            description: `${request.property?.title} — ${request.tenant?.fullName}`,
            timestamp: request.reviewedAt,
          });
        }
      });
  }

  return sortByNewest(events).slice(0, 10).map(withDisplayTime);
};

export default {
  buildPlatformActivity,
  buildPlatformNotifications,
  buildTenantNotifications,
  buildUserActivity,
};
