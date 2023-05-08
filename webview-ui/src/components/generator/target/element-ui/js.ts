import { exportDefault, titleCase, deepClone } from "../../../../utilities/index";
import ruleTrigger from "./ruleTrigger";

let confGlobal: FormConf | null = null;

/**
 * 组装js 【入口函数】
 * @param {Object} formConfig 整个表单配置
 * @param {String} type 生成类型，文件或弹窗等
 */
export function makeUpJs(formConfig: FormConf, type: string) {
  confGlobal = formConfig = deepClone(formConfig);
  const dataList: any[] = [];
  const ruleList: any[] = [];
  const optionsList: any[] = [];
  const methodList = mixinMethod(type);
  const created: any[] = [];

  const tableList: any[] = [];
  formConfig.fields.forEach((el) => {
    if (el.type === "table") {
      tableList.push(`${el.__vModel__}: ${JSON.stringify(el.data)},`);
    } else {
      buildAttributes(el, dataList, ruleList, optionsList, methodList, created);
    }
  });

  const dataStr = `${formConfig.formModel}: {
    ${dataList.join("\n")}
  },
  ${tableList.join("\n")}`;

  const script = buildexport(
    formConfig,
    type,
    dataStr,
    ruleList.join("\n"),
    optionsList.join("\n"),
    methodList.join("\n"),
    created.join("\n")
  );
  confGlobal = null;
  return script;
}

// 构建组件属性
function buildAttributes(
  scheme: ComponentItemJson,
  dataList: any[],
  ruleList: any[],
  optionsList: any[],
  methodList: any[],
  created: any[]
) {
  const config = scheme.__config__;
  const slot = scheme.__slot__;
  buildData(scheme, dataList);
  buildRules(scheme, ruleList);

  // 特殊处理options属性
  if (scheme.options || (slot && slot.options && slot.options.length)) {
    buildOptions(scheme, optionsList);
    if (config.dataType === "dynamic") {
      const model = `${scheme.__vModel__}Options`;
      const options = titleCase(model);
      const methodName = `get${options}`;
      buildFetchDataMethod(methodName, model, methodList, scheme);
      callInCreated(methodName, created);
    }
  }
  // 构建子级组件属性
  if (config.children && config.layout === "rowItem") {
    config.children.forEach((item: any) => {
      buildAttributes(item, dataList, ruleList, optionsList, methodList, created);
    });
  }
}

// 在Created调用函数
function callInCreated(methodName: string, created: string[]) {
  created.push(`this.${methodName}()`);
}

// 混入处理函数
function mixinMethod(type: string) {
  const list: any[] = [];
  const minxins = {
    file:
      confGlobal && confGlobal.formBtns
        ? {
            submitForm: `submitForm() {
        this.$refs['${confGlobal.formRef}'].validate(valid => {
          if(!valid) return
          // TODO 提交表单
        })
      },`,
            resetForm: `resetForm() {
        this.$refs['${confGlobal.formRef}'].resetFields()
      },`,
          }
        : null,
  };

  const methods = type === "file" && minxins[type];
  if (methods) {
    Object.keys(methods).forEach((key) => {
      list.push(methods[key]);
    });
  }

  return list;
}

// 构建data
function buildData(scheme: ComponentItemJson, dataList: string[]) {
  const config = scheme.__config__;
  if (scheme.__vModel__ === undefined) return;
  const defaultValue = JSON.stringify(config.defaultValue);
  dataList.push(`${scheme.__vModel__}: ${defaultValue},`);
}

// 构建校验规则
function buildRules(scheme: ComponentItemJson, ruleList: string[]) {
  const config = scheme.__config__;
  if (scheme.__vModel__ === undefined) return;
  const rules = [];
  if (config.tag && ruleTrigger[config.tag]) {
    if (config.required) {
      const type = Array.isArray(config.defaultValue) ? "type: 'array'," : "";
      let message = Array.isArray(config.defaultValue)
        ? `请至少选择一个${config.label}`
        : scheme.placeholder;
      if (message === undefined) message = `${config.label}不能为空`;
      rules.push(
        `{ required: true, ${type} message: '${message}', trigger: '${ruleTrigger[config.tag]}' }`
      );
    }
    if (config.regList && Array.isArray(config.regList)) {
      config.regList.forEach((item: { pattern: string; message: any }) => {
        if (item.pattern) {
          rules.push(
            `{ pattern: ${eval(item.pattern)}, message: '${item.message}', trigger: '${
              config.tag ? ruleTrigger[config.tag] : ""
            }' }`
          );
        }
      });
    }
    ruleList.push(`${scheme.__vModel__}: [${rules.join(",")}],`);
  }
}

// 构建options
function buildOptions(scheme: ComponentItemJson, optionsList: string[]) {
  if (scheme.__vModel__ === undefined) return;
  let { options } = scheme;
  if (!options && scheme.__slot__) options = scheme.__slot__.options;
  if (scheme.__config__.dataType === "dynamic") {
    options = [];
  }
  const str = `${scheme.__vModel__}Options: ${JSON.stringify(options)},`;
  optionsList.push(str);
}

function buildFetchDataMethod(
  methodName: string,
  model: string,
  methodList: string[],
  scheme: { __config__: any }
) {
  const config = scheme.__config__;
  let str = "";
  if (config.url) {
    str = `${methodName}() {
        // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
        this.$axios({
          method: '${config.method}',
          url: '${config.url}'
        }).then(resp => {
          let { data } = resp
          // this.${model} = data
        })
      },`;
  }
  if (str) methodList.push(str);
}

// js整体拼接
function buildexport(
  conf: FormConf,
  type: string,
  data: string,
  rules: string,
  selectOptions: string,
  methods: string,
  created: string
) {
  const str = `${exportDefault}{
  components: {},
  props: [],
  data () {
    return {
      ${data}
      ${conf.formRules}: {
        ${rules}
      },
      ${selectOptions}
    }
  },
  computed: {},
  watch: {},
  created () {
    ${created}
  },
  mounted () {},
  methods: {
    ${methods}
  }
}`;
  return str;
}
