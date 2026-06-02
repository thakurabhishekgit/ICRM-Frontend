/**
 * Safely decodes a JWT token payload.
 * Handles Unicode strings correctly.
 * @param {string} token - The JWT token
 * @returns {object|null} - Decoded payload or null if invalid
 */
export const parseJwt = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error decoding JWT token:', e);
    return null;
  }
};

/**
 * Extracts standard claims (id, email, name, role) from a decoded token
 * @param {string} token 
 * @returns {object|null}
 */
export const extractUserFromToken = (token) => {
  const payload = parseJwt(token);
  if (!payload) return null;

  // ASP.NET Core Identity often uses standard schema URLs for claims
  const id = payload.nameid || payload.sub || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
  const email = payload.email || payload.unique_name || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
  const fullName = payload.fullName || payload.name || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || email?.split('@')[0] || 'User';
  
  // Extract role
  let role = payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  
  // Handle array of roles (if multiple, grab first one)
  if (Array.isArray(role)) {
    role = role[0];
  }

  // Normalize role to: 'Tenant', 'Agent', 'Admin'
  let normalizedRole = 'Tenant';
  if (role) {
    const roleStr = String(role).trim().toLowerCase();
    if (roleStr === 'admin' || roleStr === '2') {
      normalizedRole = 'Admin';
    } else if (roleStr === 'agent' || roleStr === '1') {
      normalizedRole = 'Agent';
    } else if (roleStr === 'tenant' || roleStr === '0') {
      normalizedRole = 'Tenant';
    } else {
      normalizedRole = role; // fallback
    }
  }

  return {
    id,
    email,
    fullName,
    role: normalizedRole,
    token
  };
};
