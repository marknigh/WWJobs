export const SanitizePicture = (file: File) => {
  return new Promise((resolve, reject) => {
    const filereader = new FileReader();
    const blob = file.slice(0, 4);
    filereader.readAsArrayBuffer(blob);
    filereader.onloadend = function () {
      const uint = new Uint8Array(filereader.result);
      let bytes = [];
      uint.forEach((byte) => {
        bytes.push(byte.toString(16));
      });
      let hex = bytes.join('').toUpperCase();
      switch (hex) {
        case '89504E47':
          return resolve(true);
        case 'FFD8FFDB':
          return resolve(true);
        case 'FFD8FFE0':
          return resolve(true);
        case 'FFD8FFE1':
          return resolve(true);
        default:
          return reject(false);
      }
    };
  });
};
