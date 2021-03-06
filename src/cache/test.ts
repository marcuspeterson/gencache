import { IIndex } from "../index/types";
import { IStore } from "../store/types";
import { Cache } from "./index";
import { ICache } from "./types";
import { IItem } from "../common/types";

type Key = string;
type Value = { value: string };

//#region util-functions
let cacheIndex: IIndex<Key>;
const getIndex = (index: Key[]): IIndex<Key> => ({
  addKeys: keys => index.push(...keys),
  removeLast: num => index.slice(-num),
  removeKeys: keys => index.filter(key => !keys.includes(key)),
  getKeys: () => index,
  getLength: () => index.length,
  markGet: () => null,
});

let cacheStore: IStore<Key, Value>;
const getStore = (map: Map<Key, IItem<Key, Value>>): IStore<Key, Value> => ({
  delete: key => map.delete(key),
  get: key => map.get(key),
  put: value => map.set(value.key, value),
});

const createCache = (
  index: string[] = [],
  map: Map<Key, IItem<Key, Value>> = new Map(),
): ICache<Key, Value> => {
  cacheStore = getStore(map);
  cacheIndex = getIndex(index);
  return new Cache({ capacity: 5 }, cacheStore, cacheIndex);
};
//#endregion

describe("Cache", () => {
  describe("get", () => {
    test("should update the index", () => {
      const cache = createCache();
      const spy = jest.spyOn(cacheIndex, "markGet");
      cache.get("key");
      expect(spy).toHaveBeenCalledTimes(1);
    });

    test("should return a value", () => {
      const cache = createCache(
        ["key"],
        new Map<Key, IItem<Key, Value>>([
          ["key", { key: "key", value: { value: "value" } }],
        ]),
      );
      const item = cache.get("key");
      expect(item.value).toBe("value");
    });

    test("should return null when no value present", () => {
      const cache = createCache();
      expect(cache.get("key")).toBeNull();
    });

    test("should not return an expired value", () => {
      const cache = createCache(
        ["key"],
        new Map<Key, IItem<Key, Value>>([
          [
            "key",
            {
              key: "key",
              value: { value: "value" },
              expiry: 1,
            },
          ],
        ]),
      );
      const item = cache.get("key");
      expect(item).toBeNull();
    });

    test("should return a value that hasn't expired yet", () => {
      const cache = createCache(
        ["key"],
        new Map<Key, IItem<Key, Value>>([
          [
            "key",
            {
              key: "key",
              value: { value: "value" },
              expiry: Date.now() + 10000,
            },
          ],
        ]),
      );
      const item = cache.get("key");
      expect(item.value).toBe("value");
    });
  });

  describe("getMany", () => {
    test("should update the index", () => {
      const cache = createCache();
      const spy = jest.spyOn(cacheIndex, "markGet");
      cache.getMany(["key", "key2", "key3"]);
      expect(spy).toHaveBeenCalledWith(["key", "key2", "key3"]);
    });

    test("should return values", () => {
      const cache = createCache(
        ["key", "key2", "key3"],
        new Map<Key, IItem<Key, Value>>([
          ["key", { key: "key", value: { value: "value_1" } }],
          ["key2", { key: "key2", value: { value: "value_2" } }],
          ["key3", { key: "key3", value: { value: "value_3" } }],
        ]),
      );
      const items = cache.getMany(["key", "key2", "key3"]);
      expect(items.find(i => i.key === "key").value.value).toBe("value_1");
      expect(items.find(i => i.key === "key2").value.value).toBe("value_2");
      expect(items.find(i => i.key === "key3").value.value).toBe("value_3");
    });

    test("should return null values when no value present", () => {
      const cache = createCache(
        ["key", "key2", "key3"],
        new Map<Key, IItem<Key, Value>>([
          ["key", { key: "key", value: { value: "value_1" } }],
          ["key3", { key: "key3", value: { value: "value_3" } }],
        ]),
      );
      const items = cache.getMany(["key", "key2", "key3"]);
      expect(items.find(i => i.key === "key").value.value).toBe("value_1");
      expect(items.find(i => i.key === "key2").value).toBe(null);
      expect(items.find(i => i.key === "key3").value.value).toBe("value_3");
    });
  });

  describe("put", () => {
    test("should add an item to the index", () => {
      const cache = createCache();
      const addKeysSpy = jest.spyOn(cacheIndex, "addKeys");
      cache.put("key", { value: "new value" });
      expect(addKeysSpy).toHaveBeenCalledWith(["key"]);
    });

    test("should call clear items if we are going to exceed capacity", () => {
      const cache = createCache(
        ["key1", "key2"],
        new Map<Key, IItem<Key, Value>>([
          ["key1", { key: "key1", value: { value: "value1" } }],
          ["key2", { key: "key2", value: { value: "value2" } }],
        ]),
      );
      const removeLastSpy = jest.spyOn(cacheIndex, "removeLast");
      const addKeysSpy = jest.spyOn(cacheIndex, "addKeys");
      cache.setCapacity(2);
      cache.put("key3", { value: "new value" });
      expect(removeLastSpy).toHaveBeenCalledWith(1);
      expect(addKeysSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("putMany", () => {
    test("should add items to the index", () => {
      const cache = createCache();
      const addKeysSpy = jest.spyOn(cacheIndex, "addKeys");
      cache.putMany([
        { key: "key", value: { value: "new value" } },
        { key: "key2", value: { value: "another value" } },
      ]);
      expect(addKeysSpy).toHaveBeenCalledWith(["key", "key2"]);
    });

    test("should call clear items if we are going to exceed capacity", () => {
      const cache = createCache(
        ["key1", "key2"],
        new Map<Key, IItem<Key, Value>>([
          ["key1", { key: "key1", value: { value: "value1" } }],
          ["key2", { key: "key2", value: { value: "value2" } }],
        ]),
      );
      const removeLastSpy = jest.spyOn(cacheIndex, "removeLast");
      const addKeysSpy = jest.spyOn(cacheIndex, "addKeys");
      cache.setCapacity(3);
      cache.putMany([
        { key: "key3", value: { value: "new value" } },
        { key: "key4", value: { value: "another value" } },
        { key: "key5", value: { value: "final value" } },
      ]);
      expect(removeLastSpy).toHaveBeenCalledWith(2);
      expect(addKeysSpy).toHaveBeenCalledTimes(1);
    });

    test("should only insert items up to capacity", () => {
      const cache = createCache();
      cache.setCapacity(2);
      cache.putMany([
        { key: "key", value: { value: "new value" } },
        { key: "key2", value: { value: "another value" } },
        { key: "key3", value: { value: "third value" } },
      ]);
      expect(cache.get("key").value).toBe("new value");
      expect(cache.get("key2").value).toBe("another value");
      expect(cache.get("key3")).toBeNull();
    });
  });

  describe("remove", () => {
    test("should inform the index of deletion", () => {
      const cache = createCache(
        ["key1", "key2"],
        new Map<Key, IItem<Key, Value>>([
          ["key1", { key: "key1", value: { value: "value1" } }],
          ["key2", { key: "key2", value: { value: "value2" } }],
        ]),
      );
      const removeKeysSpy = jest.spyOn(cacheIndex, "removeKeys");
      cache.remove("key1");
      expect(removeKeysSpy).toHaveBeenLastCalledWith(["key1"]);
    });
    test("should delete the item from the store", () => {
      const cache = createCache(
        ["key1", "key2"],
        new Map<Key, IItem<Key, Value>>([
          ["key1", { key: "key1", value: { value: "value1" } }],
          ["key2", { key: "key2", value: { value: "value2" } }],
        ]),
      );
      const removeSpy = jest.spyOn(cacheStore, "delete");
      cache.remove("key1");
      expect(removeSpy).toHaveBeenLastCalledWith("key1");
    });
  });

  describe("removeMany", () => {
    test("should inform the index of deletion", () => {
      const cache = createCache(
        ["key1", "key2"],
        new Map<Key, IItem<Key, Value>>([
          ["key1", { key: "key1", value: { value: "value1" } }],
          ["key2", { key: "key2", value: { value: "value2" } }],
        ]),
      );
      const removeKeysSpy = jest.spyOn(cacheIndex, "removeKeys");
      cache.removeMany(["key1", "key2"]);
      expect(removeKeysSpy).toHaveBeenLastCalledWith(["key1", "key2"]);
    });
    test("should delete the item from the store", () => {
      const cache = createCache(
        ["key1", "key2"],
        new Map<Key, IItem<Key, Value>>([
          ["key1", { key: "key1", value: { value: "value1" } }],
          ["key2", { key: "key2", value: { value: "value2" } }],
        ]),
      );
      const removeSpy = jest.spyOn(cacheStore, "delete");
      cache.removeMany(["key1", "key2"]);
      expect(removeSpy).toHaveBeenNthCalledWith(1, "key1");
      expect(removeSpy).toHaveBeenNthCalledWith(2, "key2");
    });
  });

  describe("setCapacity", () => {
    test("should change the max capacity", () => {
      const cache = createCache();
      cache.setCapacity(17);
      expect(cache.getCapacity()).toBe(17);
    });

    test("should clear excess values", () => {
      const cache = createCache();
      cache.putMany([
        { key: "key", value: { value: "new value" } },
        { key: "key2", value: { value: "another value" } },
        { key: "key3", value: { value: "final value" } },
      ]);
      const removeLastSpy = jest.spyOn(cacheIndex, "removeLast");
      const deleteSpy = jest.spyOn(cacheStore, "delete");
      cache.setCapacity(1);

      expect(removeLastSpy).toHaveBeenCalledWith(2);
      expect(deleteSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe("expiry", () => {
    test("should stop a value from being returned", done => {
      const cache = createCache();
      cache.put("value", { value: "value_1" }, 10);

      let item = cache.get("value");
      expect(item.value).toBe("value_1");

      setTimeout(() => {
        item = cache.get("value");
        expect(item).toBeNull();
        done();
      }, 50);
    });

    test("should remove a value from the index", done => {
      const cache = createCache();
      const removeKeysSpy = jest.spyOn(cacheIndex, "removeKeys");

      cache.put("value", { value: "value_1" }, 10);

      let item = cache.get("value");
      expect(item.value).toBe("value_1");

      setTimeout(() => {
        item = cache.get("value");
        expect(item).toBeNull();
        expect(removeKeysSpy).toHaveBeenCalledTimes(1);
        expect(removeKeysSpy).toHaveBeenCalledWith(["value"]);
        done();
      }, 50);
    });
  });
});
