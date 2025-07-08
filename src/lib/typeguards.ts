import { AxiosError, isAxiosError } from 'axios';

interface ApiErrorData {
  message: string;
}

export function isApiError(
  error: unknown,
): error is AxiosError<ApiErrorData> & { response: { data: ApiErrorData } } {
  if (
    !error ||
    !isAxiosError(error) ||
    !error.response ||
    !error.response.data
  ) {
    return false;
  }

    const data = error.response.data;
  return (
    typeof data === 'object' &&
    data !== null &&
    'message' in data &&
        typeof (data as ApiErrorData).message === 'string'
  );
}
