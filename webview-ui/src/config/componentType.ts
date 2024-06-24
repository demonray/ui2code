// 表单属性【右面板】
export const formConfig: FormConfig = {
  formRef: "elFormRef",
  formModel: "formData",
  size: "small",
  labelPosition: "right",
  labelWidth: 100,
  formRules: "rules",
  gutter: 15,
  disabled: false,
  span: 24,
  formBtns: false,
};

// 输入型组件 【左面板】
export const inputComponents: ComponentItemJson[] = [
  {
    // 组件的自定义配置
    __config__: {
      label: "单行文本",
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: "el-input",
      tagIcon: "input",
      defaultValue: null,
      required: true,
      layout: "raw",
      span: 24,
      // 正则校验规则
      regList: [],
    },
    // 组件的插槽属性
    __slot__: {
      prepend: "",
      append: "",
    },
    // 其余的为可直接写在组件标签上的属性
    placeholder: "请输入",
    readonly: false,
    disabled: false,
    type: "input",
  },
  {
    __config__: {
      label: "多行文本",
      labelWidth: null,
      showLabel: true,
      tag: "el-input",
      tagIcon: "textarea",
      defaultValue: null,
      required: true,
      layout: "raw",
      span: 24,
      regList: [],
      changeTag: true,
      type: "textarea",
    },
    placeholder: "请输入",
    readonly: false,
    disabled: false,
    type: "textarea",
  },
  //   {
  //     "__config__": {
  //       label: "计数器",
  //       showLabel: true,
  //       changeTag: true,
  //       labelWidth: null,
  //       tag: "el-input-number",
  //       tagIcon: "number",
  //       defaultValue: null,
  //       span: 24,
  //       layout: "colItem",
  //       required: true,
  //       regList: [],
  //     },
  //     "placeholder": "",
  //     "readonly": false,
  //     "disabled": false,
  //     "type": "counter",
  //   },
];

// 选择型组件 【左面板】
export const selectComponents: ComponentItemJson[] = [
  {
    __config__: {
      label: "下拉选择",
      showLabel: true,
      labelWidth: null,
      tag: "el-select",
      tagIcon: "select",
      layout: "raw",
      span: 24,
      required: true,
      regList: [],
      changeTag: true,
      defaultValue: null,
      dynamic: true,
      url: "",
    },
    __slot__: {
      options: [],
    },
    placeholder: "请选择",
    disabled: false,
    readonly: false,
    type: "select",
  },
  {
    __config__: {
      label: "单选框组",
      labelWidth: null,
      showLabel: true,
      tag: "el-radio-group",
      tagIcon: "radio",
      changeTag: false,
      defaultValue: null,
      layout: "raw",
      span: 24,
      optionType: "default",
      regList: [],
      required: true,
    },
    __slot__: {
      options: [],
    },
    disabled: false,
    readonly: false,
    type: "radio",
  },
  {
    __config__: {
      label: "多选框组",
      tag: "el-checkbox-group",
      tagIcon: "checkbox",
      defaultValue: [],
      span: 24,
      showLabel: true,
      labelWidth: null,
      layout: "raw",
      optionType: "default",
      required: true,
      regList: [],
      changeTag: false,
    },
    __slot__: {
      options: [],
    },
    disabled: false,
    readonly: false,
    type: "checkbox",
  },
  {
    __config__: {
      label: "开关",
      tag: "el-switch",
      tagIcon: "switch",
      defaultValue: false,
      span: 24,
      showLabel: true,
      labelWidth: null,
      layout: "raw",
      regList: [],
      changeTag: false,
    },
    disabled: false,
    readonly: false,
    type: "switch",
  },
  // todo
  //   {
  //     "__config__": {
  //       label: "滑块",
  //       tag: "el-slider",
  //       tagIcon: "slider",
  //       defaultValue: null,
  //       span: 24,
  //       showLabel: true,
  //       layout: "raw",
  //       labelWidth: null,
  //       required: true,
  //       regList: [],
  //       changeTag: true,
  //     },
  //     disabled: false,
  //     readonly: false,
  //     type: "slider"
  //   },
  {
    __config__: {
      label: "时间选择",
      tag: "el-time-picker",
      tagIcon: "time",
      defaultValue: null,
      span: 24,
      showLabel: true,
      layout: "raw",
      labelWidth: null,
      required: true,
      regList: [],
      changeTag: true,
    },
    placeholder: "请选择",
    disabled: false,
    readonly: false,
    type: "timepicker",
  },
  {
    __config__: {
      label: "时间范围",
      tag: "el-time-picker",
      tagIcon: "time-range",
      span: 24,
      showLabel: true,
      labelWidth: null,
      layout: "raw",
      defaultValue: null,
      required: true,
      regList: [],
      changeTag: true,
    },
    placeholder: "请选择",
    disabled: false,
    readonly: false,
    type: "timerange",
  },
  {
    __config__: {
      label: "日期选择",
      tag: "el-date-picker",
      tagIcon: "date",
      defaultValue: null,
      showLabel: true,
      labelWidth: null,
      span: 24,
      layout: "raw",
      required: true,
      regList: [],
      changeTag: true,
      type: "date",
    },
    placeholder: "请选择",
    disabled: false,
    readonly: false,
    type: "datepicker",
  },
  {
    __config__: {
      label: "日期范围",
      tag: "el-date-picker",
      tagIcon: "date-range",
      defaultValue: null,
      span: 24,
      showLabel: true,
      labelWidth: null,
      required: true,
      layout: "raw",
      regList: [],
      changeTag: true,
      type: "daterange",
    },
    placeholder: "请选择",
    disabled: false,
    readonly: false,
    type: "daterange",
  },
  {
    __config__: {
      label: "日历",
      tag: "el-calendar",
      tagIcon: "calendar",
      span: 24,
      layout: "raw",
      defaultValue: Date.now(),
      changeTag: true,
    },
    __slot__: {},
    type: "calendar",
  },
  {
    "__config__": {
      label: "评分",
      tag: "el-rate",
      tagIcon: "rate",
      span: 24,
      layout: "raw",
      changeTag: true,
      required: true,
      showLabel: true,
      labelWidth: null,
      defaultValue: null,
    },
    "type": "rate",
    "disabled": false,
    "clearable": false,
    "max": 5,
    "size": "default",
    "allow-half": false,
    "show-text": false,
    "texts": ["极差", "失望", "一般", "满意", "惊喜"],
  },
  {
    __config__: {
      "label": "树形控件",
      "showLabel": false,
      "labelWidth": null,
      "tag": "el-tree",
      "tagIcon": "tree",
      "layout": "raw",
      "span": 24,
      "changeTag": true,
      "show-checkbox": true,
      "props": {
        children: "children",
        label: "label",
        disabled: "disabled",
      },
      "node-key": "value",
    },
    placeholder: "",
    disabled: false,
    readonly: false,
    type: "tree",
    data: [
      {
        value: "1",
        label: "Level one 1",
        children: [
          {
            value: "1-1",
            label: "Level two 1-1",
            children: [
              {
                value: "1-1-1",
                label: "Level three 1-1-1",
              },
            ],
          },
        ],
      },
    ],
  },
];

