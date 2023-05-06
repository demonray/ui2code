import { deepClone } from "../../../../utilities/index";

let confGlobal: FormConf | null = null;

// 构建data
function buildData(scheme: ComponentItemJson, dataList: string[], formData: boolean) {
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
}

// 构建options
function buildOptions(scheme: ComponentItemJson, optionsList: string[]) {
  if (scheme.__vModel__ === undefined) return;
  let { options } = scheme;
  if (scheme.__config__.dataType === "dynamic") {
    options = [];
  }
  if (!options && scheme.__slot__ && scheme.__slot__.options) {
    options = scheme.__slot__.options;
  } else if(!options) {
    return
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
  const formDataList: any[] = [];
  const ruleList: any[] = [];
  const dataList: any[] = [];

  formConfig.fields.forEach((item) => {
    if (item.type === 'table') {
        buildData(item, dataList, false);
    } else {
        buildData(item, formDataList, true);
        buildOptions(item, dataList);
    }
  })

  confGlobal = null;
  return `<script lang="ts" setup>
    import { reactive } from 'vue'
    const ${formConfig.formModel} = reactive({
        ${formDataList}     
    })
    ${dataList.join('\n')}
    const ${formConfig.formRules} = reactive(${JSON.stringify(ruleList)})
    </script>`;
}
