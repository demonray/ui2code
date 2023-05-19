# `webview-ui` Directory

设计界面

## todo

- [ ] 增加支持的组件类型 Steps、Pagination、Tabs、Modal、Progress、Menu
- [ ] 组件识别准确率提高及纠错
- [ ] 生成代码完善各个组件props属性、状态信息、默认值
- [ ] Form表单校验 提交
- [ ] Table 编辑列，组件列
- [ ] 设计页面打包成VSCode插件
- [ ] 页面属性
- [ ] 内置常用表单正则设置
- [ ] chatgpt https://github.com/gencay/vscode-chatgpt
- [ ] https://github.com/dogukanakkaya/openai-helper-vscode-extension

常见的弹窗Form表单
常见的分页表格页面

菜单-》触发prompt-》chatGPT响应-》postMessage-》WebView

vscode插件与webview相互通信
https://blog.csdn.net/zhouhangzooo/article/details/89040623

webview 发送：
vscode.postMessage({
    command: 'openHint',
    text: '试着输入 helloword '
})

插件接收：
panel.webview.onDidReceiveMessage(message => {
    switch (message.command) {

        case 'openHint':
            vscode.window.showInformationMessage(message.text, {
                modal: true
            });
            break;
        default:

    }

}, undefined, context.subscriptions);

插件发送：
var panel;
panel.webview.postMessage({ command: value });

webview接收：
window.addEventListener('message', event => {
    const message = event.data;
    if (message.command == undefined || !message.command) {
        // console.log('---------------------------message：aaaa');
        return;
    }
    // console.log('---------------------------message：' + message.command);
    courseId = message.command;
    //下面可以作自己的处理
});
