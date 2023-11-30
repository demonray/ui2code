import ruleTrigger from "./ruleTrigger";

let confGlobal: FormConf | null = null;
let metaInfo: { [index: string]: any } = {};

function colWrapper(scheme: ComponentItemJson, str: string) {
  return `<el-col :span="${scheme.__config__.span}">
    ${str}
</el-col>`;
}

const layouts = {
  colItem(scheme: ComponentItemJson) {
    const config = scheme.__config__;
    let labelWidth = "";
    let label = `label="${config.label}"`;
    if (confGlobal && config.labelWidth && config.labelWidth !== confGlobal.labelWidth) {
      labelWidth = `label-width="${config.labelWidth}px"`;
    }
    if (config.showLabel === false) {
      labelWidth = 'label-width="0"';
      label = "";
    }
    const required = config.tag && !ruleTrigger[config.tag] && config.required ? "required" : "";
    const tagDom = config.tag && tags[config.tag] ? tags[config.tag](scheme) : null;
    // todo not form item
    let str = `<el-form-item ${labelWidth} ${label} prop="${scheme.__vModel__}" ${required}>
            ${tagDom}
          </el-form-item>`;
    // str = colWrapper(scheme, str);
    return str;
  },
  rowItem(scheme: ComponentItemJson) {
    const config = scheme.__config__;
    const tag = config.tag;
    const type = scheme.type === "default" ? "" : `type="${scheme.type}"`;
    const justify = scheme.type === "default" ? "" : `justify="${scheme.justify}"`;
    const align = scheme.type === "default" ? "" : `align="${scheme.align}"`;
    const gutter = scheme.gutter ? `:gutter="${scheme.gutter}"` : "";
    const children = config.children.map((el: ComponentItemJson) => {
      let str = el.__config__.layout ? layouts[el.__config__.layout](el) : "";
      if (str.indexOf("<el-col") !== 0) {
        str = colWrapper(el, str);
      }
      return str;
    });
    let str = `<${tag} ${type} ${justify} ${align} ${gutter}>
          ${children.join("\n")}
        </${tag}>`;
    return str;
  },
  raw(scheme: ComponentItemJson) {
    const config = scheme.__config__;
    const tagDom = config.tag && tags[config.tag] ? tags[config.tag](scheme) : "";
    return tagDom;
  },
};

type TagTemplate = {
  [propName: string]: (el: ComponentItemJson) => string;
};

