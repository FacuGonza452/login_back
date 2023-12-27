const fs = require('fs');
const path = require('path');

class FileSystemManager {
  constructor() {}

  async readFile(filePath) {
    const fullPath = path.join(__dirname, filePath);

    return new Promise((resolve, reject) => {
      fs.readFile(fullPath, 'utf8', (err, data) => {
        if (err) {
          reject(new Error(`Error al leer el archivo: ${err.message}`));
        } else {
          resolve(data);
        }
      });
    });
  }

  async writeFile(filePath, content) {
    const fullPath = path.join(__dirname, filePath);

    return new Promise((resolve, reject) => {
      fs.writeFile(fullPath, content, 'utf8', (err) => {
        if (err) {
          reject(new Error(`Error al escribir el archivo: ${err.message}`));
        } else {
          resolve();
        }
      });
    });
  }

  async deleteFile(filePath) {
    const fullPath = path.join(__dirname, filePath);

    return new Promise((resolve, reject) => {
      fs.unlink(fullPath, (err) => {
        if (err) {
          reject(new Error(`Error al eliminar el archivo: ${err.message}`));
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = FileSystemManager;
