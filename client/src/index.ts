import {
  isBufferPng,
  parseBuffer,
  isNovelAiTexts,
  isAutomatic1111Texts,
  parseNovelAiTexts,
  parseAutomatic1111Texts,
} from "./png";

const button_upload = document.getElementById("button_upload")!;
const result = document.getElementById("result")!;

const onFileSelected = (files: FileList) => {
  const file = files[0];
  if (file === undefined) {
    return;
  }
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = () => {
    const arr = new Uint8Array(reader.result as ArrayBuffer);
    if (!isBufferPng(arr)) {
      return;
    }
    const texts = parseBuffer(arr);
    if (isNovelAiTexts(texts)) {
      const description = parseNovelAiTexts(texts);
      result.textContent = JSON.stringify(description);
    } else if (isAutomatic1111Texts(texts)) {
      const description = parseAutomatic1111Texts(texts);
      result.textContent = JSON.stringify(description);
    } else {
      result.textContent = JSON.stringify(texts);
    }
    result.textContent += JSON.stringify(texts);
  };
};

button_upload.addEventListener(
  "change",
  function (e) {
    e.preventDefault();
    if (!e.target) {
      return;
    }
    const files = (e.target as HTMLInputElement).files!;
    onFileSelected(files);
  },
  false,
);

document.addEventListener("dragover", function (e) {
  e.preventDefault();
});

document.addEventListener("drop", function (e) {
  e.preventDefault();
  if (!e.dataTransfer) {
    return;
  }
  onFileSelected(e.dataTransfer.files);
});
