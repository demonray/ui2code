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
              item-key="guid"
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
        <el-button
          v-if="
            json.metaInfo.imageRes && (json.metaInfo.imageRes.ui || json.metaInfo.imageRes.text)
          "
          class="action-btn-item"
          type="text"
          @click="showDetectResult"
        >
          识别结果
        </el-button>

        <el-upload
          v-if="!isVscode"
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
        <el-button v-else
          class="action-btn-item"
          type="text"
          @click="handleChange()">
          上传图片
        </el-button>
        <form
          ref="sandboxForm"
          action="https://codesandbox.io/api/v1/sandboxes/define"
          style="display: inline-block"
          method="POST"
          target="_blank"
        >
          <input type="hidden" name="parameters" />
          <el-button type="text" @click="preview">
            <svg-icon name="view" />
            预览
          </el-button>
        </form>
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
              item-key="guid"
              :animation="340"
              group="componentsGroup"
            >
              <template #item="{ element }">
                <draggable-item
                  :current-item="element"
                  :active-id="activeItemId"
                  @active-item="activeItem"
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
      v-if="activeData.data"
      :active-data="activeData.data"
      :form-conf="formConf"
      :show-field="!!drawingList.length"
      @tag-change="tagChange"
    />

    <code-type-dialog
      v-model="dialogVisible"
      :operation="operation"
      title="选择目标组件库"
      @confirm="confrimGenerate"
    />
    <detect-result v-model="showImageRes" :data="json.metaInfo.imageRes" />
    <input id="copyNode" type="hidden" />
  </div>
</template>

