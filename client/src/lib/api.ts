import { supabase } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  
  let token = session?.access_token;
  if (!token) {
    const localDemoToken = localStorage.getItem('careerpilot_demo_token');
    if (localDemoToken) {
      token = localDemoToken;
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = data.error || data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data as T;
}
