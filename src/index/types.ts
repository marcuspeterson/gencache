export interface IIndex<K> {
  getKeys: () => K[];
  getLength: () => number;
  markGet: (keys: K[]) => void;
  addKeys: (keys: K[]) => void;
  removeKeys: (keys: K[]) => void;
  removeLast: (count: number) => K[];
}

export type IndexType = "fifo";
