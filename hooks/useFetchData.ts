import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

export function useFetchData<T, E = any>(
  url: string,
  dependencies: unknown[] = [],
  config?: AxiosRequestConfig<T>,
  initial: boolean = true
): [T | null, boolean, E | null] {
  const [loading, setLoading] = useState<boolean>(initial);
  const [error, setError] = useState<E | null>(null);
  const [data, setData] = useState<T | null>(null);

  const shouldFetch = useRef<boolean>(initial);

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      if (shouldFetch.current) {
        const response: AxiosResponse<T> = await axios.get(url, config);
        const data: T = response.data;
        setData(data);
      } else {
        shouldFetch.current = true;
      }
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [data, loading, error];
}
