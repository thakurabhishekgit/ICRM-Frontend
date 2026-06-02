/**
 * Formats a number to currency USD representation.
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '$0.00';
  const val = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(val)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(val);
};

/**
 * Returns clean labels for property type IDs.
 */
export const getPropertyTypeName = (type) => {
  const typeId = parseInt(type, 10);
  const types = {
    0: 'Office Space',
    1: 'Retail Storefront',
    2: 'Industrial Plant',
    3: 'Logistic Warehouse',
    4: 'Commercial Complex',
  };
  return types[typeId] ?? 'Commercial Property';
};

/**
 * Formats date string to standard local formats.
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    return 'N/A';
  }
};

/**
 * Generates an occupancy status string and percentage.
 */
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

/**
 * Normalizes user role naming from server.
 */
export const getRoleLabel = (role) => {
  if (role === undefined || role === null) return 'Tenant';
  const roleStr = String(role).trim();
  if (roleStr === '0' || roleStr.toLowerCase() === 'tenant') return 'Tenant';
  if (roleStr === '1' || roleStr.toLowerCase() === 'agent') return 'Property Agent';
  if (roleStr === '2' || roleStr.toLowerCase() === 'admin') return 'System Admin';
  return roleStr;
};
