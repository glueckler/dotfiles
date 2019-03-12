"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
String.prototype.findLastIndex = function (predicate, columnNumber) {
    if (typeof columnNumber === 'undefined') {
        columnNumber = this.length;
    }
    for (let i = columnNumber; i >= 0; i--) {
        if (predicate(this[i])) {
            return i;
        }
    }
    return -1;
};
class SmartDelete {
    constructor(context) {
        this.coupleCharacter = [
            "()",
            "[]",
            "<>",
            "{}",
            "''",
            "``",
            '""',
        ];
        this.config = {};
        const disposableHungry = vscode_1.commands.registerCommand('metaGo.delete.hungryDelete', this.hungryDelete);
        const disposableSmart = vscode_1.commands.registerCommand('metaGo.delete.smartBackspace', this.smartBackspace);
        context.subscriptions.push(disposableHungry);
        context.subscriptions.push(disposableSmart);
    }
    setConfig(newConfig) {
        if (newConfig && Object.keys(newConfig)) {
            Object.assign(this.config, newConfig);
        }
    }
    getKeepOneSpaceSetting() {
        if (!this.config["debug"]) {
            this.config['hungryDelete.keepOneSpace'] = vscode_1.workspace.getConfiguration().get('hungryDelete.keepOneSpace');
        }
        return this.config['hungryDelete.keepOneSpace'];
    }
    backtraceAboveLine(doc, cursorLineNumber) {
        // backtrace the first non-empty character position
        let backtraceLineNumber = cursorLineNumber - 1;
        let empty = true;
        while (backtraceLineNumber >= 0 && empty) {
            empty = doc.lineAt(backtraceLineNumber).isEmptyOrWhitespace;
            if (empty) {
                backtraceLineNumber--;
            }
        }
        let startPosition;
        if (backtraceLineNumber < 0) {
            startPosition = new vscode_1.Position(0, 0);
        }
        else {
            const nonEmptyLine = doc.lineAt(backtraceLineNumber);
            startPosition = nonEmptyLine.range.end; // it is the one after the last character (which may be space)!
        }
        return startPosition;
    }
    backtraceInLine(doc, cursorLine, cursorPosition) {
        const text = cursorLine.text;
        let charIndexBefore = cursorPosition.character - 1;
        let wordRange = doc.getWordRangeAtPosition(cursorPosition);
        let wordRangeBefore = doc.getWordRangeAtPosition(new vscode_1.Position(cursorPosition.line, charIndexBefore));
        // the cursor is at within word, end of word
        // and special case aaa |bbb but not include aaa |EOL
        if (wordRange && wordRangeBefore) {
            return wordRangeBefore.start;
        }
        else {
            // the cursor is at a whitespace
            let nonEmptyCharIndex = text.findLastIndex(theChar => /\S/.test(theChar), charIndexBefore);
            let offset = charIndexBefore - nonEmptyCharIndex;
            let deleteWhiteSpaceOnly = (offset > 1);
            if (deleteWhiteSpaceOnly) {
                return new vscode_1.Position(cursorPosition.line, nonEmptyCharIndex + 1);
            }
            else {
                // delete a space with the entire word at left
                // in consistent to the exisiting implementation of "deleteWorldLeft"
                wordRange = doc.getWordRangeAtPosition(new vscode_1.Position(cursorPosition.line, nonEmptyCharIndex));
                if (wordRange) {
                    return wordRange.start;
                }
                else {
                    // For edge case : If there is Word Seperator, e.g. @ or =  - its word range is undefined
                    // the exisiting implementation of "deleteWorldLeft" is to delete all of them "@@@@@|3333 444" => "333 4444"
                    let separatorChar = text.charAt(nonEmptyCharIndex);
                    const nonSeparatorIndex = text.findLastIndex(theChar => theChar !== separatorChar, nonEmptyCharIndex - 1);
                    const endIdx = (nonSeparatorIndex < 0) ? 0 : (nonSeparatorIndex + 1);
                    return new vscode_1.Position(cursorPosition.line, endIdx);
                }
            }
        }
    }
    findDeleteRange(doc, selection) {
        if (!selection.isEmpty) {
            return new vscode_1.Range(selection.start, selection.end);
        }
        const cursorPosition = selection.active;
        const cursorLineNumber = cursorPosition.line;
        const cursorLine = doc.lineAt(cursorPosition);
        const hungryDeleteAcrossLine = cursorLine.isEmptyOrWhitespace || (cursorPosition.character <= cursorLine.firstNonWhitespaceCharacterIndex);
        /* Determine the delete range */
        const startPosition = (hungryDeleteAcrossLine)
            ? this.backtraceAboveLine(doc, cursorLineNumber)
            : this.backtraceInLine(doc, cursorLine, cursorPosition);
        const endPosition = cursorPosition;
        return new vscode_1.Range(startPosition, endPosition);
    }
    hungryDelete() {
        /* Edior and doc */
        const editor = vscode_1.window.activeTextEditor;
        const doc = editor.document;
        const deleteRanges = editor.selections.map(selection => this.findDeleteRange(doc, selection));
        // it includs the startPosition but exclude the endPositon
        // This is in one transaction
        const returned = editor.edit(editorBuilder => deleteRanges.forEach(range => editorBuilder.delete(range)));
        // Adjust the viewport
        if (deleteRanges.length <= 1) {
            editor.revealRange(new vscode_1.Range(editor.selection.start, editor.selection.end));
        }
        return returned;
    }
    findSmartBackspaceRange(doc, selection) {
        if (!selection.isEmpty) {
            return new vscode_1.Range(selection.start, selection.end);
        }
        const cursorPosition = selection.active;
        const cursorLineNumber = cursorPosition.line;
        const cursorLine = doc.lineAt(cursorPosition);
        let isSmartBackspace = (cursorLineNumber > 0) && (cursorPosition.character <= cursorLine.firstNonWhitespaceCharacterIndex);
        if (isSmartBackspace) {
            let aboveLine = doc.lineAt(cursorLineNumber - 1);
            let aboveRange = aboveLine.range;
            if (aboveLine.isEmptyOrWhitespace) {
                return new vscode_1.Range(aboveRange.start, aboveRange.start.translate(1, 0));
            }
            else {
                let lastWordPosition = this.backtraceAboveLine(doc, cursorLineNumber);
                let keepOneSpaceSetting = this.getKeepOneSpaceSetting();
                let a = doc.getText(new vscode_1.Range(lastWordPosition.translate(0, -1), lastWordPosition));
                let isKeepOneSpace = keepOneSpaceSetting &&
                    // For better UX ?
                    // Don't add space if current line is empty
                    !cursorLine.isEmptyOrWhitespace &&
                    // Only add space if there is no space
                    /\S/.test(a);
                if (isKeepOneSpace) {
                    return [lastWordPosition, new vscode_1.Range(lastWordPosition, cursorPosition)];
                }
                else {
                    return new vscode_1.Range(lastWordPosition, cursorPosition);
                }
            }
        }
        else if (cursorPosition.line == 0 && cursorPosition.character == 0) {
            // edge case, otherwise it will failed
            return new vscode_1.Range(cursorPosition, cursorPosition);
        }
        else {
            // inline
            let positionBefore = cursorPosition.translate(0, -1);
            let positionAfter = cursorPosition.translate(0, 1);
            let peekBackward = doc.getText(new vscode_1.Range(positionBefore, cursorPosition));
            let peekForward = doc.getText(new vscode_1.Range(cursorPosition, positionAfter));
            let isAutoClosePair = ~this.coupleCharacter.indexOf(peekBackward + peekForward);
            return (isAutoClosePair) ?
                new vscode_1.Range(positionBefore, positionAfter) :
                new vscode_1.Range(positionBefore, cursorPosition); // original backsapce
        }
    }
    smartBackspace() {
        const editor = vscode_1.window.activeTextEditor;
        const doc = editor.document;
        const deleteRanges = editor.selections.map(selection => this.findSmartBackspaceRange(doc, selection));
        const returned = editor.edit(editorBuilder => deleteRanges.forEach(range => {
            if (range instanceof vscode_1.Range) {
                editorBuilder.delete(range);
            }
            else {
                let position = range[0];
                editorBuilder.insert(position, " ");
                editorBuilder.delete(range[1]);
            }
        }));
        if (deleteRanges.length <= 1) {
            editor.revealRange(new vscode_1.Range(editor.selection.start, editor.selection.end));
        }
        return returned;
    }
}
exports.SmartDelete = SmartDelete;
//# sourceMappingURL=smart-delete.js.map