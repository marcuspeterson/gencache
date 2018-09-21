import { IIndex } from "../index/types";
import { IStore } from "../store/types";
import { ICache, ICacheConfig, ICacheOptions, IItem } from "./types";

export class Cache<K, V> implements ICache<K, V> {
  private cacheConfig: ICacheConfig<K, V>;
  private store: IStore<K, V>;
  private index: IIndex<K>;

  constructor(
    cacheConfig: ICacheConfig<K, V>,
    store: IStore<K, V>,
    index: IIndex<K>,
  ) {
    this.cacheConfig = cacheConfig;
    this.store = store;
    this.index = index;
  }

  // Public interface
  public get = (key: K): V => this.getMany([key])[0].value;
  public getMany = (keys: K[]): Array<IItem<K, V>> => {
    this.index.markGet(keys);
    return keys.map(key => ({ key, value: this.store.get(key) }));
  };

  public put = (key: K, value: V) => this.putMany([{ key, value }]);
  public putMany = (items: Array<IItem<K, V>>) => this.insert(items);

  public remove = (key: K) => this.removeMany([key]);
  public removeMany = (keys: K[]) => keys.map(key => this.store.delete(key));

  // private methods
  private insert = (items: Array<IItem<K, V>>) => {
    const numberToClear =
      this.index.getLength() + items.length - this.cacheConfig.capacity;
    if (numberToClear > 0) {
      const keysToRemove = this.index.clearLast(numberToClear);
      this.removeMany(keysToRemove);
    }
    items.map(item => this.store.put(item.key, item.value));
    this.index.addKeys(items.map(i => i.key));
  };
}
