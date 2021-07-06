import { container } from "tsyringe";

import { OTPLibProvider } from "./implementations/OTPLibProvider";
import { IOneTimePasswordProvider } from "./IOneTimePasswordProvider";

container.registerSingleton<IOneTimePasswordProvider>(
  "OneTimePasswordProvider",
  OTPLibProvider
);
