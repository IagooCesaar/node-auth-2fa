import { container } from "tsyringe";

import { LocalStorageProvider } from "./implementations/LocalStorageProvider";
import { IStorageProvider } from "./IStorageProvider";

container.registerSingleton<IStorageProvider>(
  "StorageProvider",
  LocalStorageProvider
);
