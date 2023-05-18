<script setup lang="ts">
// import { vscode } from "./utilities/vscode";
import { ref, reactive, watch } from "vue";
import type { UploadFile } from "element-plus";
import Design from "./Design.vue";
import Preview from "./Preview.vue";
import useDetectService from "./hooks/useDetectService";
import useMergeDetectData from "./hooks/useMergeDetectData";

const { status, detectUI, detectText, detectStructure, getResult } = useDetectService();

let designJson: DesignJson = reactive({
  fields: [],
});

watch([() => status.component, () => status.text, () => status.structure], (v) => {
  const { uiResults, textResults, structures } = getResult();
  if (v[0] === "FINISH" && v[1] === "SUCCESS" && v[2] === "SUCCESS") {
    const fields = useMergeDetectData(uiResults, textResults, structures);
    designJson.fields = fields;
  }
});

const { uiResults, textResults, structures } = getResult();
const fields = useMergeDetectData(uiResults, textResults, []);
designJson.fields = fields;

const designPreview = ref(false);

let previewConf = reactive<{ data: SandboxTemplateConfig }>({
  data: {
    files: {},
    template: "vue",
    main: "",
    environment: "vue-cli",
  },
});

function onUpload(uploadFile: UploadFile) {
  detectUI(uploadFile);
  detectText(uploadFile);
  detectStructure(uploadFile);
}

function onPreview(params: SandboxTemplateConfig) {
  designPreview.value = true;
  previewConf.data = params;
}
function back() {
  designPreview.value = false;
}
function download() {}
</script>

<template>
  <div v-show="designPreview">
    <div class="action_bar">
      <el-button type="text" @click="back"> 返回设计 </el-button>
      <el-button type="text" @click="download"> 下载代码 </el-button>
    </div>
    <preview :params="previewConf.data"></preview>
  </div>
  <design v-show="!designPreview" :json="designJson" :status="status.msg" @upload="onUpload" @preview="onPreview" />
</template>

<style>
body {
  margin: 0;
  padding: 0;
}
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
}
.action_bar {
  padding: 0 10px;
}
</style>
