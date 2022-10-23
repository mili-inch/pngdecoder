/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./client/src/png.ts":
/*!***************************!*\
  !*** ./client/src/png.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isAutomatic1111Texts = exports.isNovelAiTexts = exports.getTextsFromBuffer = exports.isBufferPng = void 0;
var isBufferPng = function (buffer) {
    var sign = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    for (var i = 0; i < sign.length; i++) {
        if (buffer[i] !== sign[i]) {
            return false;
        }
    }
    return true;
};
exports.isBufferPng = isBufferPng;
var getTextsFromBuffer = function (buffer) {
    var texts = [];
    var cur = 0x21;
    var state = "length";
    var type = "";
    var length = 0;
    while (true) {
        if (state === "length") {
            length = new DataView(buffer.slice(cur, cur + 4).buffer).getUint32(0, false);
            cur += 4;
            state = "type";
        }
        else if (state === "type") {
            type = new TextDecoder().decode(buffer.subarray(cur, cur + 4));
            cur += 4;
            if (type === "tEXt" ||
                type === "sRGB" ||
                type === "pHYs" ||
                type === "gAMA") {
                state = "data";
            }
            else {
                break;
            }
        }
        else if (state === "data") {
            var data = new TextDecoder().decode(buffer.subarray(cur, cur + length));
            cur += length;
            if (type === "tEXt") {
                texts.push(data);
            }
            state = "CRC";
        }
        else if (state === "CRC") {
            cur += 4;
            state = "length";
        }
        if (cur >= buffer.length) {
            break;
        }
    }
    return texts;
};
exports.getTextsFromBuffer = getTextsFromBuffer;
var isNovelAiTexts = function (texts) {
    if (texts.length < 5) {
        return false;
    }
    var text = texts[2];
    if (text === undefined) {
        return false;
    }
    if (!text.startsWith("Software\x00NovelAI")) {
        return false;
    }
    return true;
};
exports.isNovelAiTexts = isNovelAiTexts;
var isAutomatic1111Texts = function (texts) {
    if (texts.length !== 1) {
        return false;
    }
    var text = texts[0];
    if (text === undefined) {
        return false;
    }
    if (!text.startsWith("parameters")) {
        return false;
    }
    return true;
};
exports.isAutomatic1111Texts = isAutomatic1111Texts;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*****************************!*\
  !*** ./client/src/index.ts ***!
  \*****************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
var png_1 = __webpack_require__(/*! ./png */ "./client/src/png.ts");
var button_upload = document.getElementById("button_upload");
var result = document.getElementById("result");
var onFileSelected = function (files) {
    var file = files[0];
    if (file === undefined) {
        return;
    }
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function () {
        var arr = new Uint8Array(reader.result);
        if (!(0, png_1.isBufferPng)(arr)) {
            return;
        }
        var texts = (0, png_1.getTextsFromBuffer)(arr);
        result.textContent = JSON.stringify(texts);
    };
};
button_upload.addEventListener("change", function (e) {
    e.preventDefault();
    if (!e.target) {
        return;
    }
    var files = e.target.files;
    onFileSelected(files);
}, false);
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

})();

/******/ })()
;
//# sourceMappingURL=index.js.map