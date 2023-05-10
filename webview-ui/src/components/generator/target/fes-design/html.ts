import ruleTrigger from "./ruleTrigger";

let confGlobal: FormConf | null = null;
let someSpanIsNot24 = false;

// span不为24的用el-col包裹
function colWrapper(scheme: ComponentItemJson, str: string) {
  if (someSpanIsNot24 || scheme.__config__.span !== 24) {
    return `<el-col :span="${scheme.__config__.span}">
          ${str}
        </el-col>`;
  }
  return str;
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
    let str = `<FFormItem ${labelWidth} ${label} prop="${scheme.__vModel__}" ${required}>
            ${tagDom}
          </FFormItem>`;
    str = colWrapper(scheme, str);
    return str;
  },
  rowItem(scheme: ComponentItemJson) {
    const config = scheme.__config__;
    const type = scheme.type === "default" ? "" : `type="${scheme.type}"`;
    const justify = scheme.type === "default" ? "" : `justify="${scheme.justify}"`;
    const align = scheme.type === "default" ? "" : `align="${scheme.align}"`;
    const gutter = scheme.gutter ? `:gutter="${scheme.gutter}"` : "";
    const children = config.children.map((el: ComponentItemJson) => {
      return el.__config__.layout ? layouts[el.__config__.layout](el) : "";
    });
    let str = `<el-row ${type} ${justify} ${align} ${gutter}>
          ${children.join("\n")}
        </el-row>`;
    str = colWrapper(scheme, str);
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
    const tag = "FButton";
    const { disabled } = attrBuilder(el);
    const type = el.type ? `type="${el.type}"` : "";
    const icon = el.icon ? `icon="${el.icon}"` : "";
    const round = el.round ? "round" : "";
    const size = el.size ? `size="${el.size}"` : "";
    const plain = el.plain ? "plain" : "";
    const circle = el.circle ? "circle" : "";
    let child = buildElButtonChild(el);

    if (child) child = `\n${child}\n`; // 换行
    return `<${tag} ${type} ${icon} ${round} ${size} ${plain} ${disabled} ${circle}>${child}</${tag}>`;
  },
  "el-input": (el: ComponentItemJson) => {
    const tag = "FInput";
    const { disabled, vModel, clearable, placeholder, width } = attrBuilder(el);
    const maxlength = el.maxlength ? `:maxlength="${el.maxlength}"` : "";
    const showWordLimit = el["show-word-limit"] ? "show-word-limit" : "";
    const readonly = el.readonly ? "readonly" : "";
    const prefixIcon = el["prefix-icon"] ? `prefix-icon='${el["prefix-icon"]}'` : "";
    const suffixIcon = el["suffix-icon"] ? `suffix-icon='${el["suffix-icon"]}'` : "";
    const showPassword = el["show-password"] ? "show-password" : "";
    const type = el.type ? `type="${el.type}"` : "";
    const autosize =
      el.autosize && el.autosize.minRows
        ? `:autosize="{minRows: ${el.autosize.minRows}, maxRows: ${el.autosize.maxRows}}"`
        : "";
    let child = buildElInputChild(el);

    if (child) child = `\n${child}\n`; // 换行
    return `<${tag} ${vModel} ${type} ${placeholder} ${maxlength} ${showWordLimit} ${readonly} ${disabled} ${clearable} ${prefixIcon} ${suffixIcon} ${showPassword} ${autosize} ${width}>${child}</${tag}>`;
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
    const tag = "FSelect";
    const { disabled, vModel, clearable, placeholder, width } = attrBuilder(el);
    const filterable = el.filterable ? "filterable" : "";
    const multiple = el.multiple ? "multiple" : "";
    let child = buildElSelectChild(el);

    if (child) child = `\n${child}\n`; // 换行
    return `<${tag} ${vModel} ${placeholder} ${disabled} ${multiple} ${filterable} ${clearable} ${width}>${child}</${tag}>`;
  },
  "el-radio-group": (el: ComponentItemJson) => {
    const tag = "FRadioGroup";
    const { disabled, vModel } = attrBuilder(el);
    const size = `size="${el.size}"`;
    let child = buildElRadioGroupChild(el);

    if (child) child = `\n${child}\n`; // 换行
    return `<${tag} ${vModel} ${size} ${disabled}>${child}</${tag}>`;
  },
  "el-checkbox-group": (el: ComponentItemJson) => {
    const tag = "FCheckboxGroup";
    const { disabled, vModel } = attrBuilder(el);
    const size = `size="${el.size}"`;
    const min = el.min ? `:min="${el.min}"` : "";
    const max = el.max ? `:max="${el.max}"` : "";
    let child = buildElCheckboxGroupChild(el);

    if (child) child = `\n${child}\n`; // 换行
    return `<${tag} ${vModel} ${min} ${max} ${size} ${disabled}>${child}</${tag}>`;
  },
  "el-switch": (el: ComponentItemJson) => {
    const tag = "FSwitch";
    const { disabled, vModel } = attrBuilder(el);
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
    // data height border size fit highlight-current-row
    const data = `:data="${el.__vModel__}"`;
    const border = `${el.__config__.border ? "border" : ""}`;
    return `<FTable ${border} ${data}>${child}</FTable>`;
  },
  "el-pagination": (el: ComponentItemJson) => {
    const data = `:page-size="${el.__vModel__}PageSize" :current-page="${el.__vModel__}currentPage"`;
    const total = `:total-count="${el.__vModel__}Total"`;
    const change = `@change="handleChange${el.__vModel__}"`;
    return `<FPagination ${data} ${total} ${change}></FPagination>`;
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
    const { disabled, vModel, clearable, placeholder, width } = attrBuilder(el);
    return `<FTimePicker ${vModel}  ${width} ${placeholder} ${clearable} ${disabled}/>`;
  },
  "el-date-picker": (el: ComponentItemJson) => {
    const { type, disabled, vModel, clearable, placeholder, width } = attrBuilder(el);
    const typeAttr = type ? `type="${type}"` : "";
    const readonly = el.readonly ? "readonly" : "";

    return `<FDatePicker ${typeAttr} ${vModel} ${width} ${placeholder} ${clearable} ${readonly} ${disabled} />`;
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

// el-table 子级
function buildElTableChild(scheme: ComponentItemJson) {
  let children: string[] = [];
  if (scheme.__config__.children) {
    children = scheme.__config__.children.map((it: ComponentItemJson) => {
      const prop = it.prop ? `prop="${it.prop}"` : "";
      const label = it.label ? `label="${it.label}"` : "";
      return `<FTableColumn ${prop} ${label}/>`;
    });
  }
  return children.join("\n");
}
// el-select 子级
function buildElSelectChild(scheme: ComponentItemJson) {
  const children = [];
  const slot = scheme.__slot__;
  if (slot && slot.options && slot.options.length) {
    children.push(
      `<FOption v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.label" :value="item.value" :disabled="item.disabled"></FOption>`
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
    const tag = config.optionType === "button" ? "FRadioButton" : "FRadio";
    const border = config.border ? "border" : "";
    children.push(
      `<${tag} v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.value" :disabled="item.disabled" ${border}>{{item.label}}</${tag}>`
    );
  }
  return children.join("\n");
}

// el-checkbox-group 子级
function buildElCheckboxGroupChild(scheme: ComponentItemJson) {
  const children = [];
  const slot = scheme.__slot__;
  const config = scheme.__config__;
  if (slot && slot.options && slot.options.length) {
    const tag = config.optionType === "button" ? "FCheckboxButton" : "FCheckbox";
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
    str = `<FFormItem size="large">
              <el-button type="primary" @click="submitForm">提交</el-button>
              <el-button @click="resetForm">重置</el-button>
            </FFormItem>`;
    if (someSpanIsNot24) {
      str = `<el-col :span="24">
              ${str}
            </el-col>`;
    }
  }
  return str;
}

function dialogWrapper(str: string) {
  return `<el-dialog v-bind="$attrs" v-on="$listeners" @open="onOpen" @close="onClose" title="Dialog Titile">
        ${str}
        <div slot="footer">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="handelConfirm">确定</el-button>
        </div>
      </el-dialog>`;
}

function buildFormTemplate(scheme: FormConf, child: string, type: string) {
  let labelPosition = "";
  if (scheme.labelPosition !== "right") {
    labelPosition = `label-position="${scheme.labelPosition}"`;
  }
  const disabled = scheme.disabled ? `:disabled="${scheme.disabled}"` : "";
  let str = `
<FForm ref="${scheme.formRef}" :model="${scheme.formModel}"
    :rules="${scheme.formRules}" size="${scheme.size}" ${disabled} label-width="${scheme.labelWidth}px" ${labelPosition}>
    ${child}
    ${buildFromBtns(scheme, type)}
</FForm>`;
  if (someSpanIsNot24) {
    str = `<el-row :gutter="${scheme.gutter}">
    ${str}
</el-row>`;
  }
  return str;
}

/**
 * 组装Template代码
 * @param {Object} formConfig 整个表单配置
 * @param {String} type 生成类型，文件或弹窗等
 */
export function makeUpHtml(formConfig: FormConf, type: string) {
  const formItemList: string[] = [];
  confGlobal = formConfig;
  // 判断布局是否都沾满了24个栅格，以备后续简化代码结构
  someSpanIsNot24 = formConfig.fields.some((item) => item.__config__.span !== 24);
  // 遍历渲染每个组件成html
  // 默认table, pagination组件不在form里
  const htmlList: string[] = [];

  formConfig.fields.forEach((el) => {
    if (el.type !== "table" && el.type !== "pagination") {
      if (el.__config__.layout) {
        formItemList.push(layouts[el.__config__.layout](el));
      }
    } else {
      if (el.__config__.layout) {
        htmlList.push(layouts[el.__config__.layout](el));
      }
    }
  });
  let temp = ''
  const itemStr = formItemList.join("\n");
  const htmlStr = htmlList.join("\n");
  // 将组件代码放进form标签
  if (formItemList.length) {
    temp = buildFormTemplate(formConfig, itemStr, type) 
  }
  if (htmlList.length) {
    temp = temp + htmlStr
  }
  // dialog标签包裹代码
  if (type === "dialog") {
    temp = dialogWrapper(temp);
  }
  confGlobal = null;
  return `<template>
    ${temp}
</template>`;
}
