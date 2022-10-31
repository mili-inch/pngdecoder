type ImageDescription = {
  source: string;
  prompt: string;
  negativePrompt: string;
  settings: { [key: string]: any };
};

export const isBufferPng = (buffer: Uint8Array): boolean => {
  const sign = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  for (let i = 0; i < sign.length; i++) {
    if (buffer[i] !== sign[i]) {
      return false;
    }
  }
  return true;
};

export const parseBuffer = (
  buffer: Uint8Array,
): { [key: string]: string }[] => {
  const texts: { [key: string]: string }[] = [];
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
        type === "gAMA" ||
        type === "iTXt"
      ) {
        state = "data";
      } else {
        break;
      }
    } else if (state === "data") {
      if (type === "tEXt") {
        const initialCur = cur;
        const finishCur = initialCur + length;
        while (cur < finishCur) {
          cur += 1;
          if (buffer[cur] === 0) {
            break;
          }
        }
        const key = new TextDecoder().decode(buffer.subarray(initialCur, cur));
        cur += 1;
        const value = new TextDecoder().decode(buffer.subarray(cur, finishCur));
        cur = finishCur;
        texts.push({ [key]: value });
      } else if (type === "iTXt") {
        const initialCur = cur;
        const finishCur = initialCur + length;
        while (cur < finishCur) {
          cur += 1;
          if (buffer[cur] === 0) {
            break;
          }
        }
        const key = new TextDecoder().decode(buffer.subarray(initialCur, cur));
        cur += 2;
        while (cur < finishCur) {
          cur += 1;
          if (buffer[cur] === 0) {
            break;
          }
        }
        while (cur < finishCur) {
          cur += 1;
          if (buffer[cur] === 0) {
            break;
          }
        }

        cur += 1;
        const value = new TextDecoder().decode(buffer.subarray(cur, finishCur));
        cur = finishCur;
        texts.push({ [key]: value });
      } else {
        cur += length;
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

export const isNovelAiTexts = (texts: { [key: string]: string }[]): boolean => {
  if (
    texts.some(
      (x) =>
        Object.keys(x)[0] === "Software" && Object.values(x)[0] === "NovelAI",
    )
  ) {
    return true;
  }
  return false;
};

export const isAutomatic1111Texts = (
  texts: { [key: string]: string }[],
): boolean => {
  if (texts.some((x) => Object.keys(x)[0] === "parameters")) {
    return true;
  }
  return false;
};

export const parseNovelAiTexts = (
  texts: { [key: string]: string }[],
): ImageDescription => {
  const commentText = texts.find((x) => Object.keys(x)[0] === "Comment")?.[
    "Comment"
  ];
  const comment: { [key: string]: any } = commentText
    ? JSON.parse(commentText)
    : {};
  const prompt =
    texts.find((x) => Object.keys(x)[0] === "Description")?.["Description"] ||
    "";
  const negativePrompt = (comment["uc"] as string) || "";
  const settings = Object.keys(comment)
    .filter((x) => x !== "uc")
    .reduce((acc, key) => {
      acc[key] = comment[key];
      return acc;
    }, {} as { [key: string]: any });
  return { source: "NovelAI", prompt, negativePrompt, settings };
};

export const parseAutomatic1111Texts = (
  texts: { [key: string]: string }[],
): ImageDescription => {
  const parametersText = texts.find(
    (x) => Object.keys(x)[0] === "parameters",
  )?.["parameters"];
  const parameters = parametersText?.split("\n");
  const prompt = parameters?.[0] || "";
  const negativePrompt =
    parameters?.[1]?.replace(/^Negative prompt: /, "") || "";
  const settings: { [key: string]: string } = {};
  parameters?.[2]?.split(", ").forEach((x) => {
    const [key, value] = x.split(": ");
    if (key !== undefined && value !== undefined) {
      settings[key] = value;
    }
  });
  return {
    source: "Automatic1111",
    prompt,
    negativePrompt,
    settings,
  };
};