const tags: TagTemplate = {
  "el-button": (el: ComponentItemJson) => {
    const { tag, type, disabled } = attrBuilder(el);
    const typeStr = type ? `type="${type}"` : "";
    const icon = el.icon ? `icon="${el.icon}"` : "";
    const round = el.round ? "round" : "";
    const size = el.size ? `size="${el.size}"` : "";
    const plain = el.plain ? "plain" : "";
    const circle = el.circle ? "circle" : "";
    let child = buildElButtonChild(el);

    if (child) child = `\n${child}\n`; // 换行
    return `<${tag} ${typeStr} ${icon} ${round} ${size} ${plain} ${disabled} ${circle}>${child}</${tag}>`;
  },
  "el-progress": (el: ComponentItemJson) => {
    const { tag, type } = attrBuilder(el);
    const typeStr = type ? `type="${type}"` : "";
    const status = (el.status && el.status !== '') ? `status="${el.status}"` : "";
    const percentage = `percentage="${el.percentage || 0}"`;
    const strokeWidth = (el.strokeWidth && el.strokeWidth !== '') ? `stroke-width="${el.strokeWidth}"` : "";
    let child = buildElButtonChild(el);

    if (child) child = `\n${child}\n`; // 换行
    return `<${tag} ${typeStr} ${status} ${percentage} ${strokeWidth}>${child}</${tag}>`;
  },
  "el-input": (el: ComponentItemJson) => {
    const { tag, disabled, vModel, clearable, placeholder, width, type } = attrBuilder(el);
    const maxlength = el.maxlength ? `:maxlength="${el.maxlength}"` : "";
    const showWordLimit = el["show-word-limit"] ? "show-word-limit" : "";
    const readonly = el.readonly ? "readonly" : "";
    const prefixIcon = el["prefix-icon"] ? `prefix-icon='${el["prefix-icon"]}'` : "";
    const suffixIcon = el["suffix-icon"] ? `suffix-icon='${el["suffix-icon"]}'` : "";
    const showPassword = el["show-password"] ? "show-password" : "";
    const typeStr = type ? `type="${type}"` : "";
    const autosize =
      el.autosize && el.autosize.minRows
        ? `:autosize="{minRows: ${el.autosize.minRows}, maxRows: ${el.autosize.maxRows}}"`
        : "";
    let child = buildElInputChild(el);

    if (child) child = `\n${child}\n`; // 换行
    return `<${tag} ${vModel} ${typeStr} ${placeholder} ${maxlength} ${showWordLimit} ${readonly} ${disabled} ${clearable} ${prefixIcon} ${suffixIcon} ${showPassword} ${autosize} ${width}>${child}</${tag}>`;
  },
  //   "el-input-number": (el: ComponentItemJson) => {
  //     const { tag, disabled, vModel, placeholder } = attrBuilder(el);
  //     const controlsPosition = el["controls-position"]
  //       ? `controls-position=${el["controls-position"]}`
  //       : "";
  //     const min = el.min ? `:min='${el.min}'` : "";
  //     const max = el.max ? `:max='${el.max}'` : "";
  //     const step = el.step ? `:step='${el.step}'` : "";
  //     const stepStrictly = el["step-strictly"] ? "step-strictly" : "";
  //     const precision = el.precision ? `:precision='${el.precision}'` : "";

  //     return `<${tag} ${vModel} ${placeholder} ${step} ${stepStrictly} ${precision} ${controlsPosition} ${min} ${max} ${disabled}></${tag}>`;
  //   },
  "el-select": (el: ComponentItemJson) => {
    const { tag, disabled, vModel, clearable, placeholder, width } = attrBuilder(el);
    const filterable = el.filterable ? "filterable" : "";
    const multiple = el.multiple ? "multiple" : "";
    let child = buildElSelectChild(el);

    if (child) child = `\n${child}\n`; // 换行
    return `<${tag} ${vModel} ${placeholder} ${disabled} ${multiple} ${filterable} ${clearable} ${width}>${child}</${tag}>`;
  },
  "el-radio-group": (el: ComponentItemJson) => {
    const { tag, disabled, vModel } = attrBuilder(el);
    const size = `size="${el.size}"`;
    let child = buildElRadioGroupChild(el);

    if (child) child = `\n${child}\n`; // 换行
    return `<${tag} ${vModel} ${size} ${disabled}>${child}</${tag}>`;
  },
  "el-tabs": (el: ComponentItemJson) => {
    const { tag, vModel } = attrBuilder(el);
    const editable = `:editable="${el.__config__.editable}"`;
    const tabPotion = `tab-position="${el.__config__.position}"`;
    let child = buildElTabsChild(el);

    if (child) child = `\n${child}\n`; // 换行
    return `<${tag} ${vModel} ${editable} ${tabPotion}>${child}</${tag}>`;
  },
  "el-menu": (el: ComponentItemJson) => {
    const { tag } = attrBuilder(el);
    const mode = `mode="${el.__config__.mode}"`;
    let child = buildElMenuChild(el);

    if (child) child = `\n${child}\n`; // 换行
    return `<${tag} ${mode}>${child}</${tag}>`;
  },
  "el-steps": (el: ComponentItemJson) => {
    const { tag } = attrBuilder(el);
    const direction = `direction="${el.__config__.mode}"`;
    let child = buildElStepsChild(el);

    if (child) child = `\n${child}\n`; // 换行
    return `<${tag} ${direction}>${child}</${tag}>`;
  },
  "el-checkbox-group": (el: ComponentItemJson) => {
    const { tag, disabled, vModel } = attrBuilder(el);
    const size = `size="${el.size}"`;
    const min = el.min ? `:min="${el.min}"` : "";
    const max = el.max ? `:max="${el.max}"` : "";
    let child = buildElCheckboxGroupChild(el);

    if (child) child = `\n${child}\n`; // 换行
    return `<${tag} ${vModel} ${min} ${max} ${size} ${disabled}>${child}</${tag}>`;
  },
  "el-switch": (el: ComponentItemJson) => {
    const { tag, disabled, vModel } = attrBuilder(el);
    const activeText = el["active-text"] ? `active-text="${el["active-text"]}"` : "";
    const inactiveText = el["inactive-text"] ? `inactive-text="${el["inactive-text"]}"` : "";
    const activeColor = el["active-color"] ? `active-color="${el["active-color"]}"` : "";
    const inactiveColor = el["inactive-color"] ? `inactive-color="${el["inactive-color"]}"` : "";
    const activeValue =
      el["active-value"] !== true ? `:active-value='${JSON.stringify(el["active-value"])}'` : "";
    const inactiveValue =
      el["inactive-value"] !== false
        ? `:inactive-value='${JSON.stringify(el["inactive-value"])}'`
        : "";

    return `<${tag} ${vModel} ${activeText} ${inactiveText} ${activeColor} ${inactiveColor} ${activeValue} ${inactiveValue} ${disabled}></${tag}>`;
  },
  "el-table": (el: ComponentItemJson) => {
    let child = buildElTableChild(el);
    if (child) child = `\n${child}\n`; // 换行
    const { tag } = attrBuilder(el);
    // data height border size fit highlight-current-row
    const data = `:data="${el.__vModel__}"`;
    const border = `${el.__config__.border ? "border" : ""}`;
    return `<${tag} ${border} ${data}>${child}</${tag}>`;
  },
  "el-pagination": (el: ComponentItemJson) => {
    const { tag } = attrBuilder(el);
    const data = `v-model:page-size="${el.__vModel__}PageSize" v-model:current-page="${el.__vModel__}currentPage"`;
    const total = `:total="${el.__vModel__}Total"`;
    // const change = `@size-change="handleSizeChange${el.__vModel__}" @current-change="handleCurrentChange${el.__vModel__}"`;
    let layoutItems = `layout="prev,next,pager,${el.__config__.layoutItems.join(",")}"`;
    return `<${tag} ${data} ${layoutItems} ${total}></${tag}>`;
  },
  "el-dialog": (el: ComponentItemJson) => {
    const { tag } = attrBuilder(el);
    const { title, footer, okText, cancelText } = el.__config__;
    let children = el.__config__.children.map((el: ComponentItemJson) => {
      return el.__config__.layout ? layouts[el.__config__.layout](el) : "";
    });
    // todo 是否需要form包裹
    children = buildFormTemplate(confGlobal as FormConf, children.join("\n"), "dialog");
    const cancelEvent = `@click="onCancel${el.__vModel__}"`;
    const okEvent = `@click="onOK${el.__vModel__}"`;
    const footerTpl = footer
      ? `<template #footer>
    <el-button style="margin-right: 15px" ${cancelEvent}>
        ${cancelText}
    </el-button>
    <el-button type="primary" ${okEvent}>${okText}</el-button>
</template>`
      : "";
    return `<${tag} v-model="${el.__vModel__}" title="${title}">
    ${children}
    ${footerTpl}
</${tag}>`;
  },
  //   "el-cascader": (el: ComponentItemJson) => {
  //     const { tag, disabled, vModel, clearable, placeholder, width } = attrBuilder(el);
  //     const options = el.options ? `:options="${el.__vModel__}Options"` : "";
  //     const props = el.props ? `:props="${el.__vModel__}Props"` : "";
  //     const showAllLevels = el["show-all-levels"] ? "" : ':show-all-levels="false"';
  //     const filterable = el.filterable ? "filterable" : "";
  //     const separator = el.separator === "/" ? "" : `separator="${el.separator}"`;

  //     return `<${tag} ${vModel} ${options} ${props} ${width} ${showAllLevels} ${placeholder} ${separator} ${filterable} ${clearable} ${disabled}></${tag}>`;
  //   },
  //   "el-slider": (el: ComponentItemJson) => {
  //     const { tag, disabled, vModel } = attrBuilder(el);
  //     const min = el.min ? `:min='${el.min}'` : "";
  //     const max = el.max ? `:max='${el.max}'` : "";
  //     const step = el.step ? `:step='${el.step}'` : "";
  //     const range = el.range ? "range" : "";
  //     const showStops = el["show-stops"] ? `:show-stops="${el["show-stops"]}"` : "";

  //     return `<${tag} ${min} ${max} ${step} ${vModel} ${range} ${showStops} ${disabled}></${tag}>`;
  //   },
  "el-time-picker": (el: ComponentItemJson) => {
    const { tag, type, disabled, vModel, clearable, placeholder, width } = attrBuilder(el);
    const startPlaceholder = el["start-placeholder"]
      ? `start-placeholder="${el["start-placeholder"]}"`
      : "";
    const endPlaceholder = el["end-placeholder"]
      ? `end-placeholder="${el["end-placeholder"]}"`
      : "";
    const rangeSeparator = el["range-separator"]
      ? `range-separator="${el["range-separator"]}"`
      : "";
    const isRange = el.type === "timerange" ? "is-range" : "";
    const format = el.format ? `format="${el.format}"` : "";
    const valueFormat = el["value-format"] ? `value-format="${el["value-format"]}"` : "";
    const pickerOptions = el["picker-options"]
      ? `:picker-options='${JSON.stringify(el["picker-options"])}'`
      : "";

    return `<${tag} ${vModel} ${isRange} ${format} ${valueFormat} ${pickerOptions} ${width} ${placeholder} ${startPlaceholder} ${endPlaceholder} ${rangeSeparator} ${clearable} ${disabled}></${tag}>`;
  },
  "el-date-picker": (el: ComponentItemJson) => {
    const { tag, type, disabled, vModel, clearable, placeholder, width } = attrBuilder(el);
    const startPlaceholder = el["start-placeholder"]
      ? `start-placeholder="${el["start-placeholder"]}"`
      : "";
    const endPlaceholder = el["end-placeholder"]
      ? `end-placeholder="${el["end-placeholder"]}"`
      : "";
    const rangeSeparator = el["range-separator"]
      ? `range-separator="${el["range-separator"]}"`
      : "";
    const format = el.format ? `format="${el.format}"` : "";
    const valueFormat = el["value-format"] ? `value-format="${el["value-format"]}"` : "";
    const typeAttr = type ? `type="${type}"` : "";
    const readonly = el.readonly ? "readonly" : "";

    return `<${tag} ${typeAttr} ${vModel} ${format} ${valueFormat} ${width} ${placeholder} ${startPlaceholder} ${endPlaceholder} ${rangeSeparator} ${clearable} ${readonly} ${disabled}></${tag}>`;
  },
  //   "el-rate": (el: ComponentItemJson) => {
  //     const { tag, disabled, vModel } = attrBuilder(el);
  //     const max = el.max ? `:max='${el.max}'` : "";
  //     const allowHalf = el["allow-half"] ? "allow-half" : "";
  //     const showText = el["show-text"] ? "show-text" : "";
  //     const showScore = el["show-score"] ? "show-score" : "";

  //     return `<${tag} ${vModel} ${max} ${allowHalf} ${showText} ${showScore} ${disabled}></${tag}>`;
  //   },
  //   "el-color-picker": (el: ComponentItemJson) => {
  //     const { tag, disabled, vModel } = attrBuilder(el);
  //     const size = `size="${el.size}"`;
  //     const showAlpha = el["show-alpha"] ? "show-alpha" : "";
  //     const colorFormat = el["color-format"] ? `color-format="${el["color-format"]}"` : "";

  //     return `<${tag} ${vModel} ${size} ${showAlpha} ${colorFormat} ${disabled}></${tag}>`;
  //   },
  //   "el-upload": (el: ComponentItemJson) => {
  //     const { tag } = el.__config__;
  //     const disabled = el.disabled ? ":disabled='true'" : "";
  //     const action = el.action ? `:action="${el.__vModel__}Action"` : "";
  //     const multiple = el.multiple ? "multiple" : "";
  //     const listType = el["list-type"] !== "text" ? `list-type="${el["list-type"]}"` : "";
  //     const accept = el.accept ? `accept="${el.accept}"` : "";
  //     const name = el.name !== "file" ? `name="${el.name}"` : "";
  //     const autoUpload = el["auto-upload"] === false ? ':auto-upload="false"' : "";
  //     const beforeUpload = `:before-upload="${el.__vModel__}BeforeUpload"`;
  //     const fileList = `:file-list="${el.__vModel__}fileList"`;
  //     const ref = `ref="${el.__vModel__}"`;
  //     let child = buildElUploadChild(el);

  //     if (child) child = `\n${child}\n`; // 换行
  //     return `<${tag} ${ref} ${fileList} ${action} ${autoUpload} ${multiple} ${beforeUpload} ${listType} ${accept} ${name} ${disabled}>${child}</${tag}>`;
  //   },
};

