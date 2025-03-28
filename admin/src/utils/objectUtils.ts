export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    const arrCopy = [] as any[];
    obj.forEach((item) => {
      arrCopy.push(deepClone(item));
    });
    return arrCopy as T;
  }

  const objCopy = {} as { [key: string]: any };
  Object.keys(obj).forEach((key) => {
    objCopy[key] = deepClone((obj as any)[key]);
  });
  return objCopy as T;
};