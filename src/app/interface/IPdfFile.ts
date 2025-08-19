// Type definition for multiple image files mapped by fieldname
export type IPdfFiles = Record<string, Express.Multer.File[]>;

// Type definition for a single image file
export interface IPdfFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  path: string;
  size: number;
  filename: string;
}
