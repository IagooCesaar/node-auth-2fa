import { classToClass } from "class-transformer";

import { IUserSecondFactorKeyResponseDTO } from "../dtos/IUserSecondFactorKeyResponseDTO";
import { UserSecondFactorKey } from "../infra/typeorm/entities/UserSecondFactorKey";

class UserSecondFactorKeyMap {
  static toDTO({
    created_at,
    key,
    qrcode_url,
    user,
    user_id,
    validated,
    validated_at,
  }: UserSecondFactorKey): IUserSecondFactorKeyResponseDTO {
    const key2fa = classToClass({
      created_at,
      key,
      qrcode_url,
      user_id,
      validated,
      validated_at,
    });
    return key2fa;
  }
}

export { UserSecondFactorKeyMap };
