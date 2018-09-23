import { IIndex } from "../types";

export const createFifoIndex = <K>(): IIndex<K> => {
  let index: K[] = [];
  return {
    getKeys: () => index,
    getLength: () => index.length,
    markGet: (keys: K[]) => {},
    addKeys: (keys: K[]) => {
      index.unshift(...keys);
    },
    removeKeys: (keys: K[]) => {
      index = index.filter(key => !keys.includes(key));
    },
    removeLast: (count: number) => index.splice(-count, count),
  };
};
