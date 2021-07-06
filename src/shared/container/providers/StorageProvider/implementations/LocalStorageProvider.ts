import fs from "fs";
import path from "path";

import upload from "@config/upload";
import { deleteFile } from "@utils/file";

import { IStorageProvider } from "../IStorageProvider";

class LocalStorageProvider implements IStorageProvider {
  async save(file: string, folder: string): Promise<string> {
    const newPath =
      process.env.NODE_ENV === "test"
        ? path.resolve(`${upload.tmpFolder}/test/${folder}`, file)
        : path.resolve(`${upload.tmpFolder}/${folder}`, file);

    await fs.promises.rename(path.resolve(upload.tmpFolder, file), newPath);
    await deleteFile(path.resolve(upload.tmpFolder, file));
    return file;
  }

  async delete(file: string, folder: string): Promise<void> {
    const fileName =
      process.env.NODE_ENV === "test"
        ? path.resolve(`${upload.tmpFolder}/test/${folder}`, file)
        : path.resolve(`${upload.tmpFolder}/${folder}`, file);
    await deleteFile(fileName);
  }
}

export { LocalStorageProvider };
