import type { SessionStatus } from "~/types/sessionControl";
import type { ResourceCategory, StatusType } from "~/types/detectionsControl";

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

export function getModificatorByCategory(category: ResourceCategory): string {
  switch (category) {
    case 'Экстремизм':
      return 'extremism'
    case 'Наркотики':
      return 'drugs'
    default:
      return ''
  }
}

export function getStatusType(status: StatusType): string {
  switch (status) {
    case 'blocked':
      return 'Заблокировано'
    case 'blocking':
      return 'Рекомендуется блокировка'
    case 'verification':
      return 'Требуется проверка'
    default:
      return ''
  }
}

export function getBadgeClassByStatus(status: SessionStatus): string {
  switch (status) {
    case ('allowed'):
      return 'session-status-badge_greeen'
    case ('ban'):
      return 'session-status-badge_red'
    case ('waiting'):
      return 'session-status-badge_yellow'
    default:
      return ''
  }
}

export function getStatusText(status: SessionStatus): string {
  switch (status) {
    case ('allowed'):
      return 'Разрешен'
    case ('ban'):
      return 'Запрещён'
    case ('waiting'):
      return 'Ожидает'
    default:
      return ''
  }
}

export const getNgfwBadgeClass = (ngfw: number) => {
  return `sessions__table-cell__badge sessions__table-cell__badge--${ngfw}`;
};

export const getCurrentDateWithOffset = (
  offset: number = 0,
  unit: 'ms' | 's' | 'm' | 'h' | 'd' = 'ms'
): Date => {
  const multipliers = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  } as const;

  return new Date(Date.now() + offset * multipliers[unit]);
};