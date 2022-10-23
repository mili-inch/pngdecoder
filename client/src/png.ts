export const isBufferPng = (buffer: Uint8Array): boolean => {
  const sign = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  for (let i = 0; i < sign.length; i++) {
    if (buffer[i] !== sign[i]) {
      return false;
    }
  }
  return true;
};

export const getTextsFromBuffer = (buffer: Uint8Array): string[] => {
  const texts: string[] = [];
  let cur = 0x21;
  let state: "length" | "type" | "data" | "CRC" = "length";
  let type = "";
  let length = 0;
  while (true) {
    if (state === "length") {
      length = new DataView(buffer.slice(cur, cur + 4).buffer).getUint32(
        0,
        false,
      );
      cur += 4;
      state = "type";
    } else if (state === "type") {
      type = new TextDecoder().decode(buffer.subarray(cur, cur + 4));
      cur += 4;
      if (
        type === "tEXt" ||
        type === "sRGB" ||
        type === "pHYs" ||
        type === "gAMA"
      ) {
        state = "data";
      } else {
        break;
      }
    } else if (state === "data") {
      const data = new TextDecoder().decode(buffer.subarray(cur, cur + length));
      cur += length;
      if (type === "tEXt") {
        texts.push(data);
      }
      state = "CRC";
    } else if (state === "CRC") {
      cur += 4;
      state = "length";
    }
    if (cur >= buffer.length) {
      break;
    }
  }
  return texts;
};

export const isNovelAiTexts = (texts: string[]): boolean => {
  if (texts.length < 5) {
    return false;
  }
  const text = texts[2];
  if (text === undefined) {
    return false;
  }
  if (!text.startsWith("Software\x00NovelAI")) {
    return false;
  }
  return true;
};

export const isAutomatic1111Texts = (texts: string[]): boolean => {
  if (texts.length !== 1) {
    return false;
  }
  const text = texts[0];
  if (text === undefined) {
    return false;
  }
  if (!text.startsWith("parameters")) {
    return false;
  }
  return true;
};
