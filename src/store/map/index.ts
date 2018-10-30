import { IStore } from "../types";
import { IItem } from "../../common/types";

export const createMapStore = <K, V>(): IStore<K, V> => {
  const map = new Map<K, IItem<K, V>>();
  return {
    delete: (key: K): boolean => map.delete(key),
    get: (key: K): IItem<K, V> => map.get(key) || null,
    put: (item: IItem<K, V>): void => {
      map.set(item.key, item);
    },
  };
};
