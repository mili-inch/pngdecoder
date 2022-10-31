/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./client/src/png.ts":
/*!***************************!*\
  !*** ./client/src/png.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseAutomatic1111Texts = exports.parseNovelAiTexts = exports.isAutomatic1111Texts = exports.isNovelAiTexts = exports.parseBuffer = exports.isBufferPng = void 0;
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
var parseBuffer = function (buffer) {
    var _a, _b;
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
                type === "gAMA" ||
                type === "iTXt") {
                state = "data";
            }
            else {
                break;
            }
        }
        else if (state === "data") {
            if (type === "tEXt") {
                var initialCur = cur;
                var finishCur = initialCur + length;
                while (cur < finishCur) {
                    cur += 1;
                    if (buffer[cur] === 0) {
                        break;
                    }
                }
                var key = new TextDecoder().decode(buffer.subarray(initialCur, cur));
                cur += 1;
                var value = new TextDecoder().decode(buffer.subarray(cur, finishCur));
                cur = finishCur;
                texts.push((_a = {}, _a[key] = value, _a));
            }
            else if (type === "iTXt") {
                var initialCur = cur;
                var finishCur = initialCur + length;
                while (cur < finishCur) {
                    cur += 1;
                    if (buffer[cur] === 0) {
                        break;
                    }
                }
                var key = new TextDecoder().decode(buffer.subarray(initialCur, cur));
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
                var value = new TextDecoder().decode(buffer.subarray(cur, finishCur));
                cur = finishCur;
                texts.push((_b = {}, _b[key] = value, _b));
            }
            else {
                cur += length;
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
exports.parseBuffer = parseBuffer;
var isNovelAiTexts = function (texts) {
    if (texts.some(function (x) {
        return Object.keys(x)[0] === "Software" && Object.values(x)[0] === "NovelAI";
    })) {
        return true;
    }
    return false;
};
exports.isNovelAiTexts = isNovelAiTexts;
var isAutomatic1111Texts = function (texts) {
    if (texts.some(function (x) { return Object.keys(x)[0] === "parameters"; })) {
        return true;
    }
    return false;
};
exports.isAutomatic1111Texts = isAutomatic1111Texts;
var parseNovelAiTexts = function (texts) {
    var _a, _b;
    var commentText = (_a = texts.find(function (x) { return Object.keys(x)[0] === "Comment"; })) === null || _a === void 0 ? void 0 : _a["Comment"];
    var comment = commentText
        ? JSON.parse(commentText)
        : {};
    var prompt = ((_b = texts.find(function (x) { return Object.keys(x)[0] === "Description"; })) === null || _b === void 0 ? void 0 : _b["Description"]) ||
        "";
    var negativePrompt = comment["uc"] || "";
    var settings = Object.keys(comment)
        .filter(function (x) { return x !== "uc"; })
        .reduce(function (acc, key) {
        acc[key] = comment[key];
        return acc;
    }, {});
    return { source: "NovelAI", prompt: prompt, negativePrompt: negativePrompt, settings: settings };
};
exports.parseNovelAiTexts = parseNovelAiTexts;
var parseAutomatic1111Texts = function (texts) {
    var _a, _b, _c;
    var parametersText = (_a = texts.find(function (x) { return Object.keys(x)[0] === "parameters"; })) === null || _a === void 0 ? void 0 : _a["parameters"];
    var parameters = parametersText === null || parametersText === void 0 ? void 0 : parametersText.split("\n");
    var prompt = (parameters === null || parameters === void 0 ? void 0 : parameters[0]) || "";
    var negativePrompt = ((_b = parameters === null || parameters === void 0 ? void 0 : parameters[1]) === null || _b === void 0 ? void 0 : _b.replace(/^Negative prompt: /, "")) || "";
    var settings = {};
    (_c = parameters === null || parameters === void 0 ? void 0 : parameters[2]) === null || _c === void 0 ? void 0 : _c.split(", ").forEach(function (x) {
        var _a = x.split(": "), key = _a[0], value = _a[1];
        if (key !== undefined && value !== undefined) {
            settings[key] = value;
        }
    });
    return {
        source: "Automatic1111",
        prompt: prompt,
        negativePrompt: negativePrompt,
        settings: settings,
    };
};
exports.parseAutomatic1111Texts = parseAutomatic1111Texts;


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
        var texts = (0, png_1.parseBuffer)(arr);
        if ((0, png_1.isNovelAiTexts)(texts)) {
            var description = (0, png_1.parseNovelAiTexts)(texts);
            result.textContent = JSON.stringify(description);
        }
        else if ((0, png_1.isAutomatic1111Texts)(texts)) {
            var description = (0, png_1.parseAutomatic1111Texts)(texts);
            result.textContent = JSON.stringify(description);
        }
        else {
            result.textContent = JSON.stringify(texts);
        }
        result.textContent += JSON.stringify(texts);
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