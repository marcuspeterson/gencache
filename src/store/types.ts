export interface IStore<K, V> {
  put: (key: K, value: V) => void;
  get: (key: K) => V;
  delete: (key: K) => boolean;
}

export type StoreType = "map" | "redux";
