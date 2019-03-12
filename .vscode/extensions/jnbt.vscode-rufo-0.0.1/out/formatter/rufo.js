"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cp = require("child_process");
const vscode = require("vscode");
const DEFAULT_OPTIONS = {
    exe: "rufo",
    useBundler: false
};
class Rufo {
    constructor() {
        this.spawn = (args, spawnOpt = {}) => {
            const exe = this.exe;
            if (!spawnOpt.cwd) {
                spawnOpt.cwd = vscode.workspace.rootPath;
            }
            const cmd = exe.shift();
            return cp.spawn(cmd, exe.concat(args), spawnOpt);
        };
    }
    test() {
        return new Promise((resolve, reject) => {
            const rufo = this.spawn(['-v']);
            rufo.on('error', err => {
                console.warn(err);
                if (err.message.includes('ENOENT')) {
                    vscode.window.showErrorMessage(`couldn't find ${this.exe} for formatting (ENOENT)`);
                }
                else {
                    vscode.window.showErrorMessage(`couldn't run ${this.exe} '${err.message}'`);
                }
                reject(err);
            });
            rufo.stderr.on('data', data => {
                // for debugging
                console.log(`Rufo stderr ${data}`);
            });
            rufo.on('exit', code => {
                if (code) {
                    vscode.window.showErrorMessage(`Rufo failed with exit code: ${code}`);
                    return reject();
                }
                resolve();
            });
        });
    }
    format(data, fileName) {
        return new Promise((resolve, reject) => {
            const args = ["-x"]; // Simple exit codes: 1 or 0
            if (fileName) {
                args.push(`--filename=${fileName}`);
            }
            const rufo = this.spawn(args);
            let result = '';
            rufo.on('error', err => {
                console.warn(err);
                vscode.window.showErrorMessage(`couldn't run ${this.exe} '${err.message}'`);
                reject(err);
            });
            rufo.stdout.on('data', data => {
                result += data.toString();
            });
            rufo.on('exit', code => {
                if (code) {
                    vscode.window.showErrorMessage(`Rufo failed with exit code: ${code}`);
                    return reject();
                }
                resolve(result);
            });
            rufo.stdin.write(data);
            rufo.stdin.end();
        });
    }
    get exe() {
        const { exe, useBundler } = this.options;
        return useBundler ? [`bundle exec ${exe}`] : [exe];
    }
    get options() {
        const config = vscode.workspace.getConfiguration('rufo');
        const opts = Object.assign({}, DEFAULT_OPTIONS, config);
        return opts;
    }
}
exports.default = Rufo;
//# sourceMappingURL=rufo.js.map