// 布局型组件 【左面板】
export const layoutComponents: ComponentItemJson[] = [
  {
    __config__: {
      layout: "rowItem",
      tagIcon: "row",
      label: "行容器",
      tag: "el-row",
      children: [],
    },
    type: "row",
    justify: "flex-start",
    align: "flex-start",
    gutter: "20",
  },
  {
    __config__: {
      layout: "colItem",
      tagIcon: "col",
      label: "列容器",
      tag: "el-col",
      children: [],
      span: "24",
    },
    type: "col",
  },
  {
    __config__: {
      label: "按钮",
      showLabel: false,
      changeTag: true,
      labelWidth: null,
      tag: "el-button",
      tagIcon: "button",
      span: 24,
      type: "primary",
      layout: "raw",
    },
    __slot__: {
      default: "主要按钮",
    },
    type: "button",
    disabled: false,
    readonly: false,
  },
  {
    __config__: {
      layout: "raw",
      tagIcon: "table",
      tag: "el-table",
      span: 24,
      label: "表格",
      dynamic: true,
      url: "",
      border: true,
      pagination: "remote",
      children: [],
    },
    data: [],
    type: "table",
  },
  {
    __config__: {
      "layout": "raw",
      "tag": "el-pagination",
      "tagIcon": "pagination",
      "label": "分页条",
      "page-sizes": [10, 20, 30, 50],
      "layoutItems": ["total"],
    },
    type: "pagination",
  },
  {
    __config__: {
      layout: "raw",
      tagIcon: "row",
      label: "弹窗",
      tag: "el-dialog",
      children: [],
      title: "Dialog Titile",
      desc: "",
      show: true,
      defaultValue: true,
      closable: true,
      footer: true,
      okText: "确定",
      cancelText: "取消",
    },
    type: "dialog",
  },
  {
    __config__: {
      layout: "raw",
      span: 24,
      tagIcon: "menu",
      tag: "el-menu",
      label: "菜单导航",
      children: [],
      defaultValue: null,
      mode: "vertical",
    },
    __slot__: {
      options: [
        {
          label: "shouye",
          value: "0",
        },
        {
          label: "导航菜单一",
          value: "1",
          children: [
            {
              label: "菜单选项1-1",
              value: "1-1",
            },
            {
              label: "菜单选项1-2",
              value: "1-2",
              children: [
                {
                  label: "菜单选项1-2-1",
                  value: "1-2-1",
                },
              ],
            },
          ],
        },
        {
          label: "导航菜单二",
          value: "2",
        },
      ],
    },
    type: "menu",
  },
  {
    __config__: {
      layout: "raw",
      span: 24,
      tagIcon: "tabs",
      tag: "el-tabs",
      label: "Tabs标签页",
      position: "top",
      type: "card",
      editable: true,
      defaultValue: null,
      children: [],
    },
    __slot__: {
      options: [
        {
          label: "标签一",
          value: "1",
          childrenComponet: [],
        },
        {
          label: "标签二",
          value: "2",
          childrenComponet: [],
        },
        {
          label: "标签三",
          value: "3",
          childrenComponet: [],
        },
      ],
    },
    type: "tab",
  },
  {
    __config__: {
      layout: "raw",
      span: 24,
      tagIcon: "steps",
      tag: "el-steps",
      label: "步骤条",
      children: [],
      mode: "vertical",
    },
    __slot__: {
      options: [
        {
          label: "已完成",
          value: "All through the day, I me mine I me mine, I me mine",
        },
        {
          label: "进行中",
          value: "When I find myself in times of trouble Mother Mary comes to me",
        },
        {
          label: "待处理",
          value: "Here come old flat top He come grooving up slowly",
        },
      ],
    },
    type: "steps",
  },
  {
    __config__: {
      label: "进度条",
      showLabel: false,
      labelWidth: null,
      tag: "el-progress",
      tagIcon: "progress",
      type: "line",
      span: 24,
      layout: "raw",
    },
    __slot__: {
      default: "pending",
    },
    status: "",
    type: "progress",
    percentage: 50,
    strokeWidth: 10,
  },
  {
    __config__: {
      label: "时间线",
      showLabel: false,
      labelWidth: null,
      tag: "el-timeline",
      tagIcon: "timeline",
      type: "primary",
      span: 24,
      layout: "raw",
      direction: "column",
      titlePosition: "end",
      descPosition: "under",
    },
    __slot__: {
      options: [
        {
          label: "Event start",
          value: "2018-04-15",
        },
        {
          label: "Approved",
          value: "2018-04-13",
        },
        {
          label: "Success",
          value: "2018-04-11",
        },
      ],
    },
    type: "timeline",
  },
  {
    __config__: {
      layout: "raw",
      span: 24,
      tagIcon: "menu",
      tag: "el-breadcrumb",
      label: "面包屑",
    },
    __slot__: {
      options: [
        {
          label: "home",
          value: "home",
        },
        {
          label: "list",
          value: "list",
        },
      ],
    },
    type: "breadcrumb",
    separator: "/",
  },
  {
    __config__: {
      layout: "raw",
      span: 24,
      tagIcon: "form",
      tag: "el-form",
      label: "表单",
    },
    type: "form",
  },
  {
    __config__: {
      layout: "raw",
      span: 24,
      tagIcon: "formitem",
      tag: "el-form-item",
      label: "表单项",
    },
    __slot__: {
    },
    type: "formitem",
  },
];

