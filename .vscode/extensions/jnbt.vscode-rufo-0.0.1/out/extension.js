"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatter_1 = require("./formatter");
const DOCUMENT_SELECTOR = [
    { language: 'ruby', scheme: 'file' },
    { language: 'ruby', scheme: 'untitled' },
];
function activate(context) {
    // register Rufo-based formatter
    formatter_1.default(context, DOCUMENT_SELECTOR);
}
exports.activate = activate;
function deactivate() {
    // nothing yet
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map