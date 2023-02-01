import generateLibs from "./target/libs";
import type { LibType } from "./target/libs";
/**
 * 根据当前数据生成目标组件库代码
 * @param data 
 * @param type 
 * @param lib 
 * @returns 
 */
export default function generate(data: FormConf, type: string, lib: LibType): string {
  if (generateLibs[lib]) {
    return generateLibs[lib](data, type);
  }
  return "";
}
