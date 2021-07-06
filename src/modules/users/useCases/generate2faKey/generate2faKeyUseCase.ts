import qrcode from "qrcode";
import { inject, injectable } from "tsyringe";
import { v4 as uuidV4 } from "uuid";

import uploadConfig from "@config/upload";
import { UserSecondFactorKey } from "@modules/users/infra/typeorm/entities/UserSecondFactorKey";
import { IUserSecondFactorKeyRepository } from "@modules/users/repositories/IUserSecondFactorKeyRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { deleteFile, fileExists } from "@utils/file";

import { Generate2faKeyError } from "./generate2faKeyError";

@injectable()
class Generate2faKeyUseCase {
  constructor(
    @inject("UserSecondFactorKeyRepository")
    private userSecondFactorKeyRepository: IUserSecondFactorKeyRepository,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StorageProvider")
    private storageProvider: IStorageProvider
  ) {}

  async execute(user_id: string): Promise<UserSecondFactorKey> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new Generate2faKeyError.UserNotFound();
    }
    await this.userSecondFactorKeyRepository.removeUnvalidatedKeys(user_id);
    // gerar uma nova chave
    const key = uuidV4();
    const new2fa = await this.userSecondFactorKeyRepository.generate(
      user_id,
      key
    );
    const fileName = `${uploadConfig.tmpFolder}/${user_id}.png`;
    await deleteFile(fileName);
    const keyName = "Node 2FA";
    const uri = encodeURI(`otpauth://totp/${keyName}?secret=${key}`);

    try {
      await qrcode.toFile(fileName, uri, {});
    } catch {
      throw new Generate2faKeyError.QRCodeNotGenerated();
    }

    if (fileExists(fileName)) {
      await this.storageProvider.save(fileName, "qrcode");
    } else {
      throw new Generate2faKeyError.QRCodeNotFound();
    }

    return new2fa;
  }
}

export { Generate2faKeyUseCase };
