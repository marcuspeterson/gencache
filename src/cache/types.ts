import { IItem } from "../common/types";

export type ICache<K, V> = {
  getCapacity: () => number;
  setCapacity: (capacity: number) => void;
  put: (key: K, value: V, expiry?: number) => void;
  putMany: (values: Array<IItem<K, V>>) => void;
  get: (key: K) => V;
  getMany: (keys: K[]) => Array<IItem<K, V>>;
  remove: (key: K) => void;
  removeMany: (keys: K[]) => void;
};

export type CacheConfig = {
  capacity: number;
};
