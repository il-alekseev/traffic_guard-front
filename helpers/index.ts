export const getTokenHeaders = (token: string): {
  headers: {
    Authorization: string;
  };} => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export const getLogoutTokenHeaders = ( token: string, refreshToken: string): {
  headers: {
    Authorization: string;
    'X-Refresh-Token': string;
  };
} => ({
  headers: {
    Authorization: `Bearer ${token}`,
    'X-Refresh-Token': refreshToken,
  },
});


export const getRefreshTokenHeaders = (refreshToken: string): {
  headers: {
    'X-Refresh-Token': string;
  };
} => ({
  headers: {
    'X-Refresh-Token': refreshToken,
  },
});
export const getTempPassword = (): string => {
  const length = 12;

  const sets = {
    lower: 'abcdefghijklmnopqrstuvwxyz',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    number: '0123456789',
    special: '!@#$%^&*()-_=+[]{};:,.<>?',
  };

  const all = Object.values(sets).join('');
  const getRandomChar = (str: string) =>
    str[crypto.getRandomValues(new Uint32Array(1))[0] % str.length];

  const base = Object.values(sets).map(getRandomChar);

  const rest = Array.from({ length: length - base.length }, () => getRandomChar(all));

  return [...base, ...rest].sort(() => crypto.getRandomValues(new Uint8Array(1))[0] - 128).join('');
};
export const getFormattedDatetime = (datetime: string | undefined): string => {
  if (datetime === undefined) return '–';
  const date = new Date(datetime);

  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};
export function isTokenExpiringSoon(thresholdMs: number = 60 * 1000): boolean {
  if (!process) return false;

  const tokenExpRaw = localStorage.getItem("auth_token_exp");

  if (!tokenExpRaw) return true;

  const tokenExp = parseInt(tokenExpRaw);
  const now = Date.now();

  return tokenExp < now + thresholdMs;
}

export function getJwtExpMs(token: string | null | undefined): number | null {
  if (!token) return null;
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return typeof json?.exp === "number" ? json.exp * 1000 : null;
  } catch {
    return null;
  }
}