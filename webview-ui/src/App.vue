<script setup lang="ts">
import { vscode } from "./utilities/vscode";
import { ref, reactive, onMounted } from "vue";
import type { UploadFile } from "element-plus";
import Design from "./Design.vue";
import Preview from "./Preview.vue";
import DetectResult from "./DetectResult.vue";
import { detect, generateUIList } from "./lib";

//@ts-ignore
import uiResult from "../test_images/form1_ui";
//@ts-ignore
import textRes from "../test_images/form1_text";

let designJson: DesignJson = reactive({
  fields: [],
  metaInfo: {},
});

const designPreview = ref(1);

let previewConf = reactive<{ data: SandboxTemplateConfig }>({
  data: {
    files: {},
    template: "vue",
    main: "",
    environment: "vue-cli",
  },
});

const status = ref("");

function onUpload(uploadFile: UploadFile) {
  status.value = "识别中，请稍候...";
  detect(uploadFile.raw as File).then(({ fields, metaInfo }) => {
    status.value = "";
    // designPreview.value = 3;
    designJson.fields = fields;
    designJson.metaInfo = metaInfo;
  });
}

window.addEventListener("message", (event) => {
  const message = event.data;
  switch (message.command) {
    // vscode 插件识别发送消息过来
    case "detectimage_result":
      status.value = "";
      generateUIList(message.data.uiResults, message.data.textResults).then(
        ({ fields, metaInfo }) => {
          status.value = "";
          designPreview.value = 3;
          designJson.fields = fields;
          designJson.metaInfo = metaInfo;
        }
      );
      break;
    // 识别结果labelimg 调整确认发送过来消息
    case "ui2code_confirm_detect_data":
      // 调整后的组件数据列表重新合并
      console.log(message.data, designJson.metaInfo.textResults)
      if (message.data && message.data.length) {
        generateUIList(message.data, designJson.metaInfo.textResults).then(
          ({ fields, metaInfo }) => {
            designPreview.value = 1;
            status.value = "";
            designJson.fields = [...fields];
            designJson.metaInfo = metaInfo;
          }
        );
      }

      break;
  }
});

//// for dev test
generateUIList(uiResult.result.bbox, textRes.data).then(({ fields, metaInfo }) => {
  // designPreview.value = 3;
  designJson.fields = fields;
  designJson.metaInfo = {
    imageRes: {
      ui: uiResult.result,
      text: textRes,
    },
    ...metaInfo,
  };
});

function onPreview(params: SandboxTemplateConfig) {
  designPreview.value = 2;
  previewConf.data = params;
}
function back() {
  designPreview.value = 1;
}
function download() {}
onMounted(() => {
})
</script>

<template>
  <div v-show="designPreview == 2">
    <div class="action_bar">
      <el-button type="text" @click="back"> 返回设计 </el-button>
      <el-button type="text" @click="download"> 下载代码 </el-button>
    </div>
    <preview :params="previewConf.data"></preview>
  </div>
  <design
    v-show="designPreview == 1"
    :json="designJson"
    :status="status"
    @upload="onUpload"
    @preview="onPreview"
  />
  <detect-result v-if="designPreview == 3" :data="designJson.metaInfo" />
</template>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: var(--el-bg-color);
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
