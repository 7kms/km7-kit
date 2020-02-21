const path = require('path');
const fs = require('fs');
const uploadPath = path.resolve('./upload');
const Service = require('egg').Service;
// const zlib = require('zlib');
// const uuidv4 = require('uuid/v4');
// const mime = require('mime')

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}
class UploadService extends Service {
  save(tmpPath) {
    const filename = tmpPath.split('/').pop();
    fs.copyFileSync(tmpPath, path.resolve(uploadPath, filename));
    return { url: `/upload/${filename}` };
  }
}

module.exports = UploadService;
