"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
// https://marketplace.visualstudio.com/items?itemName=aaronbushnell.rebound-delete
class SoftDelete {
    constructor(context) {
        // The command has been defined in the package.json file
        // Now provide the implementation of the command with  registerCommand
        // The commandId parameter must match the command field in package.json
        const disposable = vscode_1.commands.registerCommand('metaGo.delete.softDelete', this.softDelete);
        context.subscriptions.push(disposable);
    }
    softDelete() {
        const editor = vscode_1.window.activeTextEditor;
        const doc = editor.document;
        const start = editor.selections[0].start;
        let lines = [];
        if (start.line === 0 && start.character === 0) {
            return false;
        }
        for (let i = 0; i < editor.selections.length; i++) {
            const selection = editor.selections[i];
            if (selection.start.character === 0) {
                lines.push({
                    startLine: selection.start.line,
                    startCharacter: selection.start.character,
                    endLine: selection.start.line - 1,
                    endCharacter: 999999999
                });
            }
            else {
                lines.push({
                    startLine: selection.start.line,
                    startCharacter: selection.start.character,
                    endLine: selection.start.line,
                    endCharacter: 0
                });
            }
        }
        return editor.edit(editorBuilder => {
            let range;
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                range = new vscode_1.Range(line.startLine, line.startCharacter, line.endLine, line.endCharacter);
                editorBuilder.delete(range);
            }
        });
    }
}
exports.SoftDelete = SoftDelete;
//# sourceMappingURL=soft-delete.js.map