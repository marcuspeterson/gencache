import { createFifoIndex } from ".";

describe("FIFO Index", () => {
  describe("getKeys", () => {
    test("should return the keys in the index", () => {
      const index = createFifoIndex();
      index.addKeys(["key1", "key2"]);
      expect(index.getKeys()).toEqual(["key1", "key2"]);
    });
    test("should return an empty array if empty", () => {
      const index = createFifoIndex();
      expect(index.getKeys()).toEqual([]);
    });
  });

  describe("getLength", () => {
    test("should return the current length of the index", () => {
      const index = createFifoIndex();
      expect(index.getLength()).toBe(0);
      index.addKeys(["key1", "key2"]);
      expect(index.getLength()).toBe(2);
    });
  });

  describe("markGet", () => {
    test("to do nothing!", () => {
      const index = createFifoIndex();
      index.addKeys(["key1", "key2", "key3", "key4"]);
      index.markGet(["key3"]);
      index.markGet(["key2"]);
      expect(index.getKeys()).toEqual(["key2", "key3", "key1", "key4"]);
    });
  });

  describe("addKeys", () => {
    test("should add them to the start of the index", () => {
      const index = createFifoIndex();
      index.addKeys(["key1", "key2"]);
      expect(index.getKeys()).toEqual(["key1", "key2"]);
      index.addKeys(["key3", "key4"]);
      expect(index.getKeys()).toEqual(["key3", "key4", "key1", "key2"]);
    });
  });

  describe("removeKeys", () => {
    test("should clear the keys from the index", () => {
      const index = createFifoIndex();
      index.addKeys(["key1", "key2", "key3", "key4"]);
      expect(index.getKeys()).toEqual(["key1", "key2", "key3", "key4"]);
      index.removeKeys(["key2", "key4"]);
      expect(index.getKeys()).toEqual(["key1", "key3"]);
    });
  });

  describe("removeLast", () => {
    test("should remove from the end of the array", () => {
      const index = createFifoIndex();
      index.addKeys(["key1", "key2", "key3", "key4"]);
      expect(index.removeLast(2)).toEqual(["key3", "key4"]);
      expect(index.getKeys()).toEqual(["key1", "key2"]);
    });
    test("should remove no items if 0 passed in", () => {
      const index = createFifoIndex();
      index.addKeys(["key1", "key2", "key3", "key4"]);
      expect(index.removeLast(0)).toEqual([]);
      expect(index.getKeys()).toEqual(["key1", "key2", "key3", "key4"]);
    });
  });
});
