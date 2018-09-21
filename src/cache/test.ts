import { IIndex } from "../index/types";
import { IStore } from "../store/types";
import { Cache } from "./index";
import { ICache } from "./types";

let indexSpies: any;
const getIndex = (index: string[]) => {
  const indexObject: IIndex<string> = {
    addKeys: keys => index.push(...keys),
    clearLast: num => index.slice(-num),
    getKeys: () => index,
    getLength: () => index.length,
    markGet: () => null,
  };
  indexSpies = {
    addKeys: jest.spyOn(indexObject, "addKeys"),
    clearLast: jest.spyOn(indexObject, "clearLast"),
    getKeys: jest.spyOn(indexObject, "getKeys"),
    getLength: jest.spyOn(indexObject, "getLength"),
    markGet: jest.spyOn(indexObject, "markGet"),
  };
  return indexObject;
};

let storeMap: Map<string, object>;
const memoryStore: IStore<string, object> = {
  delete: jest.fn(key => storeMap.delete(key)),
  get: jest.fn(key => storeMap.get(key)),
  put: jest.fn((key, value) => storeMap.set(key, value)),
};

const createCache = (
  index: string[] = [],
  map?: Map<string, object>,
): ICache<string, object> => {
  storeMap = map || new Map();
  return new Cache({ capacity: 5 }, memoryStore, getIndex(index));
};

describe("Cache", () => {
  describe("get", () => {
    test("should update the index", () => {
      const cache = createCache();
      cache.get("key");
      expect(indexSpies.getKeys).toHaveBeenCalled();
    });
  });
});
