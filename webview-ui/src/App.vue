<script setup lang="ts">
// import { vscode } from "./utilities/vscode";
import { ref, reactive, watch } from "vue";
import type { UploadFile } from "element-plus";
import Design from "./Design.vue";
import Axios from "./utilities/request";
import { getBase64 } from "./utilities/index";
import DetectService from "./config/modelService";
import { inputComponents, selectComponents, layoutComponents } from "./config/componentType";

// function handleHowdyClick() {
//   vscode.postMessage({
//     command: "hello",
//     text: "Hey there partner! 🤠",
//   });
// }

interface DirDis {
  dir: Direction;
  dis: number;
}

type Direction = "in" | "left" | "right" | "bottom" | "top";
interface Matched extends DirDis {
  index: number;
}
type Matchs = Record<Direction, Matched>;

type UITextMap = NumberKey<Partial<Matchs>>;

interface MatchedOptionItem {
  textMatched: Partial<Matchs>;
}

type MatchedOptions = Array<MatchedOptionItem>;

interface UiItem {
  type: UiType;
  options?: MatchedOptions;
  textMatched?: Partial<Matchs>;
}

let uiResults: DetectItem[] = [
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

let textResults: TextItem[] = [
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
];

const detectStatus: {
  text: "PROCESSING" | "PENDING" | "SUCCESS";
  component: "PROCESSING" | "PENDING" | "SUCCESS" | "FINISH";
  msg: string;
} = reactive({
  component: "PROCESSING",
  text: "PROCESSING",
  msg: "",
});

const designJson: DesignJson = reactive({
  fields: [],
});

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
  const boxUI = xywh2xyxy({
    x: uiItem.x,
    y: uiItem.y,
    w: uiItem.w,
    h: uiItem.h,
  });
  const boxText: XYXY = [
    text.text_region[0][0],
    text.text_region[0][1],
    text.text_region[2][0],
    text.text_region[2][1],
  ];

  const iou = calcIoU(boxText, boxUI);
  return iou > 0.6;
}

/**
 * 根据中心点判断text在UI组件的相对位置：left，right，top，bottom，in
 * @param text 文本
 * @param uiItem 组件位置
 */
