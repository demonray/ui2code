import { deepClone, titleCase } from "../../../../utilities/index";

let confGlobal: FormConf | null = null;

function buildFetchDataMethod(
  methodName: string,
  model: string,
  methodList: string[],
  scheme: { __config__: any }
) {
  const config = scheme.__config__;
  let str = "";
    str = `function ${methodName}() {
          // 注意：this.$axios是通过app.config.globalProperties.$axios = axios挂载产生的
          this.$axios({
            method: '${config.method}',
            url: '${config.url}'
          }).then(resp => {
            let { data } = resp
            // ${model} = data
          })
        }`;
  methodList.push(str);
}

// 构建data
function buildData(
  scheme: ComponentItemJson,
  dataList: string[],
  methodList: string[],
  mounted: string[],
  formData: boolean
) {
  const config = scheme.__config__;
  if (scheme.__vModel__ === undefined) return;
  if (formData) {
    const defaultValue = JSON.stringify(config.defaultValue);
    dataList.push(`${scheme.__vModel__}: ${defaultValue}`);
  } else {
    const str = `const ${scheme.__vModel__} = reactive(
        ${JSON.stringify(scheme.data)}
      )`;
    dataList.push(str);
  }
  if (config.dataType === "dynamic") {
    const model = `${scheme.__vModel__}Options`;
    const options = titleCase(model);
    const methodName = `get${options}`;
    buildFetchDataMethod(methodName, model, methodList, scheme);
    // mounted.push(`${methodName}()`);
  }
}

// 构建options
function buildOptions(scheme: ComponentItemJson, optionsList: string[]) {
  if (scheme.__vModel__ === undefined) return;
  let { options } = scheme;
  if (scheme.__config__.dataType === "dynamic") {
    options = [];
  } else if (!options && scheme.__slot__ && scheme.__slot__.options) {
    options = scheme.__slot__.options;
  } else if (!options) {
    return;
  }

  const str = `const ${scheme.__vModel__}Options = reactive(
    ${JSON.stringify(options)}
  )`;
  optionsList.push(str);
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

  formConfig.fields.forEach((item) => {
    if (item.type === "table") {
      buildData(item, dataList, methodList, mounted, false);
    } else {
      buildData(item, formDataList, methodList, mounted, true);
      buildOptions(item, dataList);
    }
  });

  confGlobal = null;
  return `<script lang="ts" setup>
    import { reactive, onMounted } from 'vue'
    import {FForm,FFormItem,FCheckboxGroup,FSelect,FButton,FRadioButton,FRadio,FOption,FRadioGroup,FSwitch,FTable,FTableColumn,FDatePicker,FTimePicker} from './lib/fes-design.js'
    const ${formConfig.formModel} = reactive({
        ${formDataList}     
    })
    ${methodList.join("\n")}
    onMounted(() => {
        ${mounted.join("\n")}
    })
    ${dataList.join("\n")}
    const ${formConfig.formRules} = reactive(${JSON.stringify(ruleList)})
    </script>`;
}
