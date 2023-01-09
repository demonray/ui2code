<script setup lang="ts">
// import { vscode } from "./utilities/vscode";
import { ref, reactive, computed } from "vue";
import Editor from "./components/Editor.vue";
import Design from "./Design.vue";
import {
  inputComponents,
  selectComponents,
  layoutComponents,
  formConf,
} from "./config/componentType";

// function handleHowdyClick() {
//   vscode.postMessage({
//     command: "hello",
//     text: "Hey there partner! 🤠",
//   });
// }

const uiResults: DetectItem[] = [
  {
    x: 227.26868,
    y: 282.0313,
    w: 126.47966,
    h: 69.251785,
    prob: 0.83942795,
    class: "button",
  },
  {
    x: 720.71326,
    y: 281.76306,
    w: 128.93451,
    h: 68.31349,
    prob: 0.8297539,
    class: "button",
  },
  {
    x: 204.12418,
    y: 628.3985,
    w: 75.278275,
    h: 47.082397,
    prob: 0.81199855,
    class: "switch",
  },
  {
    x: 331.99463,
    y: 504.80762,
    w: 35.679657,
    h: 38.046417,
    prob: 0.7667269,
    class: "checkbox",
  },
  {
    x: 184.19519,
    y: 504.84927,
    w: 39.31729,
    h: 36.75006,
    prob: 0.74878865,
    class: "checkbox",
  },
  {
    x: 558.47614,
    y: 391.0879,
    w: 765.92017,
    h: 70.0264,
    prob: 0.5698105,
    class: "select",
  },
  {
    x: 558.47394,
    y: 167.0047,
    w: 761.61896,
    h: 70.095215,
    prob: 0.55842805,
    class: "select",
  },
  {
    x: 183.71057,
    y: 56.114388,
    w: 39.39354,
    h: 44.376083,
    prob: 0.5047664,
    class: "radio",
  },
  {
    x: 285.49518,
    y: 54.839325,
    w: 39.003296,
    h: 45.75209,
    prob: 0.43677723,
    class: "radio",
  },
];

const textResults = {
  msg: "",
  results: [
    [
      {
        confidence: 0.9801278114318848,
        text: "*单选框组",
        text_region: [
          [55, 46],
          [158, 43],
          [158, 64],
          [55, 66],
        ],
      },
      {
        confidence: 0.9996135830879211,
        text: "男",
        text_region: [
          [208, 46],
          [231, 46],
          [231, 67],
          [208, 67],
        ],
      },
      {
        confidence: 0.7817301750183105,
        text: "?女",
        text_region: [
          [274, 45],
          [331, 45],
          [331, 68],
          [274, 68],
        ],
      },
      {
        confidence: 0.9579564929008484,
        text: "*密码",
        text_region: [
          [99, 155],
          [156, 158],
          [155, 181],
          [98, 178],
        ],
      },
      {
        confidence: 0.997824490070343,
        text: "请输入密码",
        text_region: [
          [198, 158],
          [303, 158],
          [303, 178],
          [198, 178],
        ],
      },
      {
        confidence: 0.9589386582374573,
        text: "Q搜索",
        text_region: [
          [196, 269],
          [261, 269],
          [261, 291],
          [196, 291],
        ],
      },
      {
        confidence: 0.7299702763557434,
        text: "画删除",
        text_region: [
          [691, 271],
          [753, 271],
          [753, 293],
          [691, 293],
        ],
      },
      {
        confidence: 0.9690972566604614,
        text: "*下拉选择",
        text_region: [
          [59, 385],
          [155, 385],
          [155, 402],
          [59, 402],
        ],
      },
      {
        confidence: 0.9876394867897034,
        text: "选项一",
        text_region: [
          [196, 384],
          [259, 384],
          [259, 404],
          [196, 404],
        ],
      },
      {
        confidence: 0.968501091003418,
        text: "*多选框组",
        text_region: [
          [57, 496],
          [157, 496],
          [157, 514],
          [57, 514],
        ],
      },
      {
        confidence: 0.9248738884925842,
        text: "Iphone",
        text_region: [
          [208, 497],
          [277, 497],
          [277, 515],
          [208, 515],
        ],
      },
      {
        confidence: 0.9797406196594238,
        text: "MacBook",
        text_region: [
          [356, 498],
          [445, 498],
          [445, 513],
          [356, 513],
        ],
      },
      {
        confidence: 0.951630175113678,
        text: "*开关",
        text_region: [
          [100, 617],
          [156, 617],
          [156, 638],
          [100, 638],
        ],
      },
    ],
  ],
  status: "000",
};

const jsonText = computed(() => {
  return JSON.stringify(uiResults);
});

const designJson: DesignJson = reactive({
  fields: [],
});

