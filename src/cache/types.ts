import { IIndex } from "../index/types";
import { IStore, Store } from "../store/types";

export interface IItem<K, V> {
  key: K;
  value: V;
}

export interface ICache<K, V> {
  getCapacity: () => number;
  setCapacity: (capacity: number) => void;
  put: (key: K, value: V) => void;
  putMany: (values: Array<IItem<K, V>>) => void;
  get: (key: K) => V;
  getMany: (keys: K[]) => Array<IItem<K, V>>;
  remove: (key: K) => void;
  removeMany: (keys: K[]) => void;
}

export interface ICacheOptions {
  store: Store;
  capacity: number;
}

export interface ICacheConfig<K, V> {
  capacity: number;
}
