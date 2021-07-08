import { container } from "tsyringe";

import { ICacheProvider } from "./ICacheProvider";
import { RedisCacheProvider } from "./implementations/RedisCacheProvider";

container.registerSingleton<ICacheProvider>(
  "CacheProvider",
  RedisCacheProvider
);
