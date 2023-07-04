import generateElementPlusUI from "./target/element-plus";
import generateFesDesign from "./target/fes-design";

export type LibType = "element-plus" | "fes-design";

export type SaveConfig = {
  preview: string;
  type: "file" | "dialog";
  targetlib: LibType;
};

type LibInterface = {
  // 生成目标组件库代码
  generateCode: (data: FormConf, type: string, metaInfo: any) => string;
  // 生成sanbbox预览文件
  getSandboxTpl: (code: string, local: boolean) => string | SandboxTemplateConfig;
  getPlaygoundUrl?: (code: string) => string;
};

const map: {
  [propName in LibType]: LibInterface;
} = {
  "element-plus": generateElementPlusUI,
  "fes-design": generateFesDesign,
};

/**
 * 根据当前数据生成目标组件库代码
 * @param data
 * @param type
 * @param lib
 * @returns
 */
export function generateCode(data: FormConf, type: string, lib: LibType, metaInfo: any): string {
  if (map[lib]) {
    return map[lib].generateCode(data, type, metaInfo);
  }
  return "";
}

/**
 * 生成sandbox预览文件
 * @param type
 * @param lib
 * @param local 是否私有化部署sandbox
 * @returns
 */
export function generatePreview(
  lib: LibType,
  code: string,
  local: boolean
): string | SandboxTemplateConfig {
  if (map[lib]) {
    return map[lib].getSandboxTpl(code, local);
  }
  return "";
}

export function getPreviewPlaygoundUrl(lib: LibType, code: string): string {
  const libItem = map[lib];
  if (libItem.getPlaygoundUrl) {
    return libItem.getPlaygoundUrl(code);
  }
  return "";
}
