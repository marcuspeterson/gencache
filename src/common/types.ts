export interface IItem<K, V> {
  key: K;
  value: V;
  expiry?: number;
}
