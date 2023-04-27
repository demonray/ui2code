<script setup lang="ts">
// import { vscode } from "./utilities/vscode";
import { ref, reactive, watch } from "vue";
import type { UploadFile } from "element-plus";
import Design from "./Design.vue";
import Preview from "./Preview.vue";
import useDetectService from "./hooks/useDetectService";
import useMergeDetectData from "./hooks/useMergeDetectData";

const { status, detectUI, detectText, getResult } = useDetectService();

let designJson: DesignJson = reactive({
    fields: []
});

watch([() => status.component, () => status.text], (v) => {
  const {uiResults, textResults} = getResult()
  if (v[0] === "FINISH" && v[1] === "SUCCESS") {
    const fields = useMergeDetectData(uiResults, textResults);
    designJson.fields = fields
  }
});

const {uiResults, textResults} = getResult()
const fields = useMergeDetectData(uiResults, textResults);

// let fields = useMergeDetectData([], []);
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
}

function onPreview(params: SandboxTemplateConfig) {
  designPreview.value = true;
  previewConf.data = params;
}
</script>

<template>
  <preview v-if="designPreview" :params="previewConf.data"></preview>
  <design v-else :json="designJson" :status="status.msg" @upload="onUpload" @preview="onPreview" />
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
</style>
