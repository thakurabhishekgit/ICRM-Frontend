import { useState, useEffect, useCallback } from 'react';
import { getApiErrorMessage } from '../utils/apiHelpers';

const useFetch = (fetchFn, deps = [], { immediate = true } = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
      return result;
    } catch (err) {
      setError(getApiErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    if (immediate) {
      refetch().catch(() => {});
    }
  }, [refetch, immediate]);

  return { data, loading, error, refetch, setData };
};

export default useFetch;
