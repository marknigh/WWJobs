export const SanitizePicture = (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const filereader = new FileReader();
    const blob = file.slice(0, 4);
    filereader.readAsArrayBuffer(blob);
    filereader.onloadend = function () {
      if (!filereader.result || !(filereader.result instanceof ArrayBuffer)) {
        return reject(false);
      }
      const uint = new Uint8Array(filereader.result);
      const bytes: string[] = [];
      uint.forEach((byte) => {
        if (byte) bytes.push(byte.toString(16));
      });
      const hex = bytes.join('').toUpperCase();
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
