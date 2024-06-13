import DetectConfig from "../config";
import processConf from "./processConf";

interface DirDis {
  dir: Direction;   // 文本相对组件位置
  dis: number;      // 文本与组件中心点距离
}

type Direction = "in" | "left" | "right" | "bottom" | "top";
interface Matched extends DirDis {
  index: number;
  texts?: TextItem[]; // 组件区域内文本
}
type Matchs = Record<Direction, Matched>;

type UITextMap = NumberKey<Partial<Matchs>>;

interface MatchedOptionItem {
  textMatched: Partial<Matchs>;
}

type MatchedOptions = Array<MatchedOptionItem>;

export interface UiItem {
  type: UiType;
  options?: MatchedOptions;
  textMatched?: Partial<Matchs>;
  [propName: string]: any;
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

/**
 * box1,box2 相交部分 / box1
 * @param box1
 * @param box2
 * @returns
 */
function calcIoU(box1: XYXY, box2: XYXY, type?: number) {
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
  return type === 1 ? intersection / s1 : intersection / union;
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

  const iou = calcIoU(boxText, boxUI, 1);
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
 * 合并数据转换成设计器可识别的json代码
 * @param uiResults
 * @param textResults
 */
function mergeTextUI(
  uiResults: DetectItem[],
  textResults: TextItem[],
): ComponentItemJson[] {
  let fields: ComponentItemJson[] = [];

  // 遍历文本识别结果数据，判断与组件识别结果关系：
  // in，left，right，top，bottom
  const uiTextMap: UITextMap = {};
  // 优先判断是否包含
  // 其次根据距离最近匹配
  const textIn: Record<number, boolean> = {};
  for (let uiIndex = 0; uiIndex < uiResults.length; uiIndex++) {
    const matchs: Partial<Matchs> = {};
    textResults.forEach((item, index) => {
      if (!textIn[index]) {  // 跳过已经处理了的微博 text in ui component
        const xy = textItemXY(item.text_region);
        item.x = xy.x;
        item.y = xy.y;
        let dirdis
        if (uiResults[uiIndex]) dirdis = positionDir(item, uiResults[uiIndex]);

        if (dirdis) {
          const matchsDir = matchs[dirdis.dir];
          if (matchsDir) {
            if (matchsDir.dis > dirdis.dis) {
              matchs[dirdis.dir] = {
                dir: dirdis.dir,
                dis: dirdis.dis,
                index,
                texts: matchsDir.texts
              };
            }
          } else {
            matchs[dirdis.dir] = {
              dir: dirdis.dir,
              dis: dirdis.dis,
              index,
            };
          }
          if (dirdis.dir === "in") {
            textIn[index] = true;
          }
          if (matchs.in && matchs.in.texts) {
            matchs.in.texts.push(item)
          } else if (matchs.in) {
            matchs.in.texts = [item]
          }
        }
      }
    });
    uiTextMap[uiIndex] = matchs;
  }
  console.log('uiTextMap', uiTextMap);
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
          uiItem: it,
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
          uiItem: it,
          options: [
            {
              textMatched: uiTextMap[index],
            },
          ],
        });
      }
    } else if (it.class === "table") {
      jsonData.push({
        type: it.class,
        uiItem: it,
        textMatched: uiTextMap[index],
        table_struct: it.table_struct,
      });
    } else {
      jsonData.push({
        type: it.class,
        uiItem: it,
        textMatched: uiTextMap[index],
      });
    }
  });

  for (let idx = 0; idx < jsonData.length; idx++) {
    const it = jsonData[idx];
    const conf = processConf(it, textResults)
    if (conf) {
      fields.push(conf)
    }
  }
  return fields
}

/**
 * 处理识别结果数据，组件排序处理
 * @param uiResults UI组件识别结果
 * @param textResults 文本识别结果
 * @param structures Layout识别结果
 * @returns
 */
export default function mergeDetectData(
  uiResults: DetectItem[],
  textResults: TextItem[] = [],
  structures: StructureItem[] = []
) {

  const checkInCompArea = (types: UiType[], item: XYXY) => {
    const comps = uiResults.filter((it) => types.indexOf(it.class) > -1);
    return comps.some((it) => {
      const box_1 = xywh2xyxy({
        x: it.x,
        y: it.y,
        w: it.w,
        h: it.h,
      });
      return calcIoU(item, box_1, 1) > 0.6;
    });
  };
  uiResults.forEach((it) => {
    if (it.class === "table") {
      const tds = textResults.filter((item) => {
        const boxText: XYXY = [
          item.text_region[0][0],
          item.text_region[0][1],
          item.text_region[2][0],
          item.text_region[2][1],
        ];
        return checkInCompArea(["table"], boxText);
      });
      tds.sort((a,b) => {
        if (Math.abs(a.text_region[0][1] - b.text_region[0][1]) < 8) {
            return a.text_region[0][0] - b.text_region[0][0]
        }
        return a.text_region[0][1] - b.text_region[0][1]
      })
      const tableData: string[][] = [[]];
      for (let i = 0; i < tds.length; i++) {
        if (tableData.length && i > 0 && tds[i].text_region[0][0] < tds[i - 1].text_region[0][0]) {
          tableData.push([tds[i].text]);
        } else {
          tableData[tableData.length - 1].push(tds[i].text);
        }
      }
      it.table_struct = tableData;
    }
  });

  // table pagination区域里的文本排除
  textResults = textResults.filter((item) => {
    const boxText: XYXY = [
      item.text_region[0][0],
      item.text_region[0][1],
      item.text_region[2][0],
      item.text_region[2][1],
    ];
    return !checkInCompArea(["table", "pagination"], boxText);
  });

  let fields: ComponentItemJson[] = [];

  // 按Y排序
  uiResults.sort((a, b) => {
    return a.y - b.y;
  });

  // 组件Y值在误差范围内的算一行，按X排序
  for (let i = 1; i < uiResults.length; i++) {
    if (
      uiResults[i].y - uiResults[i - 1].y < DetectConfig.RowThreshold &&
      uiResults[i].x < uiResults[i - 1].x
    ) {
      const tmp = uiResults[i];
      uiResults[i] = uiResults[i - 1];
      uiResults[i - 1] = tmp;
    }
  }

  // 检测同一组件识别出多标签的情况, 暂时取得分判断
  const uiItems = [uiResults[0]];
  for (let i = 1; i < uiResults.length; i++) {
    const box_1 = xywh2xyxy({
      x: uiResults[i - 1].x,
      y: uiResults[i - 1].y,
      w: uiResults[i - 1].w,
      h: uiResults[i - 1].h,
    });
    const box_2 = xywh2xyxy({
      x: uiResults[i].x,
      y: uiResults[i].y,
      w: uiResults[i].w,
      h: uiResults[i].h,
    });

    if (calcIoU(box_1, box_2) > 0.3) {
      if (uiResults[i].prob > uiResults[i - 1].prob) {
        uiItems[uiItems.length - 1] = uiResults[i];
      } else {
        uiItems[uiItems.length - 1] = uiResults[i - 1];
      }
    } else {
      uiItems.push(uiResults[i]);
    }
  }
  if (uiItems.length && textResults.length) {
    fields = mergeTextUI(uiItems, textResults);
  }
  console.log('useMergeDetectData', fields)
  return {
    fields,
  };
}