function attrBuilder(el: ComponentItemJson) {
  return {
    tag: el.__config__.tag,
    type: el.__config__.type,
    vModel: `v-model="${confGlobal?.formModel}.${el.__vModel__}"`,
    clearable: el.clearable ? "clearable" : "",
    placeholder: el.placeholder ? `placeholder="${el.placeholder}"` : "",
    width: el.style && el.style.width ? ":style=\"{width: '100%'}\"" : "",
    disabled: el.disabled ? ":disabled='true'" : "",
  };
}

// el-buttin 子级
function buildElButtonChild(scheme: ComponentItemJson) {
  const children = [];
  const slot = scheme.__slot__ || {};
  if (slot.default) {
    children.push(slot.default);
  }
  return children.join("\n");
}

// el-table 子级
function buildElTableChild(scheme: ComponentItemJson) {
  let children: string[] = [];
  if (scheme.__config__.children) {
    metaInfo.tableAction = [];
    children = scheme.__config__.children.map((it: ComponentItemJson) => {
      const prop = it.prop ? `prop="${it.prop}"` : "";
      const label = it.label ? `label="${it.label}"` : "";
      // todo 操作 等特殊列 判断条件
      if (it.label.trim() == "操作") {
        let actionBtn = "";
        if (metaInfo.actionLabels) {
          metaInfo.actionLabels.forEach((it: string, idx: number) => {
            metaInfo.tableAction.push(`${scheme.__vModel__}_colAction_${idx}`);
            actionBtn += `<el-button link type="primary" size="small" @click="${scheme.__vModel__}_colAction_${idx}(scope.$index,scope.row)">${it}</el-button>`;
          });
        }
        return `<${it.__config__.tag} ${label}>
          <template #default="scope">
            ${actionBtn}
        </template>
      </${it.__config__.tag}>
        `;
      } else {
        return `<${it.__config__.tag} ${prop} ${label}/>`;
      }
    });
  }
  return children.join("\n");
}

