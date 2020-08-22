import path from 'path';

export const allowedTypes = [
  'application/x-7z-compressed',
  'application/zip',
  'application/x-zip',
  'application/gzip',
  'application/x-bzip',
  'application/x-gzip',
  'application/x-bzip2',
  'application/vnd.rar',
  'application/x-rar-compressed',
  'application/x-zip-compressed',
  'application/octet-stream',
  'text/javascript',
];

export const allowedExtensions = [
  '.zip',
  '.rar',
  '.7z',
  '.js',
];

export const validateFile = function({ type, size, name }) {
  if (size > 1024 * 1024) {
    throw new Error('The maximum file size is 1MB.');
  }

  if (type) {
    if (!allowedTypes.includes(type)) {
      console.error('Invalid File Type', type);
      throw new Error('Invalid file type');
    }
  }

  const extension = path.extname(name);
  if (!allowedExtensions.includes(extension)) {
    console.error('Invalid File Extension', extension);
    throw new Error('Invalid file type');
  }
};