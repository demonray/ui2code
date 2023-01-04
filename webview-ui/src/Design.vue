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
        <el-button icon="el-icon-download" type="text" @click="genCode"> 生成vue文件 </el-button>
        <el-button class="copy-btn-main" icon="el-icon-document-copy" type="text" @click="copyCode">
          复制代码
        </el-button>
        <el-button class="delete-btn" icon="el-icon-delete" type="text" @click="empty">
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
                        :avtived="activeItem"
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
<!-- 
    <right-panel
      :active-data="activeData"
      :form-conf="formConf"
      :show-field="!!drawingList.length"
      @tag-change="tagChange"
      @fetch-data="fetchData"
    />

    <preview
      :visible.sync="drawerVisible"
      :form-data="formData"
      size="100%"
      :generate-conf="generateConf"
    /> -->

    <code-type-dialog
      :visible.sync="dialogVisible"
      title="选择生成类型"
      @confirm="generateCode"
    />
    <input id="copyNode" type="hidden" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, onUnmounted, nextTick } from "vue";
import draggable from "vuedraggable";
import ClipboardJS from "clipboard";
// import Preview from "./Preview.vue";
// import RightPanel from "./RightPanel.vue";
import {
  inputComponents,
  selectComponents,
  layoutComponents,
  formConf,
} from "./config/componentType";
import CodeTypeDialog from "./CodeTypeDialog.vue";
import DraggableItem from "./DraggableItem.vue";

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
let drawingList:DraggableItem[] = reactive([]);
onMounted(() => {
  const clipboard = new ClipboardJS("#copyNode", {
    text: () => {
      const codeStr = generateCode();
    //   this.$notify({
    //     title: "成功",
    //     message: "代码已复制到剪切板，可粘贴。",
    //     type: "success",
    //   });
      return codeStr;
    },
  });
  clipboard.on("error", () => {
    // this.$message.error("代码复制失败");
  });
});

onUnmounted(()=>{
    
})

function cloneComponent(origin:any) {
  console.log(origin)
  //   const clone = deepClone(origin)
  //   const config = clone.__config__
  //   config.span = this.formConf.span // 生成代码时，会根据span做精简判断
  //   this.createIdAndKey(clone)
  //   clone.placeholder !== undefined && (clone.placeholder += config.label)
  //   tempActiveData = clone
  //   return tempActiveData
}
interface DraggableItem {
  type: string;
  id: string
}
let activeItem:DraggableItem
function addComponent(item:any) {
//   const clone = this.cloneComponent(item);
     drawingList.push(item);
     console.log(drawingList)
//   this.activeFormItem(clone);
}
function activeFormItem(currentItem:any) {
  activeItem = currentItem;
}
function genCode(){}
function generateCode():string {
    return ''
}
function copyCode() {
    
}
function empty() {
    drawingList.length = 0
}
function drawingItemCopy(item:any, list:[]) {
    //   let clone = deepClone(item)
    //   clone = this.createIdAndKey(clone)
    //   list.push(clone)
    //   this.activeFormItem(clone)
}
function drawingItemDelete(index:number, list:[]) {
    drawingList.splice(index, 1)
    nextTick(() => {
        const len = drawingList.length
        if (len) {
            activeFormItem(drawingList[len - 1])
        }
    })
}
const dialogVisible:boolean = false
</script>

<style lang="scss">
@import "./styles/home";
</style>
