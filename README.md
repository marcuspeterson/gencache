# Gencache

## Usage

```
// default cache using a fifo index and map store
const cache = createCache();

// cache using redux store with LRU index
const store = createReduxStore();
const index = createLRUIndex();

const cache = createCache({
    store,
    index.
})
```

## Structure

gencache is built using 3 main composible parts:

### Store

Stores do exactly what they say - they store the cached data. There is no logic contained in stores and they expose a simple interface with get/put/remove which should act on the underlying data store. Examples might be a `Map` or using `redux`

### Index

Indexes are where a lot of the magic happens. You can consider the index to be the central brain of the cache. It is the index's responisbility to keep track of what items are in the cache and to handle re-ordering

### Cache

The cache object has the responsibilty of delegating calls to the store and the index, and also maintains and controls the configuration of the cache along with managing expiry
