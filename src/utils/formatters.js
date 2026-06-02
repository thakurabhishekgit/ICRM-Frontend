/**
 * Formats a number to currency USD representation.
 */
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

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
  thumbnailUrl: formData.thumbnailUrl.trim(),
});
