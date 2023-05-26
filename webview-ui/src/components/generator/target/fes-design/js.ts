import { deepClone, titleCase } from "../../../../utilities/index";
import ruleTrigger from "./ruleTrigger";

let confGlobal: FormConf | null = null;

/**
 * 动态获取数据函数
 * @param methodName
 * @param model
 * @param methodList
 * @param scheme
 */
function buildFetchDataMethod(
  methodName: string,
  model: string,
  methodList: string[],
  scheme: { __config__: any }
) {
  const config = scheme.__config__;
  let str = "";
  str = `function ${methodName}(params) {
          // 注意：this.$axios是通过app.config.globalProperties.$axios = axios挂载产生的
          this.$axios({
            method: 'get',
            url: '${config.url}',
            params
          }).then(resp => {
            let { data, total } = resp
            // ${model}.length = 0
            // ${model}.push(...data)
            // todo total
          })
        }`;
  methodList.push(str);
}

// 构建data
function buildData(scheme: ComponentItemJson, dataList: string[], formDataList: string[]) {
  const config = scheme.__config__;
  if (scheme.__vModel__ === undefined) return;
  if (scheme.type === "pagination") {
    dataList.push(`
    const ${scheme.__vModel__}PageSize = ref(10)
    const ${scheme.__vModel__}currentPage = ref(1)
    const ${scheme.__vModel__}Total = ref(0)
    `);
  } else if (scheme.type === "table") {
    let str = "";
    if (config.pagination === "local") {
      //
    } else {
      str = `const ${scheme.__vModel__} = reactive(
            ${JSON.stringify(scheme.data)}
        )`;
    }
    dataList.push(str);
  } else if (scheme.type === "dialog") {
    dataList.push(`
        const ${scheme.__vModel__} = ref(true)
    `);
  } else if (config.dynamic) {
    const str = `const ${scheme.__vModel__} = reactive(
        ${JSON.stringify(scheme.data)}
      )`;
    dataList.push(str);
  } else {
    // todo dialog vmodel 不是formData里的
    console.log(scheme);
    const defaultValue = JSON.stringify(config.defaultValue);
    formDataList.push(`${scheme.__vModel__}: ${defaultValue}`);
  }
}

function getOptionsModelKeyAndMethod(scheme: ComponentItemJson) {
  const optModel = `${scheme.__vModel__}Options`;
  const methodName = `get${titleCase(optModel)}`;
  return {
    model: optModel,
    method: methodName,
  };
}

// 构建options
function buildOptions(
  scheme: ComponentItemJson,
  methodList: string[],
  dataList: string[],
  mounted: string[]
) {
  if (scheme.__vModel__ === undefined) return;
  let { options } = scheme;
  const { model, method } = getOptionsModelKeyAndMethod(scheme);
  if (scheme.__config__.dynamic) {
    if (scheme.__config__.pagination === "remote" || scheme.__config__.pagination === "none") {
      buildFetchDataMethod(method, scheme.__vModel__, methodList, scheme);
      mounted.push(`// ${method}()`);
      return;
    } else {
      buildFetchDataMethod(method, model, methodList, scheme);
      mounted.push(`// ${method}()`);
    }
    options = Array.isArray(scheme.data) ? scheme.data : [];
  } else if (!options && scheme.__slot__ && scheme.__slot__.options) {
    options = scheme.__slot__.options;
  } else if (!options) {
    return;
  }
  const str = `const ${model} = reactive(
        ${JSON.stringify(options)}
      )`;
  dataList.push(str);
}

// 构建校验规则
function buildRules(scheme: ComponentItemJson, ruleList: string[]) {
  const config = scheme.__config__;
  if (scheme.__vModel__ === undefined) return;
  const rules = [];
  if (ruleTrigger[config.tag]) {
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
      config.regList.forEach((item) => {
        if (item.pattern) {
          rules.push(
            `{ pattern: ${eval(item.pattern)}, message: '${item.message}', trigger: '${
              ruleTrigger[config.tag]
            }' }`
          );
        }
      });
    }
    ruleList.push(`${scheme.__vModel__}: [${rules.join(",")}],`);
  }
}