// 信息反馈型组件 【左面板】
export const infoFeedbackComponents: ComponentItemJson[] = [
  {
    __config__: {
      label: "文字提示",
      tag: "el-tooltip",
      tagIcon: "tooltip",
      span: 24,
      layout: "raw",
      changeTag: false,
    },
    __slot__: {
      default: `查看更多`,
    },
    type: "tooltip",
    trigger: "click",
    placement: "top",
    content: "文字提示内容",
    mode: "text",
  },
  {
    __config__: {
      label: "警告提示",
      layout: "raw",
      tag: "el-alert",
      tagIcon: "alert",
      span: 24,
      type: "success",
      changeTag: true,
    },
    __slot__: {},
    type: "alert",
    title: "常规信息提示内容",
    effect: "light",
  },
  {
    __config__: {
      label: "Badge徽章",
      layout: "raw",
      tag: "el-badge",
      tagIcon: "badge",
      span: 24,
      type: "success",
      changeTag: true,
    },
    __slot__: {
      default: "dddd",
    },
    data: "99",
    type: "badge",
  },
];

/**
 * 查找对应组件设计器配置
 */
export function findComponentConf(type: UiType): ComponentItemJson {
  const findConf = [
    ...inputComponents,
    ...selectComponents,
    ...layoutComponents,
    ...infoFeedbackComponents,
  ].find((it) => {
    return it.type === type;
  });
  return findConf && JSON.parse(JSON.stringify(findConf));
}