// el-input 子级
function buildElInputChild(scheme: ComponentItemJson) {
  const children = [];
  const slot = scheme.__slot__;
  if (slot && slot.prepend) {
    children.push(`<template slot="prepend">${slot.prepend}</template>`);
  }
  if (slot && slot.append) {
    children.push(`<template slot="append">${slot.append}</template>`);
  }
  return children.join("\n");
}

// el-select 子级
function buildElSelectChild(scheme: ComponentItemJson) {
  const children = [];
  const slot = scheme.__slot__;
  if (slot && slot.options && slot.options.length) {
    children.push(
      `<el-option v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>`
    );
  }
  return children.join("\n");
}

// el-radio-group 子级
function buildElRadioGroupChild(scheme: ComponentItemJson) {
  const children = [];
  const slot = scheme.__slot__;
  const config = scheme.__config__;
  if (slot && slot.options && slot.options.length) {
    const tag = config.optionType === "button" ? "el-radio-button" : "el-radio";
    const border = config.border ? "border" : "";
    children.push(
      `<${tag} v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.value" :disabled="item.disabled" ${border}>{{item.label}}</${tag}>`
    );
  }
  return children.join("\n");
}

// el-steps 子级
function buildElStepsChild(scheme: ComponentItemJson) {
  const children = [];
  const slot = scheme.__slot__;
  if (slot && slot.options && slot.options.length) {
    children.push(
      `<el-step v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :description="item.value" :title="item.label"></el-step>`
    );
  }
  return children.join("\n");
}

