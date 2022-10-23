import { isBufferPng, getTextsFromBuffer } from "./png";

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
    const texts = getTextsFromBuffer(arr);
    result.textContent = JSON.stringify(texts);
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
