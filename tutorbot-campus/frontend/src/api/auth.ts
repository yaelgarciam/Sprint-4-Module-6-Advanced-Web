const TOKEN_KEY = 'jwt';

type LoginResponse = {
  token: string;
};

type JwtPayload = {
  studentId?: string;
  sub?: string;
  preferred_username?: string;
};

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return atob(padded);
}

export async function login(studentId: string, password: string): Promise<string> {
  const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ studentId, password }),
  });

  if (!res.ok) {
    const message = res.status === 401 ? 'Invalid credentials.' : 'Unable to sign in.';
    throw new Error(message);
  }

  const payload = (await res.json()) as LoginResponse;
  localStorage.setItem(TOKEN_KEY, payload.token);
  return payload.token;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('tutorbot-session');
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

export function getJwtPayload(): JwtPayload | null {
  const token = getToken();
  if (!token) return null;

  try {
    const [, payload] = token.split('.');
    return JSON.parse(decodeBase64Url(payload)) as JwtPayload;
  } catch {
    return null;
  }
}

export function getStudentIdFromToken(): string {
  const payload = getJwtPayload();
  return payload?.studentId || payload?.sub || payload?.preferred_username || 'A00835001';
}
