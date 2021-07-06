import fs from "fs";

export const deleteFile = async (fileName: string): Promise<void> => {
  try {
    await fs.promises.stat(fileName);
  } catch (error) {
    //
    return;
  }
  await fs.promises.unlink(fileName);
};