// el-menu 子级
function buildElMenuChild(scheme: ComponentItemJson) {
  const children = [];
  const slot = scheme.__slot__;
  function resolveMenu(children: Array<OptionItem>): Array<any> | string {
    let strHtml = ''
    children.forEach((item: OptionItem) => {
      if (item.children) {
        strHtml +=`<el-sub-menu index='${item.value}'>
          <template #title>${item.label}</template>
          ${resolveMenu(item.children)}
        </el-sub-menu>`
      } else {
        strHtml +=`<el-menu-item index='${item.value}'>
          ${item.label}
        </el-menu-item>`
      }
    })
    return strHtml
}
  if (slot && slot.options && slot.options.length) {
    children.push(resolveMenu(slot.options));
  }
  return children.join("\n");
}
// el-tabs 子级
function buildElTabsChild(scheme: ComponentItemJson) {
  const children = [];
  const slot = scheme.__slot__;
  if (slot && slot.options && slot.options.length) {
    for (let index = 0; index < slot.options.length; index++) {
      const item = slot.options[index];
      let childrenComponet: string | Array<string> = []
      if (item.childrenComponet && item.childrenComponet.length) {
        childrenComponet = item.childrenComponet.map((el: ComponentItemJson) => {
          return el.__config__.layout ? layouts[el.__config__.layout](el) : "";
        });
        childrenComponet = buildFormTemplate(confGlobal as FormConf, childrenComponet.join("\n"), "tabs");
      }
      children.push(
      `<el-tab-pane  key="${index}" name="${item.value}" label="${item.label}">
        ${childrenComponet}
      </el-tab-pane >`
    );
    }
    
  }
  return children.join("\n");
}

