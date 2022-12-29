# wb-snippets README

共享有价值代码片段/模版，代码片段可以提高代码编写效率，提供一个插件和平台, 收集和使用常用代码片段。

## Features

 - 从snippets管理台下载snippets到项目（管理台提供代码片共享，用户可以选择组合使用）
   接口方式使用代码模版（接口方式获取复杂的代码片段，单文件或者多文件）
 - code generator（参考form generator，对接行内UI组件库，拖拽式生成代码）
 - 和第三方系统联动（比如ApiDesigin接口数据字段获取，mock数据生成）
 - UI to code（设计图生成代码）

## Requirements

    snippets管理台

## Run

```bash
# Install dependencies for both the extension and webview UI source code
npm run install:all

# Build webview UI source code
npm run build:webview

```

Once the sample is open inside VS Code you can run the extension by doing the following:

1. Press `F5` to open a new Extension Development Host window
2. Inside the host window, open the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac) and type `Code Helper: uitocode`
