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
    │   ├── DraggableItem.tsx       # 设计器中部拖拽组件
    │   ├── Preview.vue             # codesandbox 沙箱预览
    │   ├── RightPanel.vue          # 组件信息配置面板
    │   ├── components
    │   │   └──target               # 转换成目标组件库template script
    │   │      ├── element-plus
    │   │      └── fes-design
    │   ├── config
    │   ├── hooks                   # 提供获取数据及合并数据
    │   ├── icons
    │   ├── lib.ts                  # 提供UI图片组件识别结果能力的封装库
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

1. 模型识别Tabs、Menu、Tree、Tooltip、Calendar、Alert、Rate、Badge、Timeline -- 进行中
2. 组件识别准确率提高 -- 进行中
3. 识别结果纠错（提供识别结果预览，手动修改组建类型）-- 已开发
4. 生成代码尽量还原各个组件 props 属性、状态信息、默认值。比如steps是垂直还是水平，各个step文本等类似的地方
   截图是form表单，还是页面，或者弹窗，最终输出代码有无Form或者Modal包裹优化（通过模型来识别还是通过已识别的👣信息来判断？）
5. 设计页面打包成 VSCode 插件 -- 开发中
6. 内置常用表单正则设置

以上1，2两点ui2code_service部分模型训练优化
纠错及3-6部分在本项目web端里生成目标组件库代码里实现。
组件信息参考config/componentType.ts，生成代码时根据目标组件库使用对应generator下相应的代码，
目录为components/generator/target，各个实现适配各个目标组件库的写法需符合：

```javascript
type LibInterface = {
  // 生成目标组件库代码
  generateCode: (data: FormConf, type: string, metaInfo: any) => string;
  // 生成sanbbox预览文件
  getSandboxTpl: (code: string, local: boolean) => string | SandboxTemplateConfig;
  getPlaygoundUrl?: (code: string) => string;
};
```
其中生成代码部分需要提供生成的文件内容字符串，其它目标组件库可参考components/generator/targetelement-plus实现，预览可以通过getPlaygoundUrl配置自定义的地址

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

interface DetectItem {
    x: number;
    y: number;
    w: number;
    h: number;
    prob: number;
    class: UiType;
    [propName: string]: any;
}
interface TextItem {
    confidence: number;
    text: string;
    text_region: TextRegion;
    x?: number;
    y?: number;
}
generateUIList(
    uiResults: DetectItem[],
    textResults: TextItem[]
).then(({ fields, metaInfo }) => {
  //
});
```
