const FormData = require('form-data');
import Axios from "axios";

type UiType =
  | "input"
  | "textarea"
  | "radio"
  | "checkbox"
  | "button"
  | "switch"
  | "select"
  | "timepicker"
  | "datepicker"
  | "timerange"
  | "daterange"
  | "table"
  | "pagination"
  | "dialog"
  | "row"
  | "menu"
  | "tabs"
  | "steps"
  | "default"
  | "progress";

interface DetectItem {
  x: number;
  y: number;
  w: number;
  h: number;
  prob: number;
  class: UiType;
  [propName: string]: any;
}

type TextRegion = [[number, number], [number, number], [number, number], [number, number]];

interface TextItem {
  confidence: number;
  text: string;
  text_region: TextRegion;
  x?: number;
  y?: number;
}

type structureTable = {
  cell_bbox: Array<Array<number>>;
  html: string;
};

type XYXY = [number, number, number, number];

interface StructureItem {
  type: string;
  res: structureTable;
  bbox: XYXY;
  [key: string]: any;
}

type DetectStatus = {
  text: "PROCESSING" | "SUCCESS";
  component: "PROCESSING" | "PENDING" | "SUCCESS" | "FINISH";
  structure: "PROCESSING" | "SUCCESS";
};

type DetectService = {
  detectUI: (file: File) => Promise<any>;
  detectText: (file: string) => Promise<any>;
  getResult: () => {
    uiResults: DetectItem[];
    textResults: TextItem[];
    structures: StructureItem[];
    imageRes: any;
  };
  detectStructure: (file: File) => Promise<any>;
  status: DetectStatus;
};

function useDetectService(config: { [k: string]: any }): DetectService {
  const detectStatus: DetectStatus = {
    component: "PROCESSING",
    text: "PROCESSING",
    structure: "PROCESSING",
  };

  if (!config.OCR || !config.UI_DETECT) {
    console.error("配置错误");
  }
  let uiResults: DetectItem[] = [];

  let textResults: TextItem[] = [];

  let structures: StructureItem[] = [];
  let imageRes: any = {};
  /**
   * 获取文本检查结果
   */
  async function getTextDetectData(file: any) {
    textResults = [];
    detectStatus.text = "PROCESSING";
    let data = new FormData();
    if (file) {
      data.append("file", file.file, file.fileName);
    }
    return Axios({
      url: `${config.OCR}/predict-by-file`,
      method: "post",
      data,
      headers: {
        "Content-Type": "multipart/form-data",
        "Origin": "https://mumblefe.cn/"
      },
    })
      .then((res: { data: { data: TextItem[]; resultImg: any } }) => {
        if (res.data) {
          textResults = res.data.data;
          imageRes.text = res.data;
        }

        detectStatus.text = "SUCCESS";
      })
      .catch((error: any) => {
        // 请求失败，
        console.log(error);
      });
  }

  /**
   * 表格识别
   */
  async function getStructureData(file: any) {
    structures = [];
    detectStatus.text = "PROCESSING";
    let data = new FormData();
    if (file) {
      data.append("file", file.file, file.fileName);
    }
    return Axios({
      url: `${config.OCR}/predict-structure`,
      method: "post",
      data,
      headers: {
        "Content-Type": "multipart/form-data",
        "Origin": "https://mumblefe.cn/"
      },
    })
      .then((res: { data: { data: StructureItem[] } }) => {
        structures = res.data.data;
        detectStatus.structure = "SUCCESS";
      })
      .catch((error: any) => {
        // 请求失败，
        console.log(error);
      });
  }

  /**
   * 提交图片提交UI模型检查
   */
  function processUIDetect(file: any) {
    uiResults = [];
    let formData = new FormData();
    if (file) {
      formData.append("files", file.file, file.fileName);
    }
    return Axios({
      url: `${config.UI_DETECT}/process`,
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        "Origin": "https://mumblefe.cn/"
      },
    }).then((res: { data: { task_id: string; status: DetectStatus["component"] }[] }) => {
      if (res.data && res.data[0]) {
        // status: "PROCESSING"
        // task_id: "e1458014-a457-47d5-986c-30f4ca4ee2ba"
        // url_result: "/api/result/e1458014-a457-47d5-986c-30f4ca4ee2ba"
        detectStatus.component = res.data[0].status;
        checkDetectStatus(res.data[0].task_id);
      }
    }).catch(err => {
        console.log(err)
    });
  }

  /**
   * 轮训状态
   * @param taskid
   */
  function checkDetectStatus(taskid: string) {
    Axios({
      url: `${config.UI_DETECT}/status/${taskid}`,
      method: "get",
      headers: {
        "Origin": "https://mumblefe.cn/"
      },
    })
      .then((res: { data: { status: DetectStatus["component"] } }) => {
        detectStatus.component = res.data.status;
        if (res.data && res.data.status === "PENDING") {
          setTimeout(() => {
            checkDetectStatus(taskid);
          }, 1000);
        } else if (res.data && res.data.status === "SUCCESS") {
          getUIDetectResult(taskid);
        }
      })
      .catch((error: any) => {
        // 请求失败，
        console.log(error);
      });
  }

  /**
   * 获取检测结果数据
   * @param taskid
   */
  function getUIDetectResult(taskid: string) {
    Axios({
      url: `${config.UI_DETECT}/result/${taskid}`,
      method: "get",
      headers: {
        "Origin": "https://mumblefe.cn/"
      },
    })
      .then((res: { data: { status: string; result: { resultImg: any; bbox: DetectItem[] } } }) => {
        // {
        //    data: {
        //     result: {
        //         bbox: [],
        //         file_name: 'static/95a135ee.jpg'
        //     },
        //     status: 'SUCCESS',
        //     task_id: ''
        //    }
        // }
        if (res.data && res.data.status === "SUCCESS") {
          if (res.data.result) {
            imageRes.ui = res.data.result;
            uiResults = res.data.result.bbox;
          }

          detectStatus.component = "FINISH";
        }
      })
      .catch((error: any) => {
        // 请求失败，
        console.log(error);
      });
  }

  return {
    status: detectStatus,
    getResult: () => {
      return { textResults, uiResults, structures, imageRes };
    },
    detectUI: processUIDetect,
    detectText: getTextDetectData,
    detectStructure: getStructureData,
  };
}

export default async function (uploadFile: any, config: any) {
  console.log('==')
  const detect = useDetectService(config);
  const { status, getResult, detectUI, detectText, detectStructure } = detect;
  await Promise.all([detectUI(uploadFile), detectText(uploadFile)]);
  return new Promise(function (resolve) {
    let count = 1;
    const checkResult = () => {
      if (count++ > 15) {
        resolve({ uiResults: [], textResults: [] });
        return;
      }
      const { uiResults, textResults, imageRes } = getResult();
      if (status.component === "FINISH" && status.text === "SUCCESS") {
        resolve({ uiResults, textResults });
      } else {
        setTimeout(checkResult, 1000);
      }
    };
    checkResult();
  });
}
