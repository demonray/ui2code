import {
  findComponentConf
} from "../config/componentType";
import type { UiItem } from "./useMergeDetectData";
import { textRegionFirstLine } from "../utilities";

/**
 * table结构识别数据转换成设计器可识别的json代码
 * @param data
 * @returns
 */
function makeTableConf(conf: ComponentItemJson, data: StructureItem | string[][]) {
  let trs = [];
  if (Array.isArray(data)) {
    trs = data;
  } else if (data.res.html) {
    const reg = /<tr>.*?<\/tr>/g;
    let result;
    while ((result = reg.exec(data.res.html))) {
      const breg = /<td>(.*?)<\/td>/g;
      const tds = [];
      let tdRes;
      while ((tdRes = breg.exec(result[0]))) {
        tds.push(tdRes[1]);
      }
      trs.push(tds);
    }
  }
  if (trs.length) {
    const data: Array<{}> = [];
    let actionCol = -1;
    trs.forEach((it, index) => {
      if (index === 0) {
        // 第一行为表头
        conf.__config__.children = it.map((item, colIndex) => {
          let actionLabels;
          if (actionCol < 0 && item.trim() == "操作") {
            actionCol = colIndex;
            actionLabels = ["编辑", "删除"];
            if (trs[1] && trs[1][actionCol] && trs[1][actionCol].trim()) {
              actionLabels = trs[1][actionCol].trim().split(/\s/);
            }
          }
          return {
            __config__: {
              layout: "raw",
              tag: "el-table-column",
              actionLabels,
            },
            prop: `col_${colIndex}`,
            label: item,
          };
        });
      } else {
        const obj: { [propName: string]: any } = {};
        it.forEach((item, colIndex) => {
          obj[`col_${colIndex}`] = item;
        });
        data.push(obj);
      }
    });
    conf.data = data;
  }
  return conf;
}

function makeStepConf(conf: ComponentItemJson, it: UiItem, textResults: TextItem[]) {
  // console.log(it, textResults, conf)
  conf.__config__.mode = it.uiItem.w < it.uiItem.h ? "vertical" : "horizontal";
  if (it.uiItem.w < it.uiItem.h) {
    conf.__config__.mode = "vertical";
  } else {
    conf.__config__.mode = "horizontal";
    if (it.textMatched && it.textMatched.in && it.textMatched.in.texts) {
      let firstLine = textRegionFirstLine(it.textMatched.in.texts).map(
        (it: TextItem, index: number) => {
          return {
            label: it.text,
            value: ``,
          };
        }
      );
      if (firstLine.length && conf.__slot__ && conf.__slot__.options) {
        conf.__slot__.options = firstLine;
      }
    }
  }
  return conf;
}

function makeButtonConf(conf: ComponentItemJson, it: UiItem, textResults: TextItem[]) {
  let text: string = "按钮";
  if (it.textMatched && it.textMatched.in) {
    text = textResults[it.textMatched.in.index].text;
  }
  if (conf.__slot__) {
    conf.__slot__.default = text;
  }
  return conf;
}

function makeInputConf(conf: ComponentItemJson, it: UiItem, textResults: TextItem[]) {
  let text: string = "";
  if (it.textMatched && it.textMatched.in) {
    // placeholder
    text = textResults[it.textMatched.in.index].text;
  }
  conf.placeholder = text;

  if (it.textMatched && it.textMatched.left) {
    // label
    const textItem = textResults[it.textMatched.left.index];
    conf.__config__.label = textItem.text;
  }
  // required处理
  if (/^\*/.test(conf.__config__.label)) {
    conf.__config__.required = true;
    conf.__config__.label = conf.__config__.label.substring(1);
  }
  return conf;
}

function makeSelectConf(conf: ComponentItemJson, it: UiItem, textResults: TextItem[]) {
  let text: string = "";
  if (it.textMatched && it.textMatched.in) {
    // placeholder
    text = textResults[it.textMatched.in.index].text;
  }
  conf.placeholder = text;
  if (it.textMatched && it.textMatched.left) {
    // label
    const textItem = textResults[it.textMatched.left.index];
    conf.__config__.label = textItem.text;
  }
  // required处理
  if (/^\*/.test(conf.__config__.label)) {
    conf.__config__.required = true;
    conf.__config__.label = conf.__config__.label.substring(1);
  }
  return conf;
}

