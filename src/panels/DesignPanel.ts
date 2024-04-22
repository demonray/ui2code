const fs = require("fs");
const path = require("path");

import {
  Disposable,
  Webview,
  WebviewPanel,
  window,
  Uri,
  ViewColumn,
  OpenDialogOptions,
} from "vscode";
// @ts-ignore
import detect from "./Detect";
import { getUri } from "../utilities/getUri";

/**
 * This class manages the state and behavior of HelloWorld webview panels.
 *
 * It contains all the data and methods for:
 *
 * - Creating and rendering HelloWorld webview panels
 * - Properly cleaning up and disposing of webview resources when the panel is closed
 * - Setting the HTML (and by proxy CSS/JavaScript) content of the webview panel
 * - Setting message listeners so data can be passed between the webview and extension
 */
export class DesignPanel {
  public static currentPanel: DesignPanel | undefined;
  private readonly _panel: WebviewPanel;
  private _disposables: Disposable[] = [];

  /**
   * The DesignPanel class private constructor (called only from the render method).
   *
   * @param panel A reference to the webview panel
   * @param extensionUri The URI of the directory containing the extension
   */
  private constructor(panel: WebviewPanel, extensionUri: Uri) {
    this._panel = panel;

    // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
    // the panel or when the panel is closed programmatically)
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Set the HTML content for the webview panel
    this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);

    // Set an event listener to listen for messages passed from the webview context
    this._setWebviewMessageListener(this._panel.webview);
  }

  /**
   * Renders the current webview panel if it exists otherwise a new webview panel
   * will be created and displayed.
   *
   * @param extensionUri The URI of the directory containing the extension.
   */
  public static render(extensionUri: Uri) {
    if (DesignPanel.currentPanel) {
      // If the webview panel already exists reveal it
      DesignPanel.currentPanel._panel.reveal(ViewColumn.One);
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = window.createWebviewPanel(
        // Panel view type
        "showDesign",
        // Panel title
        "UI2code",
        // The editor column the panel should be displayed in
        ViewColumn.One,
        // Extra panel configurations
        {
          // Enable JavaScript in the webview
          enableScripts: true,
        }
      );

      DesignPanel.currentPanel = new DesignPanel(panel, extensionUri);
    }
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    DesignPanel.currentPanel = undefined;

    // Dispose of the current webview panel
    this._panel.dispose();

    // Dispose of all disposables (i.e. commands) for the current webview panel
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  /**
   * Defines and returns the HTML that should be rendered within the webview panel.
   *
   * @remarks This is also the place where references to the Vue webview build files
   * are created and inserted into the webview HTML.
   *
   * @param webview A reference to the extension webview
   * @param extensionUri The URI of the directory containing the extension
   * @returns A template string literal containing the HTML that should be
   * rendered within the webview panel
   */
  private _getWebviewContent(webview: Webview, extensionUri: Uri) {
    // 用iframe加载web
    return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>UI2code</title>
            <style>
                html, body , .iframe-content {
                    width: 100%;
                    height: 100%;
                }
            </style>
            </head>
            <body>
            <iframe
                class="iframe-content"
                src="https://mumblefe.cn/d2cweb/"
                frameborder="0"
            ></iframe>
            </body>
        </html>
    `
    // The CSS file from the Vue build output
    const stylesUri = getUri(webview, extensionUri, ["webview-ui", "build", "assets", "index.css"]);
    // The JS file from the Vue build output
    const scriptUri = getUri(webview, extensionUri, ["webview-ui", "build", "assets", "index.js"]);

    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" type="text/css" href="${stylesUri}">
          <title>Hello World</title>
        </head>
        <body>
          <div id="app"></div>
          <script type="module" src="${scriptUri}"></script>
        </body>
      </html>
    `;
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is recieved.
   *
   * @param webview A reference to the extension webview
   * @param context A reference to the extension context
   */
  private _setWebviewMessageListener(webview: Webview) {
    webview.onDidReceiveMessage(
      (message: any) => {
        const command = message.command;
        const text = message.text;

        switch (command) {
          case "detectimage": // webview 点击上传发送的事件
            this._detect(webview);
            return;
          // Add more switch case statements here as more webview message commands
          // are created within the webview context (i.e. inside media/main.js)
        }
      },
      undefined,
      this._disposables
    );
  }
  // 选择文件并调用服务接口识别
  private async _detect(webview: Webview) {
    const options: OpenDialogOptions = {
      canSelectMany: false, // 允许同时选择多个文件，这里设置为false表示只能选择一个文件
      openLabel: "选择",
      filters: {
        Images: ["png", "jpg"],
      },
    };
    const fileUri = await window.showOpenDialog(options);
    if (fileUri && fileUri.length > 0) {
      // 用户选择了一个文件
      const filePath = fileUri[0].fsPath;
      console.log(`选定的文件: ${filePath}`);
      const fileName = path.basename(filePath);
      const fileData = fs.readFileSync(filePath);
      try {
        detect(
          {
            file: fileData,
            fileName,
          },
          {
            UI_DETECT: "https://mumblefe.cn/d2c/api",
            OCR: "https://mumblefe.cn/d2c/ocr",
          }
        ).then(({ uiResults, textResults }: any) => {
          console.log(uiResults, textResults);
          webview.postMessage({
            command: "detectimage_result",
            data: {
              uiResults,
              textResults,
            },
          });
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      // 用户没有选择任何文件或取消了操作
      console.log("没有选定文件");
    }
  }
}