/**
 * 获取动态数据函数
 * @param scheme
 * @param methodList
 */
function buildEventMethods(scheme: ComponentItemJson, methodList: string[]) {
  // todo 按钮click form 内的按钮提交触发校验
  switch (scheme.type) {
    case "pagination":
      const table = confGlobal && confGlobal.fields[scheme.index - 1];
      if (table) {
        const { model, method } = getOptionsModelKeyAndMethod(table);
        if (table.__config__.pagination === "remote") {
          methodList.push(`function handleChange${scheme.__vModel__}(currentPage, pageSize) {
            ${method}({
                currentPage,
                pageSize
            })
          }`);
        } else if (table.__config__.pagination === "local") {
          methodList.push(`function handleChange${scheme.__vModel__}(currentPage, pageSize) {
            ${scheme.__vModel__}currentPage.value = currentPage
            ${scheme.__vModel__}PageSize.value = pageSize
          }`);
          methodList.push(`
          const ${table.__vModel__} = computed(() => {
            return ${model}.slice(${scheme.__vModel__}PageSize.value * (${scheme.__vModel__}currentPage.value - 1), ${scheme.__vModel__}PageSize.value * ${scheme.__vModel__}currentPage.value)
          })
        `);
        }
      }
      break;
    case "dialog":
      methodList.push(`function onCancel${scheme.__vModel__}() {
        ${scheme.__vModel__}.value = false
      }`);
      methodList.push(`function onOk${scheme.__vModel__}() {
        //
        ${scheme.__vModel__}.value = false
      }`);
      break;
  }
}

/**
 * 组装js
 * @param {Object} formConfig 整个表单配置
 * @param {String} type 生成类型，文件或弹窗等
 */
export function makeUpJs(formConfig: FormConf, type: string, html: string) {
  confGlobal = formConfig = deepClone(formConfig);
  const formDataList: string[] = [];
  const dataList: string[] = [];
  const ruleList: string[] = [];
  const methodList: string[] = [];
  const mounted: string[] = [];
  const usedComponents: string[] = [
    "FForm",
    "FFormItem",
    "FCheckboxGroup",
    "FInput",
    "FSelect",
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
  ].filter((item) => html.indexOf(item) > -1);

  formConfig.fields.forEach((item, index) => {
    item.index = index;
    buildData(item, dataList, formDataList);
    buildRules(item, ruleList);
    buildOptions(item, methodList, dataList, mounted); // 例如select options
    buildEventMethods(item, methodList);
    if (item.__config__.children) {
      item.__config__.children.forEach((it: ComponentItemJson, idx: number) => {
        it.index = index + "_" + idx;
        buildData(it, dataList, formDataList);
        buildRules(it, ruleList);
        buildOptions(it, methodList, dataList, mounted); // 例如select options
        buildEventMethods(it, methodList);
      });
    }
  });
  let formRulesStr = "";
  if (ruleList.length) {
    formRulesStr = `const ${formConfig.formRules} = reactive({${ruleList.join("\n")}})`;
  }
  let formDataListStr = "";
  if (formDataList.length) {
    formDataListStr = `const ${formConfig.formModel} = reactive({
        ${formDataList}     
    })`;
  }
  if (type === "dialog") {
    dataList.push(`const showModal = ref(false)`);
  }
  confGlobal = null;

  // codesandbox 打包fesdesign 时less loader 有bug 
  return `<script lang="ts" setup>
    import { ref, reactive, computed, onMounted } from 'vue'
    import {${usedComponents.join(",")}} from './lib/fes-design.js'
    ${formDataListStr}
    ${formRulesStr}
    ${dataList.join("\n")}
    ${methodList.join("\n")}
    onMounted(() => {
        ${mounted.join("\n")}
    })
    </script>`;
}