function positionDir(text: TextItem, uiItem: DetectItem): DirDis | undefined {
  let dis = -1;
  if (text.x && text.y) {
    dis = (Math.abs(text.x - uiItem.x) + Math.abs(text.y - uiItem.y)) / 2;
  }
  if (isInUIBox(text, uiItem))
    return {
      dir: "in",
      dis,
    };
  // left：FormItem label
  // right：Checkbox label Radio Label
  // 丢弃距离超过阈值的？
  // 除去in再增多一个备选？
  // 不丢弃任何text？
  // 每个方向选最近的？
  if (text.x && text.y) {
    // left
    if (
      text.x <= uiItem.x &&
      text.y <= uiItem.y + uiItem.h / 2 &&
      text.y >= uiItem.y - uiItem.h / 2
    ) {
      return {
        dir: "left",
        dis,
      };
    }
    // right
    if (
      text.x >= uiItem.x &&
      text.y <= uiItem.y + uiItem.h / 2 &&
      text.y >= uiItem.y - uiItem.h / 2
    ) {
      return {
        dir: "right",
        dis,
      };
    }
    // top
    if (
      text.y <= uiItem.y &&
      text.x <= uiItem.x + uiItem.w / 2 &&
      text.x >= uiItem.x - uiItem.w / 2
    ) {
      return {
        dir: "top",
        dis,
      };
    }
    // bottom
    if (
      text.y >= uiItem.y &&
      text.x <= uiItem.x + uiItem.w / 2 &&
      text.x >= uiItem.x - uiItem.w / 2
    ) {
      return {
        dir: "bottom",
        dis,
      };
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

/**
 * 检测结果数据转换成设计器可识别的json代码
 * @param uiResults
 * @param textResults
 */
function convertJsonData(uiResults: DetectItem[], textResults: TextItem[]) {
  // todo 检测同一组件识别出多标签的情况，保留得分高的

  // 遍历文本识别结果数据，判断与组件识别结果关系：
  // in，left，right，top，bottom
  const uiTextMap: UITextMap = {};
  // 优先判断是否包含
  // 其次根据距离最近匹配
  // text in ui component
  const textIn: Record<number, boolean> = {};
  for (let uiIndex = 0; uiIndex < uiResults.length; uiIndex++) {
    // 未匹配的文本数据直接插入UI组件列表？
    const matchs: Partial<Matchs> = {};
    textResults.forEach((item, index) => {
      if (!textIn[index]) {
        const xy = textItemXY(item.text_region);
        item.x = xy.x;
        item.y = xy.y;
        const dirdis = positionDir(item, uiResults[uiIndex]);

        if (dirdis) {
          if (dirdis.dir === "in") {
            textIn[index] = true;
          }
          const matchsDir = matchs[dirdis.dir];
          if (matchsDir) {
            if (matchsDir.dis > dirdis.dis) {
              matchs[dirdis.dir] = {
                dir: dirdis.dir,
                dis: dirdis.dis,
                index,
              };
            }
          } else {
            matchs[dirdis.dir] = {
              dir: dirdis.dir,
              dis: dirdis.dis,
              index,
            };
          }
        }
      }
    });
    uiTextMap[uiIndex] = matchs;
    // console.log(uiTextMap);
  }

  fillTextToComp(uiTextMap, uiResults, textResults);
}

/**
 * 根据匹配结果绑定文本数据
 * @param uiTextMap
 * @param uiResults
 */
function fillTextToComp(
  uiTextMap: UITextMap,
  uiResults: DetectItem[],
  textResults: TextItem[]
): void {
  // 文本可能是label，placeholder，content 把对应文本数据和组件相结合，给UI组件填充文本数据
  const jsonData: UiItem[] = [];

  uiResults.forEach((it, index) => {
    let last = jsonData[jsonData.length - 1];
    // checkboxgroup radiogroup 各个选项options
    if (it.class === "checkbox") {
      if (last && last.type === it.class) {
        last.options?.push({
          textMatched: uiTextMap[index],
        });
      } else {
        jsonData.push({
          type: it.class,
          options: [
            {
              textMatched: uiTextMap[index],
            },
          ],
        });
      }
    } else if (it.class === "radio") {
      if (last && last.type === it.class) {
        last.options?.push({
          textMatched: uiTextMap[index],
        });
      } else {
        jsonData.push({
          type: it.class,
          options: [
            {
              textMatched: uiTextMap[index],
            },
          ],
        });
      }
    } else {
      jsonData.push({
        type: it.class,
        textMatched: uiTextMap[index],
      });
    }
  });
  
  jsonData.forEach((it) => {
    // todo 设计器统一组件标签，生成对应组件代码时根据目标组件库映射转换
    const conf = findComponentConf(it.type);

    // checkboxgroup radiogroup
    if (it.options && conf) {
      const option: OptionItem[] = [];
      it.options.forEach((op, index) => {
        // checkbox radio 选项文本再右边
        const { left, right } = op.textMatched;
        if (it.type === "checkbox" || it.type === "radio") {
          if (right) {
            option.push({
              value: index,
              label: textResults[right.index].text,
            });
          }
          if (left && index === 0) {
            conf.__config__.label = textResults[left.index].text;
          }
        }
      });
      conf.__slot__.options = option;
    }
    if (conf) {
      if (it.textMatched && it.textMatched.in) {
        const textItem = textResults[it.textMatched.in.index];
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
      if (it.textMatched && it.textMatched.left) {
        if (
          it.type === "input" ||
          it.type === "textarea" ||
          it.type === "select" ||
          it.type === "switch"
        ) {
          const textItem = textResults[it.textMatched.left.index];
          conf.__config__.label = textItem.text;
        }
      }
      if (it.textMatched && it.textMatched.right) {
        // console.log(it, textResults[it.textMatched.right.index])
      }
      processConf(conf);
      designJson.fields.push(conf);
    }
  });
}

/**
 * 加工数据给设计器使用
 * 清理OCR识别的必填字断的*
 * ...
 * @param conf
 */
function processConf(conf: ComponentItemJson) {
  // required处理
  if (/^\*/.test(conf.__config__.label)) {
    conf.__config__.required = true;
    conf.__config__.label = conf.__config__.label.substring(1);
  } else {
    conf.__config__.required = true;
  }
}

/**
 * 上传图片，调用接口获取组件信息，文字信息
 */
function startDesign(uiResults: DetectItem[], textResults: TextItem[]) {
  designJson.fields = [];
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

  convertJsonData(uiResults, textResults);
}

/**
 * 提交图片提交UI模型检查
 */
function processUIDetect(uploadFile: UploadFile) {
  let formData = new FormData();
  if (uploadFile.raw) {
    formData.append("files", uploadFile.raw!);
  }
  Axios({
    url: DetectService.UI_DETECT_URL,
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then((res) => {
    if (res.data && res.data[0]) {
      // status: "PROCESSING"
      // task_id: "e1458014-a457-47d5-986c-30f4ca4ee2ba"
      // url_result: "/api/result/e1458014-a457-47d5-986c-30f4ca4ee2ba"
      detectStatus.component = res.data[0].status;
      checkDetectStatus(res.data[0].task_id);
    }
  });
}

/**
 * 轮训状态
 * @param taskid
 */
function checkDetectStatus(taskid: string) {
  Axios({
    url: DetectService.UI_DETECT_STATUS + taskid,
    method: "get",
  })
    .then((res) => {
      // result: ""
      // status: "PENDING"
      // task_id: "7bfd83e5-17e2-4650-8476-7e573b4b2b03"
      detectStatus.component = res.data.status;
      if (res.data && res.data.status === "PENDING") {
        setTimeout(() => {
          checkDetectStatus(taskid);
        }, 1000);
      } else if (res.data && res.data.status === "SUCCESS") {
        getUIDetectResult(taskid);
      }
    })
    .catch((error) => {
      // 请求失败，
      console.log(error);
    });
}

/**
 * 获取检测结果数据
 * @param taskid
 */
function getUIDetectResult(taskid: string) {
  Axios({
    url: DetectService.UI_DETECT_RESULT + taskid,
    method: "get",
  })
    .then((res) => {
      // {
      //    data: {
      //     result: {
      //         bbox: [],
      //         file_name: 'static/95a135ee.jpg'
      //     },
      //     status: 'SUCCESS',
      //     task_id: ''
      //    }
      // }
      if (res.data && res.data.status === "SUCCESS") {
        uiResults = res.data.result.bbox;
        detectStatus.component = 'FINISH';
      }
    })
    .catch((error) => {
      // 请求失败，
      console.log(error);
    });
}

/**
 * 获取文本检查结果
 */
async function getTextDetectData(uploadFile: UploadFile) {
  detectStatus.text = "PROCESSING";
  const images = await getBase64(uploadFile.raw as Blob);
  Axios({
    url: DetectService.OCR,
    method: "post",
    data: {
      base64_str: images.replace(/data:image\/.+;base64,/, ""),
    },
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      textResults = res.data.data;
      detectStatus.text = "SUCCESS";
    })
    .catch((error) => {
      // 请求失败，
      console.log(error);
    });
}

function onUpload(uploadFile: UploadFile) {
  uiResults = [];
  textResults = [];
  processUIDetect(uploadFile);
  getTextDetectData(uploadFile);
}

watch([() => detectStatus.component, () => detectStatus.text], (v) => {
  if (v[0] === "FINISH" && v[1] === "SUCCESS") {
    startDesign(uiResults, textResults);
    detectStatus.msg = "";
  }
  const loading =
    ["PROCESSING", "PENDING"].indexOf(v[0]) > -1 || ["PROCESSING", "PENDING"].indexOf(v[1]) > -1;
  if (loading) {
    detectStatus.msg = "模型识别中...";
  }
});

startDesign(uiResults, textResults);
</script>

<template>
  <main>
    <design :json="designJson" :status="detectStatus.msg" @upload="onUpload" />
  </main>
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
