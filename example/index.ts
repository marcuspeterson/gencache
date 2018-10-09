import { createCache } from "../src";

type Data = {
  selected: boolean;
  id: string;
  count: number;
};

const cache = createCache<string, Data>({
  capacity: 2,
  indexType: "fifo",
  storeType: "map",
});

cache.putMany([
  { key: "asdf", value: { count: 1, id: "asdf", selected: true } },
  { key: "qwer", value: { count: 2, id: "qwer", selected: true } },
  { key: "zxcv", value: { count: 3, id: "zxcv", selected: false } },
]);

cache.remove("qwer");

global.console.log(cache.getMany(["asdf", "qwer", "zxcv"]));
