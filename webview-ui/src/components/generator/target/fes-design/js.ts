import { deepClone, titleCase } from "../../../../utilities/index";

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
    const ${scheme.__vModel__}Total = ref(100)
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
  } else if (config.dynamic) {
    const str = `const ${scheme.__vModel__} = reactive(
        ${JSON.stringify(scheme.data)}
      )`;
    dataList.push(str);
  } else {
    const defaultValue = JSON.stringify(config.defaultValue);
    formDataList.push(`${scheme.__vModel__}: ${defaultValue}`);
  }
}

function getModelKeyAndMethod(scheme: ComponentItemJson) {
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
  const { model, method } = getModelKeyAndMethod(scheme);
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

/**
 * 获取动态数据函数
 * @param scheme 
 * @param methodList 
 */
function buildEventMethods(scheme: ComponentItemJson, methodList: string[]) {
  switch (scheme.type) {
    case "pagination":
      const table = confGlobal.fields[scheme.index - 1];
      if (table) {
        const { model, method } = getModelKeyAndMethod(table);
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
  }
}

/**
 * 组装js
 * @param {Object} formConfig 整个表单配置
 * @param {String} type 生成类型，文件或弹窗等
 */
export function makeUpJs(formConfig: FormConf, type: string) {
  confGlobal = formConfig = deepClone(formConfig);
  const formDataList: string[] = [];
  const dataList: string[] = [];
  const ruleList: string[] = [];
  const methodList: string[] = [];
  const mounted: string[] = [];

  formConfig.fields.forEach((item, index) => {
    item.index = index;
    buildData(item, dataList, formDataList);
    buildOptions(item, methodList, dataList, mounted); // 例如select options
    buildEventMethods(item, methodList);
  });
  let formRulesStr = "";
  if (ruleList.length) {
    formRulesStr = `const ${formConfig.formRules} = reactive(${JSON.stringify(ruleList)})`;
  }
  let formDataListStr = "";
  if (formDataList.length) {
    formDataListStr = `const ${formConfig.formModel} = reactive({
        ${formDataList}     
    })`;
  }
  confGlobal = null;
  return `<script lang="ts" setup>
    import { ref, reactive, computed, onMounted } from 'vue'
    import {FForm,FFormItem,FCheckboxGroup,FSelect,FButton,FRadioButton,FRadio,FOption,FRadioGroup,FSwitch,FTable,FTableColumn,FDatePicker,FTimePicker,FPagination} from './lib/fes-design.js'
    ${formDataListStr}
    ${formRulesStr}
    ${dataList.join("\n")}
    ${methodList.join("\n")}
    onMounted(() => {
        ${mounted.join("\n")}
    })
    </script>`;
}
