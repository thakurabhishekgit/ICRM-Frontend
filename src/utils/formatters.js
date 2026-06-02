/**
 * Formats a number to currency USD representation.
 */
import { getPropertyThumbnailUrl, isValidPropertyThumbnail } from './propertyImages';

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '$0.00';
  const val = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (Number.isNaN(val)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(val);
};

export const PROPERTY_TYPE_OPTIONS = [
  { value: 1, label: 'Office' },
  { value: 2, label: 'Retail' },
  { value: 3, label: 'Warehouse' },
  { value: 4, label: 'Coworking' },
  { value: 5, label: 'Industrial' },
  { value: 6, label: 'Mixed Use' },
];

const PROPERTY_TYPE_LABELS = {
  1: 'Office',
  2: 'Retail',
  3: 'Warehouse',
  4: 'Coworking',
  5: 'Industrial',
  6: 'Mixed Use',
  Office: 'Office',
  Retail: 'Retail',
  Warehouse: 'Warehouse',
  Coworking: 'Coworking',
  Industrial: 'Industrial',
  MixedUse: 'Mixed Use',
};

export const getPropertyTypeName = (type) => {
  if (type === undefined || type === null) return 'Commercial Property';
  return PROPERTY_TYPE_LABELS[type] ?? PROPERTY_TYPE_LABELS[String(type)] ?? 'Commercial Property';
};

/** Normalize API/filter values to enum number (1–6). */
export const normalizePropertyType = (type) => {
  if (type === undefined || type === null || type === '') return null;
  if (typeof type === 'number' && !Number.isNaN(type)) return type;

  const str = String(type).trim();
  if (/^\d+$/.test(str)) return parseInt(str, 10);

  const byKey = {
    office: 1,
    retail: 2,
    warehouse: 3,
    coworking: 4,
    industrial: 5,
    mixeduse: 6,
  };
  const compact = str.toLowerCase().replace(/\s+/g, '');
  if (byKey[compact] !== undefined) return byKey[compact];

  const byLabel = PROPERTY_TYPE_OPTIONS.find(
    (o) => o.label.toLowerCase() === str.toLowerCase()
  );
  return byLabel?.value ?? null;
};

/** Match property against filter (supports API strings like "Office" and numeric filters). */
export const matchesPropertyTypeFilter = (propertyType, filterValue) => {
  if (!filterValue || filterValue === 'all') return true;
  const normalizedProperty = normalizePropertyType(propertyType);
  const normalizedFilter = normalizePropertyType(filterValue);
  if (normalizedProperty !== null && normalizedFilter !== null) {
    return normalizedProperty === normalizedFilter;
  }
  return (
    String(propertyType).toLowerCase() === String(filterValue).toLowerCase()
    || getPropertyTypeName(propertyType).toLowerCase() === String(filterValue).toLowerCase()
  );
};

export const APP_TIMEZONE = 'Asia/Kolkata';
export const APP_LOCALE = 'en-IN';

/** Parse API timestamps — .NET often returns UTC without a trailing Z. */
export const parseApiDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const str = String(value).trim();
  if (!str) return null;
  if (/^\d{4}-\d{2}-\d{2}T/.test(str) && !/[zZ]|[+-]\d{2}:\d{2}$/.test(str)) {
    const utc = new Date(`${str}Z`);
    return Number.isNaN(utc.getTime()) ? null : utc;
  }
  const date = new Date(str);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = parseApiDate(dateString);
    if (!date || date.getFullYear() <= 2000) return 'N/A';
    return date.toLocaleDateString(APP_LOCALE, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: APP_TIMEZONE,
    });
  } catch {
    return 'N/A';
  }
};

export const getOccupancyRate = (occupied, total) => {
  const occ = parseInt(occupied, 10) || 0;
  const tot = parseInt(total, 10) || 0;
  if (tot <= 0) return { label: '0%', percentage: 0 };
  const rate = Math.round((occ / tot) * 100);
  return {
    label: `${occ}/${tot} Units (${rate}%)`,
    percentage: rate,
  };
};

