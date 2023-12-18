import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useCallback, useEffect, useState } from "react";

export function useFetchData<T, E = any>(
  url: string,
  dependencies: unknown[] = [],
  config?: AxiosRequestConfig<T>
): [T | null, boolean, E | null] {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<E | null>(null);
  const [data, setData] = useState<T | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const response: AxiosResponse<T> = await axios.get(url, config);
      const data: T = response.data;
      setData(data);
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
