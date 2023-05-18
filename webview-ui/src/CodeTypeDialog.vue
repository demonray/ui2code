<template>
  <div>
    <el-dialog
      v-bind="$attrs"
      width="500px"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      @open="onOpen"
    >
      <el-row :gutter="15">
        <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
          <el-col :span="24">
            <el-form-item label="目标库" prop="type">
              <el-select v-model="formData.targetlib">
                <el-option value="element-plus">element-plus-vue3-ts</el-option>
                <el-option value="fes-design">fes-design-vue3</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

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
import type { LibType } from "./components/generator";
import useCurrentInstance from "./hooks/useCurrentInstance";

type SaveType = {
  fileName: string;
  targetlib: LibType;
};

const formData: SaveType = reactive({
  fileName: "",
  targetlib: "fes-design",
});

const rules = {
  fileName: [
    {
      required: true,
      message: "请输入文件名",
      trigger: "blur",
    },
  ]
};

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
