// 表单属性【右面板】
export const formConfig:FormConfig = {
  formRef: "elForm",
  formModel: "formData",
  size: "small",
  labelPosition: "right",
  labelWidth: 100,
  formRules: "rules",
  gutter: 15,
  disabled: false,
  span: 24,
  formBtns: true,
};

// 输入型组件 【左面板】
export const inputComponents:ComponentItemJson[] = [
  {
    // 组件的自定义配置
    "__config__": {
      label: "单行文本",
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: "el-input",
      tagIcon: "input",
      defaultValue: undefined,
      required: true,
      layout: "colFormItem",
      span: 24,
      // 正则校验规则
      regList: [],
    },
    // 组件的插槽属性
    "__slot__": {
      prepend: "",
      append: "",
    },
    // 其余的为可直接写在组件标签上的属性
    "placeholder": "请输入",
    "readonly": false,
    "disabled": false,
    "type": "input"
  },
  {
    "__config__": {
      label: "多行文本",
      labelWidth: null,
      showLabel: true,
      tag: "el-input",
      tagIcon: "textarea",
      defaultValue: undefined,
      required: true,
      layout: "colFormItem",
      span: 24,
      regList: [],
      changeTag: true,
    },
    "placeholder": "请输入",
    "readonly": false,
    "disabled": false,
    "type": "textarea",
  },
// todo add counter type
//   {
//     "__config__": {
//       label: "计数器",
//       showLabel: true,
//       changeTag: true,
//       labelWidth: null,
//       tag: "el-input-number",
//       tagIcon: "number",
//       defaultValue: undefined,
//       span: 24,
//       layout: "colFormItem",
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
export const selectComponents:ComponentItemJson[] = [
  {
    __config__: {
      label: "下拉选择",
      showLabel: true,
      labelWidth: null,
      tag: "el-select",
      tagIcon: "select",
      layout: "colFormItem",
      span: 24,
      required: true,
      regList: [],
      changeTag: true,
    },
    __slot__: {
      options: [
        {
          label: "选项一",
          value: 1,
        },
        {
          label: "选项二",
          value: 2,
        },
      ],
    },
    placeholder: "请选择",
    disabled: false,
    readonly: false,
    type: "select"
  },
  {
    __config__: {
      label: "单选框组",
      labelWidth: null,
      showLabel: true,
      tag: "el-radio-group",
      tagIcon: "radio",
      changeTag: true,
      defaultValue: undefined,
      layout: "colFormItem",
      span: 24,
      optionType: "default",
      regList: [],
      required: true,
      border: false,
    },
    __slot__: {
      options: [
        {
          label: "选项一",
          value: 1,
        },
        {
          label: "选项二",
          value: 2,
        },
      ],
    },
    disabled: false,
    readonly: false,
    type: "radio"
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
      layout: "colFormItem",
      optionType: "default",
      required: true,
      regList: [],
      changeTag: true,
      border: false,
    },
    __slot__: {
      options: [
        {
          label: "选项一",
          value: 1,
        },
        {
          label: "选项二",
          value: 2,
        },
      ],
    },
    disabled: false,
    readonly: false,
    type: "checkbox"
  },
  {
    "__config__": {
      label: "开关",
      tag: "el-switch",
      tagIcon: "switch",
      defaultValue: false,
      span: 24,
      showLabel: true,
      labelWidth: null,
      layout: "colFormItem",
      required: true,
      regList: [],
      changeTag: true,
    },
    disabled: false,
    readonly: false,
    type: "switch"
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
//       layout: "colFormItem",
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
    "__config__": {
      label: "时间选择",
      tag: "el-time-picker",
      tagIcon: "time",
      defaultValue: null,
      span: 24,
      showLabel: true,
      layout: "colFormItem",
      labelWidth: null,
      required: true,
      regList: [],
      changeTag: true,
    },
    placeholder: "请选择",
    disabled: false,
    readonly: false,
    type: "timepicker"
  },
  {
    "__config__": {
      label: "时间范围",
      tag: "el-time-picker",
      tagIcon: "time-range",
      span: 24,
      showLabel: true,
      labelWidth: null,
      layout: "colFormItem",
      defaultValue: null,
      required: true,
      regList: [],
      changeTag: true,
    },
    placeholder: "请选择",
    disabled: false,
    readonly: false,
    type: "timerange"
  },
  {
    "__config__": {
      label: "日期选择",
      tag: "el-date-picker",
      tagIcon: "date",
      defaultValue: null,
      showLabel: true,
      labelWidth: null,
      span: 24,
      layout: "colFormItem",
      required: true,
      regList: [],
      changeTag: true,
    },
    placeholder: "请选择",
    disabled: false,
    readonly: false,
    type: "datepicker"
  },
  {
    "__config__": {
      label: "日期范围",
      tag: "el-date-picker",
      tagIcon: "date-range",
      defaultValue: null,
      span: 24,
      showLabel: true,
      labelWidth: null,
      required: true,
      layout: "colFormItem",
      regList: [],
      changeTag: true,
    },
    placeholder: "请选择",
    disabled: false,
    readonly: false,
    type: "daterange"
  }
];

// 布局型组件 【左面板】
export const layoutComponents:ComponentItemJson[] = [
  {
    __config__: {
      layout: "rowFormItem",
      tagIcon: "row",
      label: "行容器",
      layoutTree: true,
      children: []
    },
    type: "row",
    justify: "start",
    align: "top",
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
      layout: "colFormItem",
    },
    __slot__: {
      default: "主要按钮",
    },
    type: "button",
    disabled: false,
    readonly: false,
  },
//   {
//     __config__: {
//       layout: "colFormItem",
//       tagIcon: "table",
//       tag: "el-table",
//       span: 24,
//       formId: 101,
//       renderKey: 1595761764203,
//       componentName: "row101",
//       showLabel: true,
//       changeTag: true,
//       labelWidth: null,
//       label: "表格[开发中]",
//       dataType: "dynamic",
//       method: "get",
//       dataPath: "list",
//       dataConsumer: "data",
//       url: "https://www.fastmock.site/mock/f8d7a54fb1e60561e2f720d5a810009d/fg/tableData",
//       children: [
//         {
//           __config__: {
//             layout: "raw",
//             tag: "el-table-column",
//             renderKey: 15957617660153,
//           },
//           prop: "date",
//           label: "日期",
//         },
//         {
//           __config__: {
//             layout: "raw",
//             tag: "el-table-column",
//             renderKey: 15957617660152,
//           },
//           prop: "address",
//           label: "地址",
//         },
//         {
//           __config__: {
//             layout: "raw",
//             tag: "el-table-column",
//             renderKey: 15957617660151,
//           },
//           prop: "name",
//           label: "名称",
//         },
//         {
//           __config__: {
//             layout: "raw",
//             tag: "el-table-column",
//             renderKey: 1595774496335,
//             children: [
//               {
//                 __config__: {
//                   label: "按钮",
//                   tag: "el-button",
//                   tagIcon: "button",
//                   layout: "raw",
//                   renderKey: 1595779809901,
//                 },
//                 __slot__: {
//                   default: "主要按钮",
//                 },
//                 type: "primary",
//                 icon: "el-icon-search",
//                 round: false,
//                 size: "medium",
//               },
//             ],
//           },
//           label: "操作",
//         },
//       ],
//     },
//     data: [],
//     directives: [
//       {
//         name: "loading",
//         value: true,
//       },
//     ],
//     border: true,
//     type: "table",
//   },
];
