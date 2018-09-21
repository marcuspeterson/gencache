export interface IIndex<K> {
  getKeys: () => K[];
  getLength: () => number;
  markGet: (keys: K[]) => void;
  addKeys: (keys: K[]) => void;
  clearLast: (count: number) => K[];
}
