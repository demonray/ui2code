<template>
  <div class="container">
    <div class="left-board">
      <el-scrollbar class="left-scrollbar">
        <div class="components-list">
          <div v-for="(item, listIndex) in leftComponents" :key="listIndex">
            <div class="components-title">
              <svg-icon name="component" />
              {{ item.title }}
            </div>
            <draggable
              class="components-draggable"
              :list="item.list"
              item-key="name"
              :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
              :clone="cloneComponent"
              :sort="false"
            >
              <template #item="{ element }">
                <div class="components-body" @click="addComponent(element)">
                  <svg-icon :name="element.__config__.tagIcon" />
                  {{ element.__config__.label }}
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <div class="center-board">
      <div class="action-bar">
        <div class="detect-msg">{{ props.status }}</div>
        <el-upload
          style="display: inline-block; vertical-align: top"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleChange"
        >
          <template #trigger>
            <el-button class="action-btn-item" type="text">
              <svg-icon name="upload" />
              上传图片
            </el-button>
          </template>
        </el-upload>
        <el-button type="text" @click="genCode">
          <svg-icon name="file" />
          生成vue文件
        </el-button>
        <el-button class="action-btn-item" type="text" @click="copyCode">
          <svg-icon name="copy" />
          复制代码
        </el-button>
        <el-button class="action-btn-item delete-btn" type="text" @click="empty">
          <svg-icon name="delete" />
          清空
        </el-button>
      </div>
      <el-scrollbar class="center-scrollbar">
        <el-row class="center-board-row" :gutter="formConf.gutter">
          <el-form
            :size="formConf.size"
            :label-position="formConf.labelPosition"
            :disabled="formConf.disabled"
            :label-width="formConf.labelWidth + 'px'"
          >
            <draggable
              class="drawing-board"
              :list="drawingList"
              item-key="name"
              :animation="340"
              group="componentsGroup"
            >
              <template #item="{ index, element }">
                <draggable-item
                  :index="index"
                  :current-item="element"
                  :active-index="activeIndex"
                  @active-item="activeFormItem"
                  @copy-item="drawingItemCopy"
                  @delete-item="drawingItemDelete"
                />
              </template>
            </draggable>
            <div v-show="!drawingList.length" class="empty-info">
              从左侧拖入或点选组件进行表单设计
            </div>
          </el-form>
        </el-row>
      </el-scrollbar>
    </div>

    <right-panel
      v-if="activeData"
      :active-data="activeData"
      :form-conf="formConf"
      :show-field="!!drawingList.length"
      @tag-change="tagChange"
    />

    <code-type-dialog v-model="dialogVisible" title="选择生成类型" @confirm="confrimGenerate" />
    <input id="copyNode" type="hidden" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, onUnmounted, nextTick } from "vue";
import { makeUpHtml, vueTemplate, vueScript, cssStyle } from "./components/generator/html";
import { deepClone } from "./utilities/index";
import useCurrentInstance from "./hooks/useCurrentInstance";
import draggable from "vuedraggable";
import ClipboardJS from "clipboard";
import type { UploadFile } from "element-plus";
// import Preview from "./Preview.vue";
import RightPanel from "./RightPanel.vue";
import {
  inputComponents,
  selectComponents,
  layoutComponents,
  formConfig,
} from "./config/componentType";
import CodeTypeDialog from "./CodeTypeDialog.vue";
import DraggableItem from "./DraggableItem";

const leftComponents = [
  {
    title: "输入型组件",
    list: inputComponents,
  },
  {
    title: "选择型组件",
    list: selectComponents,
  },
  {
    title: "布局型组件",
    list: layoutComponents,
  },
];

const emit = defineEmits(["upload"]);

let drawingList: ComponentItemJson[] = reactive([]);

const formConf = reactive(formConfig);
const props = defineProps<{
  json: DesignJson,
  status?: string
}>();

watch(props.json, (v) => {
  initDrawingList(v);
});

