import { MapOptions } from "../store/map/types";
import { FifoOptions } from "../index/fifo/types";

type CommonOptions = {
  capacity: number;
};

type StoreOptions = MapOptions;
type IndexOptions = FifoOptions;

export type CacheOptions = CommonOptions & StoreOptions & IndexOptions;
