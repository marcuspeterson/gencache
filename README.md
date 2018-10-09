### Gencache

Stores should be dumb, put, pull and get, no ordering logic or fetching logic
Caches should maintain a stack of keys

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