const activeData = computed<ComponentItemJson>({
  get: () => drawingList[activeIndex.value],
  set: (val) => {
    drawingList[activeIndex.value].value = val;
  },
});

let optration: "copy" | "download";
let saveType = reactive({
  fileName: "",
  type: "file",
});

const dialogVisible = ref(false);

onMounted(() => {
  const { proxy } = useCurrentInstance();
  const clipboard = new ClipboardJS("#copyNode", {
    text: () => {
      const codeStr = generateCode();
      proxy?.$notify({
        title: "成功",
        message: "代码已复制到剪切板，可粘贴。",
        type: "success",
      });
      dialogVisible.value = false;
      return codeStr;
    },
  });
  clipboard.on("error", () => {
    proxy?.$message.error("代码复制失败");
  });
  initDrawingList(props.json);
});

function initDrawingList(json: DesignJson) {
  drawingList.length = 0;
  json.fields.forEach((it: any) => {
    drawingList.push(it);
  });
}

onUnmounted(() => {});

function cloneComponent(origin: ComponentItemJson): ComponentItemJson {
  const clone = deepClone(origin);
  return clone;
}

let activeIndex = ref(0);

function addComponent(item: ComponentItemJson) {
  const clone = cloneComponent(item);
  drawingList.push(clone);
  activeFormItem(drawingList.length - 1);
}

function activeFormItem(index: number) {
  activeIndex.value = index;
}

function genCode() {}

/**
 * 生成代码
 */
function generateCode(): string {
  const { type } = saveType;
  const data = {
    fields: drawingList,
    ...formConf,
  };
  // const script = vueScript(makeUpJs(data, type))
  const html = vueTemplate(makeUpHtml(data, type));

  // const css = cssStyle(makeUpCss(data))
  console.log(html);
  return html;
}

function confrimGenerate(save: SaveType) {
  saveType = save;
  if (optration === "copy") {
    document.getElementById("copyNode")?.click();
  } else if (optration === "download") {
    generateCode();
  }
}

/**
 * 复制代码
 */
function copyCode() {
  dialogVisible.value = true;
  optration = "copy";
}

function empty() {
  drawingList.length = 0;
}

function drawingItemCopy(item: ComponentItemJson, list: []) {
  let clone = deepClone(item);
  drawingList.push(clone);
  activeFormItem(drawingList.length - 1);
}

function drawingItemDelete(index: number, list: []) {
  drawingList.splice(index, 1);
  nextTick(() => {
    const len = drawingList.length;
    if (len) {
      activeFormItem(len - 1);
    }
  });
}
function tagChange(newTag: ComponentItemJson) {
  newTag = cloneComponent(newTag);
  const config = newTag.__config__;
  newTag.__vModel__ = activeData.value.__vModel__;
  config.span = activeData.value.__config__.span;
  activeData.value.__config__.tag = config.tag;
  activeData.value.__config__.tagIcon = config.tagIcon;
  if (typeof activeData.value.__config__.defaultValue === typeof config.defaultValue) {
    config.defaultValue = activeData.value.__config__.defaultValue;
  }
  Object.keys(newTag).forEach((key) => {
    if (activeData.value[key] !== undefined) {
      newTag[key] = activeData.value[key];
    }
  });
  activeData.value = newTag;
  updateDrawingList(newTag, drawingList);
}
function updateDrawingList(newTag: ComponentItemJson, list: ComponentItemJson[]) {
  if (activeIndex.value > -1) {
    list.splice(activeIndex.value, 1, newTag);
  } else {
    list.forEach((item) => {
      if (Array.isArray(item.__config__.children)) {
        updateDrawingList(newTag, item.__config__.children);
      }
    });
  }
}
// 选中文件后把参数赋值
const handleChange = (uploadFile: UploadFile) => {
  emit("upload", uploadFile);
};
</script>

<style lang="scss">
@import "./styles/home";
</style>
