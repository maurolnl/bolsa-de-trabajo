export enum LSKeys {
  LOCATION_AFTER_LOGOUT = "location-after-logout",
  ACCESS_TOKEN = "access-token",
}

export const LOCAL_STORAGE_KEYS: Record<LSKeys, string> = {
  [LSKeys.LOCATION_AFTER_LOGOUT]: "location-after-logout",
  [LSKeys.ACCESS_TOKEN]: "access-token",
} as const;

const storage = window.localStorage;

export const LocalStorage = {
  get: <T>(key: LSKeys): T | null => {
    const item = storage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  set: <T>(key: LSKeys, value: T): void => {
    storage.setItem(key, JSON.stringify(value));
  },
  remove: (key: LSKeys): void => {
    storage.removeItem(key);
  },
};
