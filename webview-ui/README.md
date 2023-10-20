# `webview-ui` Directory
目录包含创建vscode插件的部分，其中webview-ui为现在ui2code web端部分
```
├── README.md
├── docs
│   ├── extension-commands.md
│   ├── extension-development-cycle.md
│   └── extension-structure.md
├── node_modules
├── out
│   ├── extension.js
│   ├── extension.js.map
│   ├── panels
│   └── utilities
├── package-lock.json
├── package.json
├── src
│   ├── extension.ts
│   ├── panels
│   └── utilities
├── tsconfig.json
└── webview-ui                      # ui2code web端
    ├── README.md
    ├── build
    ├── dist
    ├── env.d.ts
    ├── index.html
    ├── node_modules
    ├── package-lock.json
    ├── package.json
    ├── public
    ├── src
    │   ├── App.vue
    │   ├── CodeTypeDialog.vue      # 目标组件库选择及预览方式选择
    │   ├── Design.vue              # 设计器
    │   ├── DraggableItem.tsx
    │   ├── Preview.vue             # codesandbox 沙箱预览
    │   ├── RightPanel.vue          # 组件信息配置面板
    │   ├── components
    │   │   └──target               # 转换成目标组件库template script
    │   │      ├── element-plus
    │   │      └── fes-design
    │   ├── config
    │   ├── hooks
    │   ├── icons
    │   ├── lib.ts
    │   ├── main.ts
    │   ├── styles
    │   └── utilities
    ├── test_images
    ├── tsconfig.json
    ├── tsconfig.vite-config.json
    ├── ui2code.d.ts
    └── vite.config.ts
```
## todo

- 常见的 Modal Form 表单提交
- 常见的分页表格页面

1. 增加支持的组件类型 Steps、Pagination、Tabs、Modal、Progress、Menu
2. 组件识别准确率提高及纠错
3. 生成代码完善各个组件 props 属性、状态信息、默认值
4. Table 编辑列，组件列
5. 设计页面打包成 VSCode 插件
6. 页面属性
7. 内置常用表单正则设置
8. 组件尺寸信息
9. Modal-Row-Items children 嵌套情况

以上1，2两点ui2code_service部分模型训练优化，纠错及3-9部分在web端里生成目标组件库代码事实现。
组件信息参考config/componentType.ts，生成代码时根据目标组件库使用对应generator下相应的代码。


## 提供组件封装检查服务和识别结果输出

#### 上传图片（支持配置服务接口路径）

```js
import { detect } from "./lib";

detect(uploadFile.raw as File).then(({ fields, metaInfo }) => {
    //
});

detect(uploadFile.raw as File, {
  UI_DETECT: "http://x.x.x.x/api",
  OCR: "http://x.x.x.x/ocr",
}).then(({ fields, metaInfo }) => {
    //
});
```

#### 合并数据

```js
import { generateUIList } from "./lib";

generateUIList(uiResult.result.bbox, textRes.data).then(({ fields, metaInfo }) => {
  //
});
```
