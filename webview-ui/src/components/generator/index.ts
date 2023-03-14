import generateElementUI from "./target/element-ui";
import generateElementPlusUI from "./target/element-plus";

export type LibType = "element-ui" | "element-plus";

type LibInterface = {
  // 生成目标组件库代码
  generateCode: (data: FormConf, type: string) => string;
  // 生成sanbbox预览文件
  getSandboxTpl: (tpl: string, preview: boolean) => string | object;
};

const map: {
  [propName in LibType]: LibInterface;
} = {
  "element-ui": generateElementUI,
  "element-plus": generateElementPlusUI,
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
 * @param preview 是否私有化部署sandbox
 * @returns
 */
export function generatePreview(lib: LibType, code: string, preview: boolean): string | object {
  if (map[lib]) {
    return map[lib].getSandboxTpl(code, preview);
  }
  return "";
}
