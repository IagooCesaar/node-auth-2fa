import qrcode from "qrcode";
import { inject, injectable } from "tsyringe";
import { v4 as uuidV4 } from "uuid";

import uploadConfig from "@config/upload";
import { IUserSecondFactorKeyResponseDTO } from "@modules/users/dtos/IUserSecondFactorKeyResponseDTO";
import { UserSecondFactorKeyMap } from "@modules/users/mappers/UserSecondFactorKeyMap";
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

  async execute(user_id: string): Promise<IUserSecondFactorKeyResponseDTO> {
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
    const fileName = `${user_id}.png`;
    const fileDirTmp = `${uploadConfig.tmpFolder}/${fileName}`;

    await deleteFile(fileName);
    const keyName = "Node 2FA";
    const uri = encodeURI(`otpauth://totp/${keyName}?secret=${key}`);

    try {
      await qrcode.toFile(fileDirTmp, uri, {});
    } catch {
      throw new Generate2faKeyError.QRCodeNotGenerated();
    }

    if (fileExists(fileDirTmp)) {
      await this.storageProvider.save(fileName, "qrcode");
    } else {
      throw new Generate2faKeyError.QRCodeNotFound();
    }

    return UserSecondFactorKeyMap.toDTO(new2fa);
  }
}

export { Generate2faKeyUseCase };
