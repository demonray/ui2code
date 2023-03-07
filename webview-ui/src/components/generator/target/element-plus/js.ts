import { deepClone } from "../../../../utilities/index";

let confGlobal: FormConf | null = null;

// 构建data
function buildData(scheme: ComponentItemJson, dataList: string[]) {
  const config = scheme.__config__;
  if (scheme.__vModel__ === undefined) return;
  const defaultValue = JSON.stringify(config.defaultValue);
  dataList.push(`${scheme.__vModel__}: ${defaultValue}`);
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
  const dataList: any[] = [];
  const ruleList: any[] = [];
  const optionsList: any[] = [];

  formConfig.fields.forEach((item) => {
    buildData(item, dataList);
    buildOptions(item, optionsList);
  });

  confGlobal = null;
  return `<script lang="ts" setup>
    import { reactive } from 'vue'
    
    // do not use same name with ref
    const ${formConfig.formModel} = reactive({
        ${dataList}     
    })
    ${optionsList.join('\n')}
    const ${formConfig.formRules} = reactive(${JSON.stringify(ruleList)})
    </script>`;
}
