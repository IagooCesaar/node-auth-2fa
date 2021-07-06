import fs from "fs";
import path from "path";

import upload from "@config/upload";
import { deleteFile } from "@utils/file";

import { IStorageProvider } from "../IStorageProvider";

class LocalStorageProvider implements IStorageProvider {
  async save(file: string, folder: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(upload.tmpFolder, file),
      path.resolve(`${upload.tmpFolder}/${folder}`, file)
    );
    await deleteFile(path.resolve(upload.tmpFolder, file));
    return file;
  }

  async delete(file: string, folder: string): Promise<void> {
    const fileName = path.resolve(`${upload.tmpFolder}/${folder}`, file);
    await deleteFile(fileName);
  }
}

export { LocalStorageProvider };