export const getLeaseRequestStatusProps = (status) => {
  const s = String(status ?? '').toLowerCase();
  if (s === 'approved' || s === '2') return { color: 'success', label: 'Approved' };
  if (s === 'rejected' || s === '3') return { color: 'error', label: 'Rejected' };
  return { color: 'warning', label: 'Pending' };
};

export const getLeaseStatusProps = (status) => {
  const s = String(status ?? '').toLowerCase();
  if (s === 'active' || s === '2') return { color: 'success', label: 'Active' };
  if (s === 'expired' || s === '3') return { color: 'default', label: 'Expired' };
  if (s === 'terminated' || s === '4') return { color: 'error', label: 'Terminated' };
  return { color: 'warning', label: 'Pending' };
};

export const isLeaseRequestPending = (status) => {
  const s = String(status ?? '').toLowerCase();
  return s === 'pending' || s === '1';
};

export const isLeaseRequestApproved = (status) => {
  const s = String(status ?? '').toLowerCase();
  return s === 'approved' || s === '2';
};

export const isLeasePending = (status) => {
  const s = String(status ?? '').toLowerCase();
  return s === 'pending' || s === '1';
};

export const isLeaseActive = (status) => {
  const s = String(status ?? '').toLowerCase();
  return s === 'active' || s === '2';
};

export const normalizeLeaseStatus = (status) => {
  const s = String(status ?? '').toLowerCase();
  if (s === 'active' || s === '2') return 'active';
  if (s === 'expired' || s === '3') return 'expired';
  if (s === 'terminated' || s === '4') return 'terminated';
  return 'pending';
};

export const normalizeRequestStatus = (status) => {
  const s = String(status ?? '').toLowerCase();
  if (s === 'approved' || s === '2') return 'approved';
  if (s === 'rejected' || s === '3') return 'rejected';
  return 'pending';
};

const isValidTimestamp = (value) => {
  const date = parseApiDate(value);
  return Boolean(date && date.getFullYear() > 2000);
};

export const formatDateTime = (dateString) => {
  const date = parseApiDate(dateString);
  if (!date || date.getFullYear() <= 2000) return 'N/A';
  return date.toLocaleString(APP_LOCALE, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: APP_TIMEZONE,
    timeZoneName: 'short',
  });
};

export const formatRelativeTime = (dateString) => {
  const date = parseApiDate(dateString);
  if (!date || date.getFullYear() <= 2000) return '';
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
  return formatDate(dateString);
};

export const getRoleLabel = (role) => {
  if (role === undefined || role === null) return 'Tenant';
  const roleStr = String(role).trim();
  if (roleStr === '0' || roleStr.toLowerCase() === 'tenant') return 'Tenant';
  if (roleStr === '1' || roleStr.toLowerCase() === 'agent') return 'Property Agent';
  if (roleStr === '2' || roleStr.toLowerCase() === 'admin') return 'System Admin';
  return roleStr;
};

export const buildPropertyPayload = (formData) => ({
  title: formData.title.trim(),
  description: formData.description.trim(),
  location: formData.location.trim(),
  price: parseFloat(formData.price),
  propertyType: parseInt(formData.propertyType, 10),
  totalUnits: parseInt(formData.totalUnits, 10),
  occupiedUnits: parseInt(formData.occupiedUnits, 10) || 0,
  monthlyMaintenanceCost: parseFloat(formData.monthlyMaintenanceCost) || 0,
  monthlyRevenue: parseFloat(formData.monthlyRevenue) || 0,
  roi: parseFloat(formData.roi) || 0,
  amenities: formData.amenities.trim(),
  thumbnailUrl: isValidPropertyThumbnail(formData.thumbnailUrl)
    ? formData.thumbnailUrl.trim()
    : getPropertyThumbnailUrl(null, formData.title?.trim() || 'property'),
});