const designStep = ref(1);

/**
 * 查找对应组件设计器配置
 */
function findComponentConf(type: UiType) {
  const findConf = [...inputComponents, ...selectComponents, ...layoutComponents].find((it) => {
    return it.type === type;
  });
  return findConf && JSON.parse(JSON.stringify(findConf));
}

/**
 * 计算中心点
 */
function textItemXY(region: TextRegion): PointXY {
  return {
    x: (region[2][0] + region[0][0]) / 2,
    y: (region[2][1] + region[0][1]) / 2,
  };
}

function calcIoU(box1: XYXY, box2: XYXY) {
  let [x1min, y1min, x1max, y1max] = box1;
  let [x2min, y2min, x2max, y2max] = box2;
  // 计算两个框的面积
  const s1 = (y1max - y1min + 1) * (x1max - x1min + 1);
  const s2 = (y2max - y2min + 1) * (x2max - x2min + 1);

  // 计算相交部分的坐标
  const xmin = Math.max(x1min, x2min);
  const ymin = Math.max(y1min, y2min);
  const xmax = Math.min(x1max, x2max);
  const ymax = Math.min(y1max, y2max);

  const inter_h = Math.max(ymax - ymin + 1, 0);
  const inter_w = Math.max(xmax - xmin + 1, 0);

  const intersection = inter_h * inter_w;
  const union = s1 + s2 - intersection;

  // 计算iou
  // return intersection / union
  return intersection / s1;
}

/**
 * 判断是text是否在UI组件里面
 * @param text 文本中心点
 * @param uiItem 组件位置
 */
function isInUIBox(text: TextItem, uiItem: DetectItem): boolean {
  //     const minx = uiItem.x - uiItem.w / 2;
  //     const maxx = uiItem.x + uiItem.w / 2;
  //     const miny = uiItem.y - uiItem.h / 2;
  //     const maxy = uiItem.y + uiItem.h / 2;
  //     return text.x < maxx && text.x > minx && text.y > miny && text.y < maxy;
  const boxUI = xywh2xyxy({ x: uiItem.x, y: uiItem.y, w: uiItem.w, h: uiItem.h });
  const boxText: XYXY = [
    text.text_region[0][0],
    text.text_region[0][1],
    text.text_region[2][0],
    text.text_region[2][1],
  ];

  const iou = calcIoU(boxText, boxUI);
  return iou > 0.6;
}

interface DirDis {
  dir: "in" | "left" | "right" | "top" | "bottom";
  dis: number;
}

/**
 * 判断是text在UI组件的相对位置：left，right，top，bottom，in
 * @param text 文本中心点
 * @param uiItem 组件位置
 */
function positionDir(text: TextItem, uiItem: DetectItem): DirDis | undefined {
  if (isInUIBox(text, uiItem)) return { dir: "in", dis: 0 };
  if (text.x && text.y) {
    const dis = (Math.abs(text.x - uiItem.x) + Math.abs(text.y - uiItem.y)) / 2;
    // left
    if (
      text.x <= uiItem.x &&
      text.y <= uiItem.y + uiItem.h / 2 &&
      text.y >= uiItem.y - uiItem.h / 2
    ) {
      return { dir: "left", dis };
    }
    // right
    if (
      text.x >= uiItem.x &&
      text.y <= uiItem.y + uiItem.h / 2 &&
      text.y >= uiItem.y - uiItem.h / 2
    ) {
      return { dir: "right", dis };
    }
    // top
    if (
      text.y <= uiItem.y &&
      text.x <= uiItem.x + uiItem.w / 2 &&
      text.x >= uiItem.x - uiItem.w / 2
    ) {
      return { dir: "top", dis };
    }
    // bottom
    if (
      text.y >= uiItem.y &&
      text.x <= uiItem.x + uiItem.w / 2 &&
      text.x >= uiItem.x - uiItem.w / 2
    ) {
      return { dir: "bottom", dis };
    }
  }
}

/**
 * 转换坐标
 * @param box
 */
function xywh2xyxy(box: { x: number; y: number; w: number; h: number }): XYXY {
  const minx = box.x - box.w / 2;
  const maxx = box.x + box.w / 2;
  const miny = box.y - box.h / 2;
  const maxy = box.y + box.h / 2;
  return [minx, miny, maxx, maxy];
}

interface UiItem {
  type: UiType;
  options?: OptionItem[];
  textMatched?: {};
}

/**
 * 检测结果数据转换成设计器可识别的json代码
 * @param uiResults
 * @param textResults
 */
