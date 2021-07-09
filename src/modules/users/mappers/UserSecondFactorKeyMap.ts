import { classToClass } from "class-transformer";

import { IUserSecondFactorKeyResponseDTO } from "../dtos/IUserSecondFactorKeyResponseDTO";
import { UserSecondFactorKey } from "../infra/typeorm/entities/UserSecondFactorKey";

class UserSecondFactorKeyMap {
  static toDTO({
    qrcode_url,
  }: UserSecondFactorKey): IUserSecondFactorKeyResponseDTO {
    const key2fa = classToClass({
      qrcode_url,
    });
    return key2fa;
  }
}

export { UserSecondFactorKeyMap };
