<script setup lang="ts">
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import { ref, onMounted, watch, onUnmounted } from "vue";
import useCurrentInstance from "./hooks/useCurrentInstance";

const props = defineProps({
  value: {
    type: String,
    default: "",
  },
});

const { proxy } = useCurrentInstance();
// Monaco Editor Options
const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  // automaticLayout:true,
  // folding: true,
  "language": "plaintext",
  "theme": "myCustomTheme", // 主题
  "lineNumbers": "on", // 行号
  "wordWrap": "off", // 自动换行
  "readOnly": false, // 是否只读
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
    monacoInstance = monaco.editor.create(proxy.$refs.monaco as HTMLElement, {
      value: props.value,
      ...editorOptions,
    });
  }
  // this.model = monacoInstance.getModel()
});

watch(()=>props.value, (v)=>{
    monacoInstance?.setValue(v)
});

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
