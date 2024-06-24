import ruleTrigger from "./ruleTrigger";

let confGlobal: FormConf | null = null;
let metaInfo: { [index: string]: any } = {};

type TagTemplate = {
  [propName: string]: (el: ComponentItemJson, params?: any) => string;
};

const tags: TagTemplate = {
  "el-row": (el: ComponentItemJson) => {
    const tag = "FGrid";
    const align = el.align ? `align="${el.align}"` : "";
    const justify = el.justify ? `justify="${el.justify}"` : "";
    const gutter = el.gutter ? `:gutter=${el.gutter}` : "";

    let child = el.__config__.children.map((it: ComponentItemJson) => {
        return tags[it.__config__.tag](it);
      }).join('\n');

    if (child) child = `\n${child}\n`; // 换行
    return `<${tag} ${align} ${gutter} >${child}</${tag}>`;
  },
  "el-col": (el: ComponentItemJson) => {
    const tag = "FGridItem";
    const span = el.__config__.span ? `:span="${el.__config__.span}"` : "";
    let child = el.__config__.children.map((it: ComponentItemJson) => {
        return tags[it.__config__.tag](it);
      }).join('\n');
    if (child) child = `\n${child}\n`; // 换行
    return `<${tag} ${span} >${child}</${tag}>`;
  },
  "el-badge": (el: ComponentItemJson) => {
    const tag = "FBadge";
    const { type } = attrBuilder(el);
    const typeStr = type ? `type="${type}"` : "";
    const size = el.size ? `size="${el.size}"` : "";
    const value = el.data ? `:value=${el.data}` : "";
    let child = buildElBadgeChild(el);

    if (child) child = `\n${child}\n`; // 换行
    return `<${tag} ${typeStr} ${size} ${value} >${child}</${tag}>`;
  },
  "el-button": (el: ComponentItemJson) => {
    const tag = "FButton";
    const { disabled, type } = attrBuilder(el);
    const typeStr = type ? `type="${type}"` : "";
    const icon = el.icon ? `icon="${el.icon}"` : "";
    const round = el.round ? "round" : "";
    const size = el.size ? `size="${el.size}"` : "";
    const plain = el.plain ? "plain" : "";
    const circle = el.circle ? "circle" : "";
    const click = `@click="click${el.__levelStr__}"`;
    let child = buildElButtonChild(el);

    if (child) child = `\n${child}\n`; // 换行
    return `<${tag} ${typeStr} ${icon} ${round} ${size} ${plain} ${disabled} ${circle} ${click}>${child}</${tag}>`;
  },
  "el-input": (el: ComponentItemJson) => {
    const tag = "FInput";
    const { disabled, vModel, clearable, placeholder, width, type } = attrBuilder(el);
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
  "el-select": (el: ComponentItemJson) => {
    const tag = "FSelect";
    const { disabled, vModel, clearable, placeholder, width } = attrBuilder(el);
    const filterable = el.filterable ? "filterable" : "";
    const multiple = el.multiple ? "multiple" : "";
    let child = buildElSelectChild(el);

    if (child) child = `\n${child}\n`; // 换行
    return `<${tag} ${vModel} ${placeholder} ${disabled} ${multiple} ${filterable} ${clearable} ${width}>${child}</${tag}>`;
  },
  "el-tree-select": (el: ComponentItemJson) => {
    const tag = "FSelectTree";
    const { disabled, vModel, placeholder, width } = attrBuilder(el);
    return `<${tag} ${vModel} ${placeholder} ${disabled}  ${width}></${tag}>`;
  },
  "el-tree": (el: ComponentItemJson) => {
    const tag = "FTree";
    const data = `:data="${el.__vModel__}"`;
    // selectable
    // draggable
    const checkable = el.__config__["show-checkbox"] ? "checkable" : "";
    return `<${tag} ${data} ${checkable}></${tag}>`;
  },
  "el-radio-group": (el: ComponentItemJson) => {
    const tag = "FRadioGroup";
    const { disabled, vModel } = attrBuilder(el);
    const size = el.size ? `size="${el.size}"` : "";
    let child = buildElRadioGroupChild(el);

    if (child) child = `\n${child}\n`; // 换行
    return `<${tag} ${vModel} ${size} ${disabled}>${child}</${tag}>`;
  },
  "el-checkbox-group": (el: ComponentItemJson) => {
    const tag = "FCheckboxGroup";
    const { disabled, vModel } = attrBuilder(el);
    const size = el.size ? `size="${el.size}"` : "";
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
    const data = `:data="tableData.data"`;
    const border = `${el.__config__.border ? "border" : ""}`;
    return `<FTable ${border} ${data}>${child}</FTable>`;
  },
  "el-pagination": (el: ComponentItemJson) => {
    const data = `:page-size="pageSize" :current-page="currentPage"`;
    const total = `:total-count="total"`;
    const change = `@change="handlePageChange"`;
    let layoutItems = "";
    if (el.__config__.layoutItems) {
      layoutItems += el.__config__.layoutItems.includes("jumper") ? "showQuickJumper " : "";
      layoutItems += el.__config__.layoutItems.includes("sizes") ? "showSizeChanger " : "";
      layoutItems += el.__config__.layoutItems.includes("total") ? "showTotal " : "";
    }
    return `<FPagination ${data} ${layoutItems} ${total} ${change}></FPagination>`;
  },
  "el-form": (el: ComponentItemJson) => {
    // form为合并组件识别和文本之后加上的，没有经过processConf补充属性
    // form配置取自formConfig
    let labelPosition = `label-position="${confGlobal?.labelPosition || 'right'}"`
    const disabled = confGlobal?.disabled ? `:disabled="${confGlobal?.disabled}"` : "";
    let children = el.__config__?.children.map((it: ComponentItemJson) => {
        return tags[it.__config__.tag](it);
      }).join('\n');

    let str = `<FForm ref="${confGlobal?.formRef}" :model="${confGlobal?.formModel}" :rules="${
        confGlobal?.formRules
    }" size="${confGlobal?.size}" ${disabled} label-width="${confGlobal?.labelWidth}px" ${labelPosition}>
            ${children}
            </FForm>`;
    return str;
  },
  "el-form-item": (el: ComponentItemJson) => {
    const config = el.__config__;
    let labelWidth = "";
    // 一个formitem 应当只有一个表单控件, formitem为合并组件识别和文本之后加上的，没有经过processConf补充属性
    let label = config.label
    if (el.__config__.children && el.__config__.children[0]) {
        label = el.__config__.children[0].__config__.label || config.label
    }
    label = `label="${label}"`;
    if (confGlobal && config.labelWidth && config.labelWidth !== confGlobal.labelWidth) {
      labelWidth = `label-width="${config.labelWidth}px"`;
    }
    if (config.showLabel === false) {
      labelWidth = 'label-width="0"';
      label = "";
    }
    const required = config.tag && !ruleTrigger[config.tag] && config.required ? "required" : "";
    let children = el.__config__.children.map((it: ComponentItemJson) => {
        return tags[it.__config__.tag](it);
      }).join('\n');
    let str = `<FFormItem ${labelWidth} ${label} prop="${el.__vModel__}" ${required}>
            ${children}
          </FFormItem>`;
    return str;
  },
  "el-dialog": (el: ComponentItemJson) => {
    const { title, footer, okText, cancelText } = el.__config__;
    let children = el.__config__.children.map((it: ComponentItemJson) => {
      return tags[it.__config__.tag](it);
    }).join('\n');
    const cancelEvent = `@click="onCancel"`;
    const okEvent = `@click="onOk"`;
    const footerTpl = footer
      ? `<template #footer>
            <FButton style="margin-right: 15px" ${cancelEvent}>
                ${cancelText}
            </FButton>
            <FButton type="primary" ${okEvent}>${okText}</FButton>
        </template>`
      : "";
    return `<FModal v-model:show="showModal" title="${title}">
                ${children}
                ${footerTpl}
            </FModal>`;
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
  "el-tabs": (el: ComponentItemJson) => {
    const { vModel } = attrBuilder(el);
    const editable = `:editable="${el.__config__.editable}"`;
    const tabPotion = `position="${el.__config__.position}"`;
    let child = buildElTabsChild(el);

    if (child) child = `\n${child}\n`; // 换行
    return `<FTabs ${vModel} ${editable} ${tabPotion}>${child}</FTabs>`;
  },
  "el-menu": (el: ComponentItemJson) => {
    const mode = `mode="${el.__config__.mode}"`;
    let child = buildElMenuChild(el);

    if (child) child = `\n${child}\n`; // 换行
    return `<FMenu ${mode}>${child}</FMenu>`;
  },
  "el-steps": (el: ComponentItemJson) => {
    const vertical = el.__config__.mode === "vertical" ? "vertical" : "";
    let child = buildElStepsChild(el);

    if (child) child = `\n${child}\n`; // 换行
    return `<FSteps ${vertical}>${child}</FSteps>`;
  },
  "el-tooltip": (el: ComponentItemJson) => {
    const content = el.content ? `content="${el.content}"` : "";
    const placement = el.placement ? `placement="${el.placement}"` : "";
    const trigger = el.trigger ? `trigger="${el.trigger}"` : "";
    const mode = el.mode ? `mode="${el.mode}"` : "";
    const slot = `<FButton>查看</FButton>`;
    return `<FTooltip ${content} ${placement} ${trigger} ${mode}>${slot}</FTooltip>`;
  },
  "el-alert": (el: ComponentItemJson) => {
    const type = el.__config__.type ? `type="${el.__config__.type}"` : "";
    const message = el.title ? `message="${el.title}"` : "";
    const description = el.description ? `description="${el.description}"` : "";
    const showIcon = el["show-icon"] ? "show-icon" : "";
    const closable = el.closable ? "closable" : "";
    const center = el.center ? "center" : "";
    return `<FAlert ${type} ${message} ${description} ${showIcon} ${closable} ${center} ></FAlert>`;
  },
  "el-calendar": (el: ComponentItemJson) => {
    const { vModel } = attrBuilder(el);
    return `<FCalendar ${vModel}></FCalendar>`;
  },
  "el-rate": (el: ComponentItemJson) => {
    const { vModel, clearable, disabled } = attrBuilder(el);
    const allowHalf = el["allow-half"] ? "allow-half" : "";
    const readonly = el.readonly ? "readonly" : "";
    const size = el.size !== "default" ? `size=${el.size}` : "";
    const count = `:count="${el.max}"`;
    const showText = el["show-text"] ? `show-text` : "";
    const texts = el["show-text"] ? `:texts="${JSON.stringify(el.texts).replace(/"/g, "'")}"` : "";
    return `<FRate ${vModel}  ${texts} ${size} ${count} ${showText} ${allowHalf} ${readonly} ${clearable} ${disabled}></FRate>`;
  },
  "el-progress": (el: ComponentItemJson) => {
    const type = el.__config__.type;
    let child = `<template #text>
                 <span class="text">${el.__slot__?.default}</span>
             </template>`;

    if (child) child = `\n${child}\n`; // 换行
    // type line cycle
    return `<FProgress percent="50" type="${type}" ${
      type === "line" ? "showOutPercent" : "showCircleText"
    } >${child}</FProgress>`;
  },
  "el-breadcrumb": (el: ComponentItemJson) => {
    let child = "";
    if (el.__slot__?.options) {
      child = el.__slot__.options
        .map((it) => {
          return `<FBreadcrumbItem>${it.label}</FBreadcrumbItem>`;
        })
        .join("\n");
    }
    return `<FBreadcrumb>\n${child}\n</FBreadcrumb>`;
  },
  "el-timeline": (el: ComponentItemJson) => {
    const { direction, titlePosition, descPosition } = el.__config__;
    const data = `:data="${el.__vModel__}"`;
    let _direction = `direction="${direction || ""}"`;
    let _titlePosition = `titlePosition="${titlePosition || ""}"`;
    let _descPosition = `descPosition="${descPosition || ""}"`;
    return `<FTimeline ${data} ${_direction} ${_titlePosition} ${_descPosition} />`;
  },
};

function attrBuilder(el: ComponentItemJson) {
  return {
    tag: el.__config__.tag,
    type: el.__config__.type,
    vModel: `v-model="${confGlobal?.formModel}.${el.__vModel__}"`,
    clearable: el.clearable ? "clearable" : "",
    placeholder: el.placeholder ? `placeholder="${el.placeholder}"` : "",
    width: el.__config__.style && el.__config__.style.width ? `:style="{'width':'${el.__config__.style.width}'}"`: ":style=\"{'width': '100%'}\"",
    disabled: el.disabled ? ":disabled='true'" : "",
  };
}

// el-buttin 子级
function buildElBadgeChild(scheme: ComponentItemJson) {
  const children = [];
  const slot = scheme.__slot__ || {};
  if (slot.default) {
    return `<FButton>${slot.default}</FButton>`;
  }
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
    children = scheme.__config__.children.map((it: ComponentItemJson, index: number) => {
      let prop = it.prop ? `prop="${it.prop}"` : "";
      const label = it.label ? `label="${it.label}"` : "";
      let action = "";
      // todo 操作 等特殊列 判断条件
      if (it.__config__.actionLabels) {
        metaInfo.actionLabels = it.__config__.actionLabels;
        metaInfo.talbeAction = `${scheme.__vModel__}_col_${index}_actions`;
        action = `:action="${scheme.__vModel__}_col_${index}_actions"`;
      }
      return `<FTableColumn ${prop} ${label} ${action} />`;
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

// el-steps 子级
function buildElStepsChild(scheme: ComponentItemJson) {
  const children = [];
  const slot = scheme.__slot__;
  if (slot && slot.options && slot.options.length) {
    children.push(
      `<FStep v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :description="item.value" :title="item.label"></FStep>`
    );
  }
  return children.join("\n");
}
// el-menu 子级
function buildElMenuChild(scheme: ComponentItemJson) {
  const children = [];
  const slot = scheme.__slot__;
  function resolveMenu(children: Array<OptionItem>): Array<any> | string {
    let strHtml = "";
    children.forEach((item: OptionItem) => {
      if (item.children) {
        strHtml += `<FSubMenu value='${item.value}'>
          <template #label>${item.label}</template>
          ${resolveMenu(item.children)}
        </FSubMenu>`;
      } else {
        strHtml += `<FMenuItem value='${item.value}' label=${item.label}></FMenuItem>`;
      }
    });
    return strHtml;
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
      let childrenComponet: string | Array<string> = [];
      if (item.childrenComponet && item.childrenComponet.length) {
        childrenComponet = item.childrenComponet.map((el: ComponentItemJson) => {
          return tags[el.__config__.tag](el);
        });
      }
      children.push(
        `<FTabPane key="${index}" name="${item.label}" value="${item.value}">
        ${childrenComponet}
      </FTabPane>`
      );
    }
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
      `<FButton size="small" type="primary" icon="el-icon-upload">${config.buttonText}</FButton>`
    );
  if (config.showTip)
    list.push(
      `<div slot="tip" class="el-upload__tip">只能上传不超过 ${config.fileSize}${config.sizeUnit} 的${scheme.accept}文件</div>`
    );
  return list.join("\n");
}

/**
 * 从生成的模版里获取使用到的组件
 * @param html
 * @returns
 */
function getUsedComp(html: string) {
  return [
    "FForm",
    "FFormItem",
    "FCheckboxGroup",
    "FCheckbox",
    "FInput",
    "FSelect",
    "FSelectTree",
    "FTree",
    "FButton",
    "FRadioButton",
    "FRadio",
    "FOption",
    "FRadioGroup",
    "FSwitch",
    "FTable",
    "FTableColumn",
    "FDatePicker",
    "FTimePicker",
    "FPagination",
    "FModal",
    "FGrid",
    "FGridItem",
    "FTabs",
    "FTabPane",
    "FMenu",
    "FSubMenu",
    "FMenuItem",
    "FSteps",
    "FStep",
    "FTooltip",
    "FAlert",
    "FCalendar",
    "FRate",
  ].filter((item) => html.indexOf(item) > -1);
}

/**
 * 组装Template代码
 * @param {Object} formConfig 整个表单配置
 * @param {String} type 生成类型，文件或弹窗等
 */
export function makeUpHtml(formConfig: FormConf, type: string, info: any): MakeHtmlResult {
  metaInfo = info;
  confGlobal = formConfig;
  let temp = "";
  temp = formConfig.fields
    .map((el) => {
      return tags[el.__config__.tag](el);
    })
    .join("\n");
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
