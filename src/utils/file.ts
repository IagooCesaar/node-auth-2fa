import fs, { constants } from "fs";

export const fileExists = (fileName: string): boolean => {
  try {
    fs.accessSync(fileName, constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
};

export const deleteFile = async (fileName: string): Promise<void> => {
  if (!fileExists(fileName)) return;
  try {
    await fs.promises.stat(fileName);
    await fs.promises.unlink(fileName);
  } catch (error) {
    console.log(error);
  }
};
