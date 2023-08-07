import useDetectService from "./hooks/useDetectService";
import useMergeDetectData from "./hooks/useMergeDetectData";

const { status, detectUI, detectText, detectStructure, getResult } = useDetectService();

export default async function detect(
  uploadFile: File
): Promise<{ fields: ComponentItemJson[]; metaInfo: { [index: string]: any } }> {
  await Promise.all([detectUI(uploadFile), detectText(uploadFile)]);
  return new Promise(function (resolve) {
    let count = 1;
    const checkResult = () => {
      if (count++ > 15) {
        resolve({ fields: [], metaInfo: {} });
        return;
      }
      const { uiResults, textResults, structures } = getResult();
      if (
        status.component === "FINISH" &&
        status.text === "SUCCESS" &&
        status.structure === "SUCCESS"
      ) {
        const { fields, metaInfo } = useMergeDetectData(uiResults, textResults);
        resolve({ fields, metaInfo });
      } else {
        setTimeout(checkResult, 1000);
      }
    };
    checkResult();
  });
}