// el-checkbox-group 子级
function buildElCheckboxGroupChild(scheme: ComponentItemJson) {
  const children = [];
  const slot = scheme.__slot__;
  const config = scheme.__config__;
  if (slot && slot.options && slot.options.length) {
    const tag = config.optionType === "button" ? "el-checkbox-button" : "el-checkbox";
    const border = config.border ? "border" : "";
    children.push(
      `<${tag} v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.value" :disabled="item.disabled" ${border}>{{item.label}}</${tag}>`
    );
  }
  return children.join("\n");
}

// el-upload 子级
function buildElUploadChild(scheme: ComponentItemJson) {
  const list = [];
  const config = scheme.__config__;
  if (scheme["list-type"] === "picture-card") list.push('<i class="el-icon-plus"></i>');
  else
    list.push(
      `<el-button size="small" type="primary" icon="el-icon-upload">${config.buttonText}</el-button>`
    );
  if (config.showTip)
    list.push(
      `<div slot="tip" class="el-upload__tip">只能上传不超过 ${config.fileSize}${config.sizeUnit} 的${scheme.accept}文件</div>`
    );
  return list.join("\n");
}
function buildFromBtns(scheme: FormConf, type: string) {
  let str = "";
  if (scheme.formBtns && type === "file") {
    str = `<el-form-item size="large">
              <el-button type="primary" @click="submitForm">提交</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>`;
  }
  return str;
}

