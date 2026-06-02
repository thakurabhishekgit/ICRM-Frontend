export const unwrapResponse = (response) => {
  const body = response?.data;
  if (body && typeof body === 'object' && Object.prototype.hasOwnProperty.call(body, 'data')) {
    return body.data;
  }
  return body;
};

export const getApiErrorMessage = (error, fallback = 'Something went wrong') => {
  const data = error?.response?.data;
  if (!data) return error?.message || fallback;
  if (typeof data === 'string') return data;
  if (data.message) return data.message;
  if (data.title && data.errors) {
    const messages = Object.values(data.errors).flat();
    if (messages.length) return messages.join(' ');
  }
  if (data.errors && typeof data.errors === 'object') {
    const messages = Object.values(data.errors).flat();
    if (messages.length) return messages.join(' ');
  }
  return fallback;
};
