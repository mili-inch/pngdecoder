/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!*****************************!*\
  !*** ./client/src/index.ts ***!
  \*****************************/

var onFileSelected = function (files) {
    var file = files[0];
    if (file === undefined) {
        return;
    }
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function () {
        console.log(reader.result);
    };
};
document.addEventListener("drop", function (e) {
    e.preventDefault();
    if (!e.dataTransfer) {
        return;
    }
    onFileSelected(e.dataTransfer.files);
});

/******/ })()
;
//# sourceMappingURL=index.js.map