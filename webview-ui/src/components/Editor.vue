<script setup lang="ts">
import { onMounted, watch, onUnmounted, ref } from "vue";
import useCurrentInstance from "../hooks/useCurrentInstance";

import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
// @ts-ignore: worker 导入方式可以参考vite官网 https://cn.vitejs.dev/guide/features.html#web-workers
self.MonacoEnvironment = {
  // 提供一个定义worker路径的全局变量
  getWorker(_: any, label: string) {
    if (label === "json") {
      return new jsonWorker();
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker();
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker();
    }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker(); // 基础功能文件， 提供了所有语言通用功能 无论使用什么语言，monaco都会去加载他。
  },
};

monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);

const props = defineProps({
  value: {
    type: String,
    default: "",
  },
  language: {
    type: String,
    default: "json",
  },
});

const { proxy } = useCurrentInstance();
// Monaco Editor Options
const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  "lineNumbers": "on", // 行号
  "wordWrap": "on", // 自动换行
  "readOnly": false, // 是否只读
  "automaticLayout": true,
  "glyphMargin": true,
  "showFoldingControls": "always",
  "formatOnPaste": true,
  "formatOnType": true,
  "folding": true,
  "theme": "vs",
  "minimap": {
    // 缩略图
    enabled: false,
  },
  "semanticHighlighting.enabled": true, // 高亮
};

let monacoInstance: monaco.editor.IStandaloneCodeEditor;

onMounted(() => {
  // 编辑器实例化
  if (proxy && proxy.$refs) {
    const modelUri = monaco.Uri.parse("a://b/foo.json"); // a made up unique URI for our model
    const model = monaco.editor.createModel(props.value, props.language, modelUri);
    monacoInstance = monaco.editor.create(proxy.$refs.monaco as HTMLElement, {
      ...editorOptions,
      model,
    });
    setTimeout(() => {
      formatCode();
    }, 1000);
  }
  // this.model = monacoInstance.getModel()
});

function formatCode() {
  monacoInstance?.getAction("editor.action.formatDocument").run(); //自动格式化代码
  monacoInstance.setValue(monacoInstance.getValue());//再次设置
}

watch(
  () => props.value,
  (v) => {
    monacoInstance?.setValue(v);
    formatCode();
  }
);

onUnmounted(() => {
  monacoInstance.dispose();
});
</script>
<template>
  <div ref="monaco" class="editor"></div>
</template>
<style lang="scss" scoped>
.editor {
  min-width: 600px;
  min-height: 500px;
}
</style>
>
