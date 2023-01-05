<script setup lang="ts">
import { vscode } from "./utilities/vscode";
import { ref, reactive, computed } from "vue";
import Editor from "./components/Editor.vue";
import Design from "./Design.vue";
import {
  inputComponents,
  selectComponents,
  layoutComponents,
  formConf,
} from "./config/componentType";
function handleHowdyClick() {
  vscode.postMessage({
    command: "hello",
    text: "Hey there partner! 🤠",
  });
}
interface DetectItem {
  x: string;
  y: string;
  w: string;
  h: string;
  prob: string;
  class: UiType;
}
const json: DetectItem[] = [
  {
    x: "227.26868",
    y: "282.0313",
    w: "126.47966",
    h: "69.251785",
    prob: "0.83942795",
    class: "button",
  },
  {
    x: "720.71326",
    y: "281.76306",
    w: "128.93451",
    h: "68.31349",
    prob: "0.8297539",
    class: "button",
  },
  {
    x: "204.12418",
    y: "628.3985",
    w: "75.278275",
    h: "47.082397",
    prob: "0.81199855",
    class: "switch",
  },
  {
    x: "331.99463",
    y: "504.80762",
    w: "35.679657",
    h: "38.046417",
    prob: "0.7667269",
    class: "checkbox",
  },
  {
    x: "184.19519",
    y: "504.84927",
    w: "39.31729",
    h: "36.75006",
    prob: "0.74878865",
    class: "checkbox",
  },
  {
    x: "558.47614",
    y: "391.0879",
    w: "765.92017",
    h: "70.0264",
    prob: "0.5698105",
    class: "select",
  },
  {
    x: "558.47394",
    y: "167.0047",
    w: "761.61896",
    h: "70.095215",
    prob: "0.55842805",
    class: "select",
  },
  {
    x: "183.71057",
    y: "56.114388",
    w: "39.39354",
    h: "44.376083",
    prob: "0.5047664",
    class: "radio",
  },
  {
    x: "285.49518",
    y: "54.839325",
    w: "39.003296",
    h: "45.75209",
    prob: "0.43677723",
    class: "radio",
  },
];
const jsonText = computed(() => {
  return JSON.stringify(json);
});
const designJson = reactive({
    fields: <any>[]
});
const designStep = ref(1);
type UiType = "input" | "textarea" | "radio" | "checkbox" | "button" | "switch" | "select";
type OptionItem = {
  label: string;
  value: string | number;
};
interface UiItem {
  type: UiType;
  options?: OptionItem[];
}

/**
 * 查找对应组件设计器配置
 */
function findComponentConf(type: UiType) {
    return [...inputComponents,...selectComponents,...layoutComponents].find(it => {
        return it.__config__.tagIcon === type
    })
}
/**
 * 检测结果数据转换成设计器可识别的json代码
 */
function dataToJsonCode(json: DetectItem[]) {
  // todo 检测同一组件识别出多标签的情况，保留得分高的
  // 识别包裹组件如多个checkbox，radio
  const jsonData: UiItem[] = [];
  json.forEach((it) => {
    let last = jsonData[jsonData.length - 1];
    if (it.class === "checkbox") {
      if (last && last.type === it.class) {
        last.options?.push({
          label: "选项",
          value: 1,
        });
      } else {
        jsonData.push({
          type: it.class,
          options: [
            {
              label: "选项",
              value: 1,
            },
          ],
        });
      }
    } else if (it.class === "radio") {
      if (last && last.type === it.class) {
        last.options?.push({
          label: "选项",
          value: 1,
        });
      } else {
        jsonData.push({
          type: it.class,
          options: [
            {
              label: "选项",
              value: 1,
            },
          ],
        });
      }
    } else {
      jsonData.push({
        type: it.class,
      });
    }
  });
  // todo 设计器统一组件标签，生成对应组件代码时根据目标组件库映射转换
  designJson.fields = jsonData.map((it) => {
    const conf = findComponentConf(it.type)
    return conf
  })
  
  console.log(jsonData);
}
function goDesign() {
  // 按Y排序
  json.sort((a, b) => {
    return +a.y - +b.y;
  });

  dataToJsonCode(json);
  designStep.value = 2;
}
</script>

<template>
  <main>
    <el-button @click="goDesign">设计</el-button>
    <editor v-show="designStep === 1" :value="jsonText" language="json" />
    <design v-show="designStep === 2" :json="designJson" />
  </main>
</template>

<style>
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
}

main > * {
  margin: 1rem 0;
}
</style>
