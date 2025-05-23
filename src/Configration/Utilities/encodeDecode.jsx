export const encryptStringData = (data) => {
  try {
    const encodedStringBtoA = btoa(data);
    return encodedStringBtoA;
  } catch (err) {
    return null;
  }
};

export const decryptStringData = (data) => {
  try {
    const decodedStringAtoB = atob(data);
    return decodedStringAtoB;
  } catch (err) {
    return null;
  }
};