<script setup lang="ts">
import { vscode } from "./utilities/vscode";
import { ref, reactive, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import {
  generatePreview,
  generateCode,
  getPreviewPlaygoundUrl,
} from "./components/generator/index";
import type { SaveConfig } from "./components/generator/index";
import { deepClone, guid } from "./utilities/index";
import useCurrentInstance from "./hooks/useCurrentInstance";
import draggable from "vuedraggable";
import ClipboardJS from "clipboard";
import type { UploadFile } from "element-plus";
import RightPanel from "./RightPanel.vue";
import {
  inputComponents,
  selectComponents,
  layoutComponents,
  formConfig,
} from "./config/componentType";
import DetectConfig from "./config";
import CodeTypeDialog from "./CodeTypeDialog.vue";
import DetectResult from "./DetectResult.vue";
import DraggableItem from "./DraggableItem";
import loadBeautifier from "./utilities/loadBeautifier";
import { beautifierConf } from "./utilities/pluginsConfig";

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

const emit = defineEmits(["upload", "preview"]);

let drawingList: ComponentItemJson[] = reactive([]);

const formConf = reactive(formConfig);
const props = defineProps<{
  json: DesignJson;
  status?: string;
}>();

const activeData: {
  data: ComponentItemJson | null;
} = reactive({
  data: null,
});

let operation = ref("preview");

let saveType: SaveConfig = reactive({
  preview: "playground",
  type: "file",
  targetlib: "fes-design",
});

const dialogVisible = ref(false);
const sandboxForm = ref(null);
let beautifier: any;

let contextIns: any;
onMounted(() => {
  const { proxy } = useCurrentInstance();
  contextIns = proxy;
  const clipboard = new ClipboardJS("#copyNode", {
    text: () => {
      const codeStr = generate();
      proxy?.$notify({
        title: "成功",
        message: "代码已复制到剪切板，可粘贴。",
        type: "success",
      });
      dialogVisible.value = false;
      return codeStr;
    },
  });
  clipboard.on("error", (e) => {
    proxy?.$message.error("代码复制失败");
  });
  initDrawingList(props.json);
  loadBeautifier((btf) => {
    beautifier = btf;
  });
});

watch(props.json, (v) => {
  initDrawingList(v);
});

function initDrawingList(json: DesignJson) {
  drawingList.length = 0;
  let rows = [];
  let lastRow: ComponentItemJson[] = [];
  let lastRowY = 0;
  for (let i = 0; i < json.fields.length; i++) {
    // guid
    json.fields[i].guid = json.fields[i].guid || guid();
    // 同一行判断
    if (json.fields[i].uiItem.y - lastRowY < DetectConfig.RowThreshold && lastRowY) {
      lastRow.push(json.fields[i]);
    } else {
      lastRowY = json.fields[i].uiItem.y;
      lastRow = [json.fields[i]];
      rows.push(lastRow);
    }
    lastRow.sort((a, b) => a.uiItem.x - b.uiItem.x);
  }
  rows = rows.map((rowItems) => {
    if (rowItems.length > 1) {
      let row = layoutComponents.find((it) => it.type === "row") as ComponentItemJson;
      if (row) {
        row = deepClone(row);
        // 根据组件宽度占比计算span
        let allWidth = 0;
        rowItems.forEach((it) => {
          allWidth += it.uiItem.w;
        });
        rowItems.forEach((it) => {
          it.__config__.span = Math.floor((it.uiItem.w / allWidth) * 24);
        });
        row.__config__.children = [...rowItems];
        rowItems = [row];
      }
    }
    return rowItems[0];
  });
  drawingList.push(...rows);
}

onUnmounted(() => {});

function cloneComponent(origin: ComponentItemJson): ComponentItemJson {
  const clone = deepClone(origin);
  clone.guid = guid();
  return clone;
}

let activeItemId = ref("");

function addComponent(item: ComponentItemJson) {
  const clone = cloneComponent(item);
  drawingList.push(clone);
  activeItem(clone);
}

function activeItem(item: ComponentItemJson) {
  activeData.data = item;
  activeItemId.value = item.guid;
}

function preview() {
  dialogVisible.value = true;
  operation.value = "preview";
}

function previewSandbox() {
  const { targetlib, preview } = saveType;
  const code = generate();
  if (preview === "playground") {
    const url = getPreviewPlaygoundUrl(targetlib, code);
    if (url) {
      window.open(url, "_blank");
    } else {
      contextIns?.$message.error("未配置playground url");
    }
  } else {
    const previewLocal = true; // 默认本地
    const parameters = generatePreview(targetlib, code, previewLocal);
    if (preview === "codesandbox" && previewLocal) {
      emit("preview", parameters);
    } else {
      if (sandboxForm.value) {
        const form = sandboxForm.value as HTMLFormElement;
        const p = form.children[0] as HTMLInputElement;
        p.value = parameters as string;
        form.submit();
      }
    }
  }
}
/**
 * 递归生成vModel
 */
function generateVmodel(childrenList: Array<ComponentItemJson>, preStr: string) {
  childrenList.forEach((child: ComponentItemJson, idx: number) => {
    const modelStr = `${preStr}_${idx}`;
    if (hasVmodel(child.type)) {
      child.__vModel__ = modelStr;
    }
    if (child.__config__.children && child.__config__.children.length) {
      generateVmodel(child.__config__.children, modelStr);
    }
    if (child.__slot__?.options && child.__slot__?.options.length) {
      child.__slot__?.options.forEach((element: OptionItem, k: number) => {
        if (element.childrenComponet && element.childrenComponet.length) {
          generateVmodel(element.childrenComponet, modelStr + k);
        }
      });
    }
  });
}
/**
 * 生成代码
 */
function generate(): string {
  const { type, targetlib } = saveType;
  drawingList.forEach((it, index) => {
    if (hasVmodel(it.type)) {
      it.__vModel__ = `field_${index}`;
    }
    if (it.__config__.children) {
      generateVmodel(it.__config__.children, `field_${index}`);
    }
    if (it.__slot__?.options && it.__slot__?.options.length) {
      it.__slot__?.options.forEach((element: OptionItem, k: number) => {
        if (element.childrenComponet && element.childrenComponet.length) {
          generateVmodel(element.childrenComponet, `field_${index}${k}`);
        }
      });
    }
  });
  const data = {
    fields: drawingList,
    ...formConf,
  };
  const code = generateCode(data, type, targetlib, props.json.metaInfo);
  return code && beautifier ? beautifier.html(code, beautifierConf.html) : code || "null";
}

function confrimGenerate(save: SaveConfig) {
  saveType = save;
  if (operation.value === "copy") {
    document.getElementById("copyNode")?.click();
  } else if (operation.value === "preview") {
    previewSandbox();
  }
}

/**
 * 复制代码
 */
function copyCode() {
  dialogVisible.value = true;
  operation.value = "copy";
}

function empty() {
  drawingList.length = 0;
}

function drawingItemCopy(item: ComponentItemJson) {
  let clone = deepClone(item);
  clone.guid = guid();
  drawingList.push(clone);
  activeItem(clone);
}
function deleteItemFormList(list: Array<ComponentItemJson>, item: ComponentItemJson): boolean {
  const index = list.findIndex((it) => it.guid === item.guid);
  if (index > -1) {
    list.splice(index, 1);
    return true;
  }
  const { parentInfo } = item;
  if (parentInfo) {
    const parentElementConf = list.find((it) => it.guid === parentInfo.guid);
    if (parentElementConf) {
      const children = parentElementConf.__slot__?.options?.[parentInfo.index]?.childrenComponet;
      if (children) {
        const index = children.findIndex((it: ComponentItemJson) => it.guid === item.guid);
        if (index > -1) {
          console.log(index);
          children.splice(index, 1);
          return true;
        }
      }
    }
  } else {
    for (let i = 0; i < list.length; i++) {
      const children = list[i].__config__.children;
      const optionsChildren = list[i].__slot__?.options;
      if (children && children.length) {
        const find = deleteItemFormList(children, item);
        if (find) break;
      } else if (optionsChildren && optionsChildren.length) {
        for (let index = 0; index < optionsChildren.length; index++) {
          const { childrenComponet } = optionsChildren[index] || {};
          if (
            childrenComponet &&
            childrenComponet.length &&
            deleteItemFormList(childrenComponet, item)
          )
            break;
        }
      }
    }
  }
  return false;
}

function drawingItemDelete(item: ComponentItemJson) {
  const index = drawingList.findIndex((it) => it.guid === item.guid);
  if (index > -1) {
    drawingList.splice(index, 1);
    nextTick(() => {
      const len = drawingList.length;
      if (len) {
        activeItem(drawingList[len - 1]);
      }
    });
  } else {
    deleteItemFormList(drawingList, item);
    activeItem(drawingList[0]);
  }
}

function tagChange(newTag: ComponentItemJson, type: string = "") {
  if (type === "add-pagination") {
    // 新增:table的分页，分页条在table下方，存在则不增加
    const { index, next } = nextComp();
    if (next && next.type === "pagination") {
      return;
    }
    newTag = cloneComponent(newTag);
    drawingList.splice(index + 1, 0, newTag);
  } else if (type === "del-pagination") {
    const { index, next } = nextComp();
    if (next && next.type === "pagination") {
      drawingList.splice(index + 1, 1);
    }
  } else {
    // change
    newTag = cloneComponent(newTag);
    const config = newTag.__config__;
    if (activeData.data) {
      newTag.__vModel__ = hasVmodel(newTag.type) ? activeData.data.__vModel__ : undefined;
      config.span = activeData.data.__config__.span;
      activeData.data.__config__.tag = config.tag;
      activeData.data.__config__.tagIcon = config.tagIcon;
      if (typeof activeData.data.__config__.defaultValue === typeof config.defaultValue) {
        config.defaultValue = activeData.data.__config__.defaultValue;
      }
      Object.keys(newTag).forEach((key) => {
        if (activeData.data && activeData.data[key] !== undefined) {
          newTag[key] = activeData.data[key];
        }
      });
    }
    activeData.data = newTag;
  }
}

/**
 * 获取下一个组件
 */
function nextComp() {
  const index = drawingList.findIndex((it) => it.guid === activeItemId.value);
  if (index > -1) {
    return {
      index,
      next: drawingList[index + 1],
    };
  }
  return {
    index,
    next: undefined,
  };
}

function hasVmodel(type: string) {
  return !["button"].includes(type);
}

const isVscode = typeof acquireVsCodeApi === "function"
// 选中文件后把参数赋值
const handleChange = (uploadFile?: UploadFile) => {
  if (isVscode) {
    vscode.postMessage({
      command: "detectimage",
    });
    return;
  }
  emit("upload", uploadFile);
};

const showImageRes = ref(false);
function showDetectResult() {
  showImageRes.value = true;
}
</script>

<style lang="scss">
@import "./styles/home";
</style>
