import { createMapStore } from ".";
import { IStore } from "../types";

type Key = string;
type Value = { data: boolean };

describe("Map Store", () => {
  describe("get", () => {
    test("should return null if not present", () => {
      const store: IStore<Key, Value> = createMapStore();
      expect(store.get("value")).toBeNull();
    });
    test("should return value if present", () => {
      const store: IStore<Key, Value> = createMapStore();
      const value = { data: true };
      store.put({ key: "value", value });
      expect(store.get("value").value).toBe(value);
      expect(store.get("value").value.data).toBe(true);
    });
  });

  describe("put", () => {
    test("should insert the object into the store", () => {
      const store: IStore<Key, Value> = createMapStore();
      expect(store.get("value")).toBeNull();
      const value = { data: true };
      store.put({ key: "value", value });
      expect(store.get("value").value).toBe(value);
      expect(store.get("value").value.data).toBe(true);
    });
    test("should overwrite previous values", () => {
      const store: IStore<Key, Value> = createMapStore();
      const value = { data: true };
      const newValue = { data: true };

      store.put({ key: "value", value });
      expect(store.get("value").value).toBe(value);

      store.put({ key: "value", value: newValue });
      expect(store.get("value").value).toBe(newValue);
    });
  });

  describe("delete", () => {
    test("should remove the item from the store", () => {
      const store: IStore<Key, Value> = createMapStore();
      const value = { data: true };

      store.put({ key: "value", value });
      expect(store.get("value").value).toBe(value);

      store.delete("value");
      expect(store.get("value")).toBeNull();
    });
  });
});
