import { IStore } from "../types";

export const createMapStore = <K, V>(): IStore<K, V> => {
  const map = new Map<K, V>();
  return {
    delete: (key: K): boolean => map.delete(key),
    get: (key: K): V => map.get(key) || null,
    put: (key: K, value: V): void => {
      map.set(key, value);
    },
  };
};
