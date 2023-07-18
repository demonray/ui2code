<script setup lang="ts">
// import { vscode } from "./utilities/vscode";
import { ref, reactive } from "vue";
import type { UploadFile } from "element-plus";
import Design from "./Design.vue";
import Preview from "./Preview.vue";
import Detect from "./lib";

let designJson: DesignJson = reactive({
  fields: [],
  metaInfo: {},
});

const designPreview = ref(false);

let previewConf = reactive<{ data: SandboxTemplateConfig }>({
  data: {
    files: {},
    template: "vue",
    main: "",
    environment: "vue-cli",
  },
});

const status = ref('')

function onUpload(uploadFile: UploadFile) {
  status.value = '识别中，请稍候...'
  Detect(uploadFile.raw as File).then(({ fields, metaInfo }) => {
    status.value = '';
    designJson.fields = fields;
    designJson.metaInfo = metaInfo;
  });
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
  <design
    v-show="!designPreview"
    :json="designJson"
    :status="status"
    @upload="onUpload"
    @preview="onPreview"
  />
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
