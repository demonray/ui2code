import { commands, ExtensionContext } from "vscode";
import { DesignPanel } from "./panels/DesignPanel";

export function activate(context: ExtensionContext) {
  // Create the show hello world command
  const showDesignCommand = commands.registerCommand("ui2code", () => {
    DesignPanel.render(context.extensionUri);
  });

  // Add command to the extension 
  context.subscriptions.push(showDesignCommand);
}
