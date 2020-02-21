import FileType, { MimeType, FileExtension } from 'file-type';
export const getFileType = async (filePath: string) => {
  const result = await FileType.fromFile(filePath);
  return result;
};
