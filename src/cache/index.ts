import { IIndex } from "../index/types";
import { IStore } from "../store/types";
import { ICache, ICacheConfig } from "./types";
import { IItem } from "../common/types";
import { performance } from "perf_hooks";

export class Cache<K, V> implements ICache<K, V> {
  private cacheConfig: ICacheConfig;
  private store: IStore<K, V>;
  private index: IIndex<K>;

  constructor(
    cacheConfig: ICacheConfig,
    store: IStore<K, V>,
    index: IIndex<K>,
  ) {
    this.cacheConfig = cacheConfig;
    this.store = store;
    this.index = index;
  }

  // #region Public interface
  public getCapacity = () => this.cacheConfig.capacity;
  public setCapacity = (capacity: number) => {
    this.cacheConfig.capacity = capacity;
    const numberToClear = this.index.getLength() - this.cacheConfig.capacity;
    if (numberToClear > 0) {
      const keysToRemove = this.index.removeLast(numberToClear);
      this.delete(keysToRemove);
    }
  };

  public get = (key: K): V => {
    const value = this.getMany([key])[0];
    return value ? value.value : null;
  };
  public getMany = (keys: K[]): Array<IItem<K, V>> => this.retrieve(keys);

  public put = (key: K, value: V, ttl: number) =>
    this.putMany([{ key, value, expiry: ttl ? Date.now() + ttl : null }]);
  public putMany = (items: Array<IItem<K, V>>) => this.insert(items);

  public remove = (key: K) => this.removeMany([key]);
  public removeMany = (keys: K[]) => this.delete(keys);
  // #endregion

  // #region Private methods
  private insert = (items: Array<IItem<K, V>>) => {
    const { capacity } = this.cacheConfig;
    const numberToClear = this.index.getLength() + items.length - capacity;

    if (numberToClear > 0) {
      const keysToRemove = this.index.removeLast(numberToClear);
      this.removeMany(keysToRemove);
    }

    if (items.length > capacity) {
      items.splice(capacity);
    }

    items.map(item => this.store.put(item));
    this.index.addKeys(items.map(i => i.key));
  };

  private delete = (keys: K[]) => {
    this.index.removeKeys(keys);
    keys.map(key => this.store.delete(key));
  };

  private retrieve = (keys: K[]): Array<IItem<K, V>> => {
    this.index.markGet(keys);

    const expiredKeys: K[] = [];
    const items = keys.reduce((acc, key) => {
      const item = this.store.get(key) || { key, value: null };
      if (item.expiry && item.expiry < Date.now()) {
        item.value = null;
        expiredKeys.push(key);
      }
      acc.push(item);
      return acc;
    }, []);

    if (expiredKeys.length) {
      this.index.removeKeys(expiredKeys);
    }
    return items;
  };
  // #endregion
}
