import type { DetectResultData } from "./hooks/useDetectService";
import useDetectService from "./hooks/useDetectService";
import useMergeDetectData from "./hooks/useMergeDetectData";
import { deepClone, getBase64 } from "./utilities";

type CONF = {
  UI_DETECT: string;
  OCR: string;
  [k: string]: any;
};

let detectImg: string | null = null;

type MetaInfo = {
  detectImg?: string | null;
  imageRes?: DetectResultData;
  [index: string]: any;
};

/**
 * 上传图片使用到的组件类型及识别文本，合成用于渲染的组件列表schema数据
 * @param uploadFile
 * @param config 配置服务请求路径
 * @returns
 */
export async function detect(
  uploadFile: File,
  config?: CONF | null
): Promise<{ fields: ComponentItemJson[]; metaInfo: MetaInfo }> {
  detectImg = await getBase64(uploadFile);
  const detect = config ? useDetectService(config) : useDetectService();
  const { status, getResult, detectUI, detectText, detectStructure } = detect;
  await Promise.all([detectUI(uploadFile), detectText(uploadFile, 'local')]);
  return new Promise(function (resolve) {
    let count = 1;
    const checkResult = () => {
      if (count++ > 15) {
        resolve({ fields: [], metaInfo: {} });
        return;
      }
      const { uiResults, textResults, imageRes } = getResult();
      if (status.component === "FINISH" && status.text === "SUCCESS") {
        const { fields } = useMergeDetectData(uiResults, textResults, []);
        resolve({
          fields,
          metaInfo: {
            imageRes,
            detectImg,
            uiResults: deepClone(uiResults),
            textResults: deepClone(textResults),
          },
        });
      } else {
        setTimeout(checkResult, 1000);
      }
    };
    checkResult();
  });
}

/**
 * 合成用于渲染的组件列表schema数据
 * @param uiResults
 * @param textResults
 * @returns
 */
export async function generateUIList(
  uiResults: DetectItem[],
  textResults: TextItem[]
): Promise<{ fields: ComponentItemJson[]; metaInfo: MetaInfo }> {
  return new Promise(function (resolve) {
    const { fields } = useMergeDetectData(uiResults, textResults, []);
    resolve({
      fields,
      metaInfo: {
        detectImg,
        uiResults: deepClone(uiResults),
        textResults: deepClone(textResults),
      },
    });
  });
}
