import { IItem } from "../common/types";

export interface IStore<K, V> {
  put: (item: IItem<K, V>) => void;
  get: (key: K) => IItem<K, V>;
  delete: (key: K) => boolean;
}

export type StoreType = "map" | "redux";
