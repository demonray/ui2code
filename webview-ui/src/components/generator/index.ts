import generateElementPlusUI from "./target/element-plus";
import generateFesDesign from "./target/fes-design";

export type LibType = "element-plus" | "fes-design";

type LibInterface = {
  // 生成目标组件库代码
  generateCode: (data: FormConf, type: string) => string;
  // 生成sanbbox预览文件
  getSandboxTpl: (tpl: string, preview: boolean) => string | SandboxTemplateConfig;
};

const map: {
  [propName in LibType]: LibInterface;
} = {
  "element-plus": generateElementPlusUI,
  "fes-design": generateFesDesign
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
export function generatePreview(lib: LibType, code: string, preview: boolean): string | SandboxTemplateConfig {
  if (map[lib]) {
    return map[lib].getSandboxTpl(code, preview);
  }
  return "";
}
