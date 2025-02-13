import { useState, useEffect } from 'react';

interface ApiResponse {
  message?: string;
  status?: string;
}

export const ApiTest = () => {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        const res = await fetch('/health');
        const data = await res.json();
        setResponse(data);
        setError(null);
      } catch (err) {
        setError('Failed to connect to API');
        console.error(err);
      }
    };

    testApi();
  }, []);

  return (
    <div>
      <h2>API Test</h2>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : response ? (
        <p>API Status: {response.status || response.message}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}; 