function makeTextareaConf(conf: ComponentItemJson, it: UiItem, textResults: TextItem[]) {
  let text: string = "";
  if (it.textMatched && it.textMatched.in) {
    // placeholder
    text = textResults[it.textMatched.in.index].text;
  }
  conf.placeholder = text;
  if (it.textMatched && it.textMatched.left) {
    // label
    const textItem = textResults[it.textMatched.left.index];
    conf.__config__.label = textItem.text;
  }
  // required处理
  if (/^\*/.test(conf.__config__.label)) {
    conf.__config__.required = true;
    conf.__config__.label = conf.__config__.label.substring(1);
  }
  return conf;
}

function makeSwitchConf(conf: ComponentItemJson, it: UiItem, textResults: TextItem[]) {
  if (it.textMatched && it.textMatched.left) {
    // label
    const textItem = textResults[it.textMatched.left.index];
    conf.__config__.label = textItem.text;
  }
  // required处理
  if (/^\*/.test(conf.__config__.label)) {
    conf.__config__.required = true;
    conf.__config__.label = conf.__config__.label.substring(1);
  }
  return conf;
}

function makeProgressConf(conf: ComponentItemJson, it: UiItem, textResults: TextItem[]) {
  if (it.textMatched && it.textMatched.in) {
    const textItem = textResults[it.textMatched.in.index];
    // 进度条处理
    if (conf.__slot__) {
      conf.__slot__.default = textItem.text;
      if (textItem.text.indexOf("%") !== -1) {
        conf.percentage = Number(textItem.text.split("%")[0]);
      }
    }
  }
  // todo progress 类型，环形还是条状
  return conf;
}

function makeCheckboxConf(conf: ComponentItemJson, it: UiItem, textResults: TextItem[]) {
  if (it.options) {
    // 复选框组
    const option: OptionItem[] = [];
    it.options.forEach((op, index) => {
      const { left, right } = op.textMatched;
      if (right) {
        option.push({
          value: index,
          label: textResults[right.index].text,
        });
      }
      if (left && index === 0) {
        conf.__config__.label = textResults[left.index].text;
      }
    });
    if (conf.__slot__) {
      conf.__slot__.options = option;
    }
  }
  // required处理
  if (/^\*/.test(conf.__config__.label)) {
    conf.__config__.required = true;
    conf.__config__.label = conf.__config__.label.substring(1);
  }
  return conf;
}

function makeRadioConf(conf: ComponentItemJson, it: UiItem, textResults: TextItem[]) {
  if (it.options) {
    // 单选框组
    const option: OptionItem[] = [];
    it.options.forEach((op, index) => {
      const { left, right } = op.textMatched;
      if (right) {
        option.push({
          value: index,
          label: textResults[right.index].text,
        });
      }
      if (left && index === 0) {
        conf.__config__.label = textResults[left.index].text;
      }
    });
    if (conf.__slot__) {
      conf.__slot__.options = option;
    }
  }
  // required处理
  if (/^\*/.test(conf.__config__.label)) {
    conf.__config__.required = true;
    conf.__config__.label = conf.__config__.label.substring(1);
  }
  return conf;
}

function makeAlertConf(conf: ComponentItemJson, it: UiItem, textResults: TextItem[]) {
  if (it.textMatched && it.textMatched.in) {
    conf.title = it.textMatched.in?.texts?.map((it: TextItem) => it.text).join("");
  }
  return conf;
}

function makeCalendarConf(conf: ComponentItemJson, it: UiItem, textResults: TextItem[]) {
  return conf;
}

function makeBadgeConf(conf: ComponentItemJson, it: UiItem, textResults: TextItem[]) {
  if (it.textMatched && it.textMatched.in && conf.__slot__) {
    conf.__slot__.default = textResults[it.textMatched.in?.index].text;
  }
  return conf;
}

function makeRateConf(conf: ComponentItemJson, it: UiItem, textResults: TextItem[]) {
  if (it.textMatched && it.textMatched.left) {
    // label
    const textItem = textResults[it.textMatched.left.index];
    conf.__config__.label = textItem.text;
  }
  return conf;
}