function dataToJsonCode(uiResults: DetectItem[], textResults: TextItem[]) {
  // todo 检测同一组件识别出多标签的情况，保留得分高的

  // 遍历文本识别结果数据，判断与组件识别结果关系：
  // in，left，right，top，bottom
  const uiTextMap = {};
  textResults.forEach((item) => {
    const xy = textItemXY(item.text_region);
    item.x = xy.x;
    item.y = xy.y;
    // 优先判断是否包含
    // 其次根据距离最近匹配
    // todo 只保留一个会出现丢失label，placeholder是in， 是否按行匹配？是否可以多个结果都保留增加纯文本组建
    // 或者文本数据直接插入UI组件列表

    let matchInfo = { dis: 10000, dir: "", index: -1 };
    for (let i = 0; i < uiResults.length; i++) {
      const dirdis = positionDir(item, uiResults[i]);
      if (dirdis?.dir === "in") {
        matchInfo = { dir: "in", dis: 0, index: i };
        break;
      }
      if (dirdis) {
        if (matchInfo.dis > dirdis.dis) {
          matchInfo = { ...dirdis, index: i };
        }
      }
    }
    uiTextMap[matchInfo.index] = { textItem: item, matched: matchInfo };
    //console.log(item, matchInfo, uiResults[matchInfo.index])
  });
  fillTextToComp(uiTextMap, uiResults);
}

/**
 * 根据匹配结果绑定文本数据
 * @param uiTextMap
 * @param uiResults
 */
function fillTextToComp(uiTextMap, uiResults: DetectItem[]): void {
  // todo 文本可能是label，placeholder，content 把对应文本数据和组件相结合，给UI组件填充文本数据
  const jsonData: UiItem[] = [];

  uiResults.forEach((it, index) => {
    let last = jsonData[jsonData.length - 1];
    // group
    if (it.class === "checkbox") {
      if (last && last.type === it.class) {
        last.options?.push({
          textMatched: uiTextMap[index],
        });
      } else {
        jsonData.push({
          type: it.class,
          options: [{ textMatched: uiTextMap[index] }],
        });
      }
    } else if (it.class === "radio") {
      if (last && last.type === it.class) {
        last.options?.push({ textMatched: uiTextMap[index] });
      } else {
        jsonData.push({
          type: it.class,
          options: [{ textMatched: uiTextMap[index] }],
        });
      }
    } else {
      jsonData.push({
        type: it.class,
        textMatched: uiTextMap[index],
      });
    }
  });
  // checkboxgroup radiogroup
  jsonData.forEach((it) => {
    // todo 设计器统一组件标签，生成对应组件代码时根据目标组件库映射转换
    const conf = findComponentConf(it.type);
    if (it.type === "radio") {
      console.log(it, conf);
    }
    if (it.options) {
      const option:OptionItem[] = [];
      it.options.forEach((op, index) => {
        const { matched, textItem } = op.textMatched;
        if (matched.dir === "right") {
          if (it.type === "checkbox" || it.type === "radio") {
            option.push({
              value: index,
              label: textItem.text,
            });
          }
        }
      });
      conf.__slot__.options = option;
    }
    if (it.textMatched && conf) {
      const { matched, textItem } = it.textMatched;
      if (matched.dir === "in") {
        // placeholder for input/select/textarea
        // text for button
        if (it.type === "button" && conf.__slot__) {
          // console.log(matched, textItem, conf);
          conf.__slot__.default = textItem.text;
        }
        if (it.type === "input" || it.type === "textarea" || it.type === "select") {
          conf.placeholder = textItem.text;
        }
      }
      // label for input/select/textarea/switch
      if (matched.dir === "left") {
        if (
          it.type === "input" ||
          it.type === "textarea" ||
          it.type === "select" ||
          it.type === "switch"
        ) {
          console.log(it.type, matched, textItem, conf);
          conf.__config__.label = textItem.text;
        }
      }
      // options for checboxgroup radiogroup
      if (matched.dir === "right") {
        if (it.type === "checkbox" || it.type === "radio") {
          // conf.__slot__.
          console.log(conf, it);
        }
      }
    }

    if (conf) {
      designJson.fields.push(conf);
    }
  });
  console.log(jsonData, designJson);
}

/**
 * 上传图片，调用接口获取组件信息，文字信息
 */
function goDesign() {
  // todo 提交图片获取数据
  // 按Y排序
  uiResults.sort((a, b) => {
    return a.y - b.y;
  });

  // 组件Y值在误差范围内的算一行，按X排序
  for (let i = 1; i < uiResults.length; i++) {
    if (uiResults[i].y - uiResults[i - 1].y < 5 && uiResults[i].x < uiResults[i - 1].x) {
      const tmp = uiResults[i];
      uiResults[i] = uiResults[i - 1];
      uiResults[i - 1] = tmp;
    }
  }

  dataToJsonCode(uiResults, textResults.results[0]);
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
