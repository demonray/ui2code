<template>
  <div>
    <el-dialog
      v-bind="$attrs"
      width="500px"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      @open="onOpen"
    >
      <el-form ref="elForm" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="生成类型">
          <el-radio-group v-model="formData.type">
            <el-radio-button v-for="(item, index) in typeOptions" :key="index" :label="item.value">
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="目标库">
          <el-select v-model="formData.targetlib">
            <el-option value="element-plus">element-plus-vue3</el-option>
            <el-option value="fes-design">fes-design-vue3</el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="props.operation === 'preview'" label="预览方式">
          <el-radio-group v-model="formData.preview">
            <el-radio label="playground">playground</el-radio>
            <el-radio label="codesandbox">codesandbox</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="close"> 取消 </el-button>
        <el-button type="primary" @click="handelConfirm"> 确定 </el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import type { ElForm } from "element-plus";
import type { SaveConfig } from "./components/generator";
import useCurrentInstance from "./hooks/useCurrentInstance";

interface Props {
  operation: string;
}
const props = withDefaults(defineProps<Props>(), {
  operation: "preview",
});

const formData: SaveConfig = reactive({
  preview: "playground",
  type: "file",
  targetlib: "fes-design",
});

const rules = {
  type: [
    {
      required: true,
      message: "生成类型不能为空",
      trigger: "change",
    },
  ],
};
const typeOptions = [
  {
    label: "页面",
    value: "file",
  },
  {
    label: "弹窗",
    value: "dialog",
  },
];

const { proxy } = useCurrentInstance();

const emit = defineEmits(["confirm", "update:modelValue"]);

function onOpen() {}

function close() {
  emit("update:modelValue", false);
}

function handelConfirm() {
  (proxy?.$refs?.elForm as InstanceType<typeof ElForm>).validate((valid: Boolean) => {
    if (!valid) return;
    emit("confirm", { ...formData });
    close();
  });
}
</script>