function makeTimepickerConf(conf: ComponentItemJson, it: UiItem, textResults: TextItem[]) {
  if (it.textMatched && it.textMatched.left) {
    // label
    const textItem = textResults[it.textMatched.left.index];
    conf.__config__.label = textItem.text;
  }
  // required处理
  if (/^\*/.test(conf.__config__.label)) {
    conf.__config__.required = true;
    conf.__config__.label = conf.__config__.label.substring(1);
  }
  return conf;
}
function makeDatepickerConf(conf: ComponentItemJson, it: UiItem, textResults: TextItem[]) {
  if (it.textMatched && it.textMatched.left) {
    // label
    const textItem = textResults[it.textMatched.left.index];
    conf.__config__.label = textItem.text;
  }
  // required处理
  if (/^\*/.test(conf.__config__.label)) {
    conf.__config__.required = true;
    conf.__config__.label = conf.__config__.label.substring(1);
  }
  return conf;
}
function makeTimeRangeConf(conf: ComponentItemJson, it: UiItem, textResults: TextItem[]) {
  if (it.textMatched && it.textMatched.left) {
    // label
    const textItem = textResults[it.textMatched.left.index];
    conf.__config__.label = textItem.text;
  }
  // required处理
  if (/^\*/.test(conf.__config__.label)) {
    conf.__config__.required = true;
    conf.__config__.label = conf.__config__.label.substring(1);
  }
  return conf;
}
function makeDateRangeConf(conf: ComponentItemJson, it: UiItem, textResults: TextItem[]) {
  if (it.textMatched && it.textMatched.left) {
    // label
    const textItem = textResults[it.textMatched.left.index];
    conf.__config__.label = textItem.text;
  }
  // required处理
  if (/^\*/.test(conf.__config__.label)) {
    conf.__config__.required = true;
    conf.__config__.label = conf.__config__.label.substring(1);
  }
  return conf;
}

function makePageinationConf(conf: ComponentItemJson, it: UiItem, textResults: TextItem[]) {
  // todo
  return conf;
}

function makeMenunConf(conf: ComponentItemJson, it: UiItem, textResults: TextItem[]) {
  conf.__config__.mode = it.uiItem.w < it.uiItem.h ? "vertical" : "horizontal";
  if (it.textMatched && it.textMatched.in) {
    let navOptions: any = [];
    if (it.textMatched.in.texts?.length) {
      it.textMatched.in.texts.forEach((it: TextItem) => {
        navOptions.push(it);
      });
    }
    if (navOptions.length && conf.__slot__ && conf.__slot__.options) {
      conf.__slot__.options = navOptions.map((it: any, index: number) => {
        return {
          label: it.text,
          value: `${index + 1}`,
        };
      });
    }
  }
  return conf;
}

