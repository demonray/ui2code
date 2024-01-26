# UI2Code

设计稿输出代码

## todo

- vue2， vue3
- 组件标签定义，多目标组件库支持
- 预览效果


## Run

```bash
# Install dependencies for both the extension and webview UI source code
npm run install:all

# Build webview UI source code
npm run build:webview

# Package vsix
vsce package
```

Once the sample is open inside VS Code you can run the extension by doing the following:

1. Press `F5` to open a new Extension Development Host window
2. Inside the host window, open the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac) and type `Code Helper: ui2code`
