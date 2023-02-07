import generateElementUI from "./target/element-ui";

export type LibType = "element-ui";

type LibInterface = {
  // 生成目标组件库代码
  generateCode: (data: FormConf, type: string) => string;
  // 生成sanbbox预览文件
  getSandboxTpl: (tpl: string) => string;
};

type GenerateLibMap = {
  [propName in LibType]: LibInterface;
};

const map: GenerateLibMap = {
  "element-ui": generateElementUI,
};

/**
 * 根据当前数据生成目标组件库代码
 * @param data
 * @param type
 * @param lib
 * @returns
 */
export function generateCode(data: FormConf, type: string, lib: LibType): string {
  if (map[lib]) {
    return map[lib].generateCode(data, type);
  }
  return "";
}

/**
 * 生成sandbox预览文件
 * @param type
 * @param lib
 * @returns
 */
export function generatePreview(lib: LibType, code: string): string {
  if (map[lib]) {
    return map[lib].getSandboxTpl(code);
  }
  return "";
}