function makeBreadcrumbConf(conf: ComponentItemJson, it: UiItem, textResults: TextItem[]) {
  if (it.textMatched && it.textMatched.in) {
    let navOptions: any = [];
    if (it.textMatched.in.texts?.length) {
      it.textMatched.in.texts.forEach((it: TextItem) => {
        it.text.split(/>|\//).forEach((item) => navOptions.push(item));
      });
    }
    if (navOptions.length && conf.__slot__ && conf.__slot__.options) {
      conf.__slot__.options = navOptions.map((it: any, index: number) => {
        return {
          label: it,
          value: `${index + 1}`,
        };
      });
    }
  }
  return conf;
}

function makeTabConf(conf: ComponentItemJson, it: UiItem, textResults: TextItem[]) {
  if (it.textMatched && it.textMatched.in) {
    let tabOptions: any = [];
    if (it.textMatched.in.texts?.length) {
      tabOptions = textRegionFirstLine(it.textMatched.in.texts).map(
        (it: TextItem, index: number) => {
          return {
            label: it.text,
            value: `${index + 1}`,
          };
        }
      );
    }

    if (tabOptions.length && conf.__slot__ && conf.__slot__.options) {
      conf.__slot__.options = tabOptions;
    }
  }
  return conf;
}

function makeTimelineConf(conf: ComponentItemJson, it: UiItem, textResults: TextItem[]) {
  if (it.textMatched && it.textMatched.in) {
    let timeOptions: any = [];
    if (it.textMatched.in.texts?.length) {
      timeOptions = it.textMatched.in.texts.map((it: TextItem, index: number) => {
        // todo 数据分组识别出节点文本 timestamp 和 content
        return {
          label: it.text,
          value: `${index + 1}`,
        };
      });
    }
    if (timeOptions.length && conf.__slot__ && conf.__slot__.options) {
      conf.__slot__.options = timeOptions;
    }
  }
  return conf;
}

function makeTreeConf(conf: ComponentItemJson, it: UiItem, textResults: TextItem[]) {
  if (it.textMatched && it.textMatched.in) {
    let datalist: any = [];
    if (it.textMatched.in.texts?.length) {
      it.textMatched.in.texts.forEach((it: TextItem) => {
        datalist.push({
          label: it.text,
          // children: [] // 根据缩进 识别数据？
        });
      });
    }
    if (datalist.length) {
      conf.data = datalist;
    }
  }
  return conf;
}

function makeDefaultConf(conf: ComponentItemJson, it: UiItem, textResults: TextItem[]) {
  console.log("makeDefaultConf: ", conf, it, textResults);
  // todo
  return conf;
}

/**
 * 加工数据给设计器使用
 * 清理OCR识别的必填字断的*
 * 根据组件特征还原组件属性
 * ...
 * @param conf
 */
export default function processConf(it: UiItem, textResults: TextItem[]) {
  let conf = findComponentConf(it.type);
  // console.log("findComponentConf:", it.type, conf);
  switch (it.type) {
    case "table":
      // todo uiResults是否有分页组件
      //       const hasPaginatin
      //       if (!hasPaginatin) {
      //         conf.__config__.pagination = 'none'
      //       }
      conf = makeTableConf(conf, it.table_struct);
      conf.uiItem = it.uiItem;
      return conf;
    case "steps":
      conf = makeStepConf(conf, it, textResults);
      break;
    case "button":
      conf = makeButtonConf(conf, it, textResults);
      break;
    case "input":
      conf = makeInputConf(conf, it, textResults);
      break;
    case "select":
      conf = makeSelectConf(conf, it, textResults);
      break;
    case "textarea":
      conf = makeTextareaConf(conf, it, textResults);
      break;
    case "switch":
      conf = makeSwitchConf(conf, it, textResults);
      break;
    case "progress":
      conf = makeProgressConf(conf, it, textResults);
      break;
    case "checkbox":
      conf = makeCheckboxConf(conf, it, textResults);
      break;
    case "radio":
      conf = makeRadioConf(conf, it, textResults);
      break;
    case "timepicker":
      conf = makeTimepickerConf(conf, it, textResults);
      break;
    case "datepicker":
      conf = makeDatepickerConf(conf, it, textResults);
      break;
    case "timerange":
      conf = makeTimeRangeConf(conf, it, textResults);
      break;
    case "daterange":
      conf = makeDateRangeConf(conf, it, textResults);
      break;
    case "pagination":
      conf = makePageinationConf(conf, it, textResults);
      break;
    case "menu":
      conf = makeMenunConf(conf, it, textResults);
      break;
    case "tab":
      conf = makeTabConf(conf, it, textResults);
      break;
    case "breadcrumb":
      conf = makeBreadcrumbConf(conf, it, textResults);
      break;
    case "rate":
      conf = makeRateConf(conf, it, textResults);
      break;
    case "timeline":
      conf = makeTimelineConf(conf, it, textResults);
      break;
    case "tree":
      conf = makeTreeConf(conf, it, textResults);
      break;
    case "alert":
      conf = makeAlertConf(conf, it, textResults);
      break;
    case "badge":
      conf = makeBadgeConf(conf, it, textResults);
      break;
    case "calendar":
      conf = makeCalendarConf(conf, it, textResults);
      break;
    default: // todo 各自处理row、dialog、tooltip
      conf = makeDefaultConf(conf, it, textResults);
      break;
  }
  if (conf) {
    conf.uiItem = it.uiItem;
  }
  return conf;
}
