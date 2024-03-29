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
    const ${scheme.__vModel__}Total = ref(20)
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
  switch (scheme.type) {
    case "pagination":
      const table = confGlobal && confGlobal.fields[scheme.index - 1];
      if (table) {
        const { model, method } = getOptionsModelKeyAndMethod(table);
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
 * 递归生成vModel
 */
function buildCommonInfo(childrenList: Array<ComponentItemJson>, preStr: string, buildInfo: {
  formDataList: string[],
  dataList: string[],
  ruleList: string[],
  methodList: string[],
  mounted: string[],
}) {
  childrenList.forEach((it: ComponentItemJson, idx: number) => {
    it.index = preStr + idx + '';
    buildData(it, buildInfo.dataList, buildInfo.formDataList);
    buildRules(it, buildInfo.ruleList);
    buildOptions(it, buildInfo.methodList, buildInfo.dataList, buildInfo.mounted); // 例如select options
    buildEventMethods(it, buildInfo.methodList);
    if (it.__config__.children && it.__config__.children.length) {
      buildCommonInfo(it.__config__.children, it.index, buildInfo)
    }
    if (it.__slot__?.options && it.__slot__?.options.length) {
      it.__slot__?.options.forEach((element: OptionItem, k: number) => {
        if (element.childrenComponet && element.childrenComponet.length) {
          buildCommonInfo(element.childrenComponet, it.index + k, buildInfo)
        }
      });
    }
  });
}
/**
 * 组装js
 * @param {Object} formConfig 整个表单配置
 * @param {String} type 生成类型，文件或弹窗等
 */
export function makeUpJs(formConfig: FormConf, type: string, data: MakeHtmlResult) {
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
      buildCommonInfo(item.__config__.children, String(index), {
        formDataList,
        dataList,
        ruleList,
        methodList,
        mounted,
      })
    }
    if (item.__slot__?.options && item.__slot__?.options.length) {
      item.__slot__?.options.forEach((element: OptionItem, k: number) => {
        if (element.childrenComponet && element.childrenComponet.length) {
          buildCommonInfo(element.childrenComponet, String(index)+k, {
            formDataList,
            dataList,
            ruleList,
            methodList,
            mounted,
          })
        }
      });
    }
  });
  let formRulesStr = "";
  if (ruleList) {
    formRulesStr = `const ${formConfig.formRules} = reactive({${ruleList.join("\n")}})`;
  }
  let formDataListStr = "";
  if (formDataList.length) {
    formDataListStr = `const ${formConfig.formModel} = reactive({
        ${formDataList}     
    })`;
  }
  // form ref
  if (data.info.usedComponents.includes("ElForm")) {
    dataList.push(`const ${formConfig.formRef} = ref(null)`);
  }
  if (type === "dialog") {
    dataList.push(`const showModal = ref(true)`);
    // 是否存在Form
    if (data.info.usedComponents.includes("ElForm")) {
      methodList.push(`function handelSubmit() {
              ${formConfig.formRef}.value
                  .validate()
                  .then((result) => {
                      console.log('表单验证成功~');
                      ${formConfig.formRef}.value.resetFields();
                  })
                  .catch((error) => {
                      console.log('表单验证失败: ', error);
                  });
  
          }`);
      methodList.push(`function handleCancel() {
              ${formConfig.formRef}.value.clearValidate();
          }`);
    } else {
      methodList.push(`function handelSubmit() {}`);
      methodList.push(`function handleCancel() {}`);
    }
  }
  // table action
  if (data.info.tableAction) {
    data.info.tableAction.forEach((item: string) => {
      dataList.push(`const ${item} = (index, row) => {
            console.log(index, row)
      }`);
    });
  }
  if (formConfig.formBtns && type === "file") {
    if (data.info.usedComponents.includes("ElForm")) {
      methodList.push(`function submitForm() {
          ${formConfig.formRef}.value
              .validate()
              .then((result) => {
                  console.log('表单验证成功~');
                  ${formConfig.formRef}.value.resetFields();
              })
              .catch((error) => {
                  console.log('表单验证失败: ', error);
              });
  
        }`);
      methodList.push(`function resetForm() {
          ${formConfig.formRef}.value.resetFields();
          ${formConfig.formRef}.value.clearValidate();
        }`);
    }
  }
  confGlobal = null;
  return `<script lang="ts" setup>
    import { ref, reactive, onMounted, computed, watch} from 'vue'
    import {${data.info.usedComponents.join(",")}} from 'element-plus'
    ${formDataListStr}
    ${formRulesStr}
    ${dataList.join("\n")}
    ${methodList.join("\n")}
    onMounted(() => {
        ${mounted.join("\n")}
    })
    </script>`;
}