function dialogWrapper(str: string) {
  return `<el-dialog v-model="showModal" title="Dialog Titile">
        ${str}
        <div slot="footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handelSubmit">确定</el-button>
        </div>
      </el-dialog>`;
}

function buildFormTemplate(scheme: FormConf, child: string, type: string) {
  let labelPosition = "";
  if (scheme.labelPosition !== "right") {
    labelPosition = `label-position="${scheme.labelPosition}"`;
  }
  const disabled = scheme.disabled ? `:disabled="${scheme.disabled}"` : "";
  let str = `<el-form ref="${scheme.formRef}" :model="${scheme.formModel}" :rules="${
    scheme.formRules
  }" size="${scheme.size}" ${disabled} label-width="${scheme.labelWidth}px" ${labelPosition}>
          ${child}
          ${buildFromBtns(scheme, type)}
        </el-form>`;
  return str;
}

/**
 * 从生成的模版里获取使用到的组件
 * @param html
 * @returns
 */
function getUsedComp(html: string) {
  return [
    "el-form",
    "el-form-item",
    "el-checkbox-group",
    "el-checkbox",
    "el-input",
    "el-select",
    "el-button",
    "el-radio-button",
    "el-radio",
    "el-option",
    "el-radio-group",
    "el-switch",
    "el-table",
    "el-pagination",
    "el-time-picker",
    "el-date-picker",
    "el-dialog",
    "el-table-column",
    "el-tabs",
    "el-tab-pane",
    "el-menu",
    "el-sub-menu",
    "el-menu-item",
    "el-steps",
    "el-step",
    "el-progress",
  ]
    .filter((item) => html.indexOf(item) > -1)
    .map((it) => {
      return it
        .split("-")
        .map((c) => c.slice(0, 1).toUpperCase() + c.slice(1).toLowerCase())
        .join("");
    });
}

/**
 * 组装Template代码
 * @param {Object} formConfig 整个表单配置
 * @param {String} type 生成类型，文件或弹窗等
 */
export function makeUpHtml(formConfig: FormConf, type: string, info: any): MakeHtmlResult {
  metaInfo = info;
  const formItemList: string[] = [];
  confGlobal = formConfig;
  // 遍历渲染每个组件成html
  // 默认table, pagination组件不在form里
  const htmlList: string[] = [];
  // 常见form表单组件顺序是连续的，若不连续以下处理会导致输出结果不正确
  formConfig.fields.forEach((el) => {
    if (!['table', 'pagination', 'dialog', 'menu', 'tabs', 'steps', 'progress'].includes(el.type)) {
      if (el.__config__.layout) {
        formItemList.push(layouts[el.__config__.layout](el));
      }
    } else {
      if (el.__config__.layout) {
        htmlList.push(layouts[el.__config__.layout](el));
      }
    }
  });
  let temp = "";
  const itemStr = formItemList.join("\n");
  const htmlStr = htmlList.join("\n");
  // 将组件代码放进form标签
  if (formItemList.length) {
    temp = buildFormTemplate(formConfig, itemStr, type);
  }
  if (htmlList.length) {
    temp = temp + htmlStr;
  }
  // dialog标签包裹代码
  if (type === "dialog") {
    temp = dialogWrapper(temp);
  }
  confGlobal = null;
  temp = `<template>
  ${temp}
</template>`;

  return {
    html: temp,
    info: {
      usedComponents: getUsedComp(temp),
      ...metaInfo,
    },
  };
}
