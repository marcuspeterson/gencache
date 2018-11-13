import { CacheOptions } from "./config/types";
import { createMapStore } from "./store/map";
import { StoreType, IStore } from "./store/types";
import { IndexType, IIndex } from "./index/types";
import { createFifoIndex } from "./index/fifo";
import { ICache } from "./cache/types";
import { Cache } from "./cache";

const defaultOptions: CacheOptions = {
  capacity: 50,
  storeType: "map",
  indexType: "fifo",
};

const getStore = <K, V>(storeType: StoreType): IStore<K, V> => {
  switch (storeType) {
    case "map":
      return createMapStore();
    default:
      throw new Error(`Unsuported store type: ${storeType}`);
  }
};

const getIndex = <K>(indexType: IndexType): IIndex<K> => {
  switch (indexType) {
    case "fifo":
      return createFifoIndex();
    default:
      throw new Error(`Unsuported index type: ${indexType}`);
  }
};

export const createCache = <K, V>(options?: CacheOptions): ICache<K, V> => {
  const opts: CacheOptions = Object.assign({}, defaultOptions, options);

  const store: IStore<K, V> = getStore(opts.storeType);
  const index: IIndex<K> = getIndex(opts.indexType);

  return new Cache(opts, store, index);
};

export { CacheOptions };
export { ICache };
