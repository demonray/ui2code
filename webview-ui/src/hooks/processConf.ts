import { inputComponents, selectComponents, layoutComponents } from "../config/componentType";
import type { UiItem } from "./useMergeDetectData";
/**
 * 查找对应组件设计器配置
 */
function findComponentConf(type: UiType): ComponentItemJson {
  const findConf = [...inputComponents, ...selectComponents, ...layoutComponents].find((it) => {
    return it.type === type;
  });
  return findConf && JSON.parse(JSON.stringify(findConf));
}

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
          if (actionCol < 0 && item.indexOf("操作") > -1) {
            actionCol = colIndex;
          }
          return {
            __config__: {
              layout: "raw",
              tag: "el-table-column",
            },
            prop: `col_${colIndex}`,
            label: item,
          };
        });
      } else {
        // todo 表格操作列
        // if (!metaInfo.actionLabels && actionCol > -1) {
        //   metaInfo.actionLabels = it[actionCol].trim().split(/\s/);
        // }
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
  // todo menu类型，数据
  return conf;
}
function makeTabConf(conf: ComponentItemJson, it: UiItem, textResults: TextItem[]) {
  // todo tab 选项
  return conf;
}
function makeDefaultConf(conf: ComponentItemJson, it: UiItem, textResults: TextItem[]) {
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
    case "tabs":
      conf = makeTabConf(conf, it, textResults);
      break;
    default: // todo 各自处理row、dialog、breadcumb、tree、 tooltip、calendar、alert、rate、badge、timeline
      conf = makeDefaultConf(conf, it, textResults);
      break;
  }
  conf.uiItem = it.uiItem;
  return conf;
}