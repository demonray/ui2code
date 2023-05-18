import { deepClone, titleCase } from "../../../../utilities/index";
import ruleTrigger from "./ruleTrigger";

let confGlobal: FormConf | null = null;

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
  } else if (scheme.type === "dialog") {
    dataList.push(`
        const ${scheme.__vModel__} = ref(10)
    `);
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
              method: '${config.method}',
              url: '${config.url}',
              params
            }).then(resp => {
                // ${model}.length = 0
                // ${model}.push(...data)
                // todo total
            })
          }`;
  methodList.push(str);
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
  switch (scheme.type) {
    case "pagination":
      const table = confGlobal && confGlobal.fields[scheme.index - 1];
      if (table) {
        const { model, method } = getModelKeyAndMethod(table);
        if (table.__config__.pagination === "remote") {
          methodList.push(`watch([() => ${scheme.__vModel__}currentPage, () => ${scheme.__vModel__}PageSize], (v) => {
            console.log(v)
              ${method}({
                  currentPage: v[0],
                  pageSize: v[1]
              })
            })`);
        } else if (table.__config__.pagination === "local") {
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
 */
export function makeUpJs(formConfig: FormConf) {
  confGlobal = formConfig = deepClone(formConfig);
  const formDataList: string[] = [];
  const dataList: string[] = [];
  const ruleList: string[] = [];
  const methodList: string[] = [];
  const mounted: string[] = [];

  formConfig.fields.forEach((item, index) => {
    item.index = index;
    buildData(item, dataList, formDataList);
    buildRules(item, ruleList);
    buildOptions(item, methodList, dataList, mounted); // 例如select options
    buildEventMethods(item, methodList);
    if (item.__config__.children) {
      item.__config__.children.forEach((it, idx) => {
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
  confGlobal = null;
  return `<script lang="ts" setup>
    import { ref, reactive, onMounted, computed, watch} from 'vue'
    ${formDataListStr}
    ${formRulesStr}
    ${dataList.join("\n")}
    ${methodList.join("\n")}
    onMounted(() => {
        ${mounted.join("\n")}
    })
    </script>`;
}
