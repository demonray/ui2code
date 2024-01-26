"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode_1 = require("vscode");
const DesignPanel_1 = require("./panels/DesignPanel");
function activate(context) {
    // Create the show hello world command
    const showDesignCommand = vscode_1.commands.registerCommand("ui2code", () => {
        DesignPanel_1.DesignPanel.render(context.extensionUri);
    });
    // Add command to the extension 
    context.subscriptions.push(showDesignCommand);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map