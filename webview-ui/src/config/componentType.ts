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
      defaultValue: undefined,
      required: true,
      layout: "colItem",
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
      defaultValue: undefined,
      required: true,
      layout: "colItem",
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
  //       defaultValue: undefined,
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
      layout: "colItem",
      span: 24,
      required: true,
      regList: [],
      changeTag: true,
    //   dynamic: true,
    //   url: '',
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
      changeTag: true,
      defaultValue: undefined,
      layout: "colItem",
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
      layout: "colItem",
      optionType: "default",
      required: true,
      regList: [],
      changeTag: true,
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
      layout: "colItem",
      regList: [],
      changeTag: true,
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
  //       layout: "colItem",
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
      layout: "colItem",
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
      layout: "colItem",
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
      layout: "colItem",
      required: true,
      regList: [],
      changeTag: true,
      type: 'date'
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
      layout: "colItem",
      regList: [],
      changeTag: true,
      type: "daterange"
    },
    placeholder: "请选择",
    disabled: false,
    readonly: false,
    type: "daterange",
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
    justify: "start",
    align: "top",
    gutter: "20"
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
      layout: "colItem",
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
      pagination: 'remote',
      children: [],
    },
    data: [],
    type: "table",
  },
  {
    __config__: {
      layout: "raw",
      tag: "el-pagination",
      tagIcon: "pagination",
      label: "分页条",
      'page-sizes': [10, 20, 30, 50],
      layoutItems: ['total']
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
      desc: '',
      show: false,
      closable: true,
      footer: true,
      okText: "确定",
      cancelText: "取消"
    },
    type: "dialog"
  },
  {
    __config__: {
      layout: "raw",
      span: 24,
      tagIcon: "menu",
      tag: "el-menu",
      label: "菜单导航",
      children: [],
      mode: 'vertical'
    },
    __slot__: {
      tag: 'el-menu',
      options:[
        {
          label: 'shouye',
          value: '0'
        },
        {
          label: '导航菜单一',
          value: '1',
          children: [{
            label: '菜单选项1-1',
            value: '1-1',
          },{
            label: '菜单选项1-2',
            value: '1-2',
            children: [{
              label: '菜单选项1-2-1',
              value: '1-2-1',
            }]
          }]
        },
        {
          label: '导航菜单二',
          value: '2'
        }
      ]
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
      children: [],
      position: 'top',
      type: 'card',
      editable: true
    },
    __slot__: {
      tag: 'el-tabs',
      options:[
        {
          label: '标签一',
          value: '1',
        },
        {
          label: '标签二',
          value: '2'
        },
        {
          label: '标签三',
          value: '3'
        }
      ]
    },
    type: "tabs",
  },
];
