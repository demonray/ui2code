# `webview-ui` Directory

设计界面

## todo

- [ ] 增加支持的组件类型 Steps、Pagination、Tabs、Modal、Progress、Menu
- [ ] 组件识别准确率提高及纠错
- [ ] 生成代码完善各个组件 props 属性、状态信息、默认值
- [ ] Table 编辑列，组件列
- [ ] 设计页面打包成 VSCode 插件
- [ ] 页面属性
- [ ] 内置常用表单正则设置
- [ ] 组件尺寸信息
- [ ] Modal-Row-Items children 嵌套情况

常见的 Modal Form 表单提交
常见的分页表格页面

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
