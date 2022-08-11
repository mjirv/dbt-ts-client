"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toKebabCase = void 0;
// courtesy of Arad at https://stackoverflow.com/a/70226943
function toKebabCase(str) {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
exports.toKebabCase = toKebabCase;
