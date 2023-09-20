import { getBase64 } from "../utilities/index";
import Axios from "../utilities/request";
import DetectConfig from "../config";

type DetectStatus = {
  text: "PROCESSING" | "SUCCESS";
  component: "PROCESSING" | "PENDING" | "SUCCESS" | "FINISH";
  structure: "PROCESSING" | "SUCCESS";
};

type DetectService = {
  detectUI: (file: File) => Promise<any>;
  detectText: (file: File) => Promise<any>;
  getResult: () => {
    uiResults: DetectItem[];
    textResults: TextItem[];
    structures: StructureItem[];
  };
  detectStructure: (file: File) => Promise<any>;
  status: DetectStatus;
};

export default function useDetectService(
  config: { [k: string]: any } = DetectConfig
): DetectService {
  const detectStatus: DetectStatus = {
    component: "PROCESSING",
    text: "PROCESSING",
    structure: "PROCESSING",
  };

  if (!config.OCR || !config.UI_DETECT) {
    console.error('配置错误')
  }
  let uiResults: DetectItem[] = [];

  let textResults: TextItem[] = [];

  let structures: StructureItem[] = [];
  /**
   * 获取文本检查结果
   */
  async function getTextDetectData(file: File) {
    textResults = [];
    detectStatus.text = "PROCESSING";
    const images = await getBase64(file as Blob);
    return Axios({
      url: `${config.OCR}/predict-by-base64`,
      method: "post",
      data: {
        base64_str: images.replace(/data:image\/.+;base64,/, ""),
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        textResults = res.data.data;
        detectStatus.text = "SUCCESS";
      })
      .catch((error) => {
        // 请求失败，
        console.log(error);
      });
  }

  /**
   * 表格识别
   */
  async function getStructureData(file: File) {
    structures = [];
    detectStatus.text = "PROCESSING";
    let data = new FormData();
    if (file) {
      data.append("file", file);
    }
    return Axios({
      url: `${config.OCR}/predict-structure`,
      method: "post",
      data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        structures = res.data.data;
        detectStatus.structure = "SUCCESS";
      })
      .catch((error) => {
        // 请求失败，
        console.log(error);
      });
  }

  /**
   * 提交图片提交UI模型检查
   */
  function processUIDetect(file: File) {
    uiResults = [];
    let formData = new FormData();
    if (file) {
      formData.append("files", file);
    }
    return Axios({
      url: `${config.UI_DETECT}/process`,
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((res) => {
      if (res.data && res.data[0]) {
        // status: "PROCESSING"
        // task_id: "e1458014-a457-47d5-986c-30f4ca4ee2ba"
        // url_result: "/api/result/e1458014-a457-47d5-986c-30f4ca4ee2ba"
        detectStatus.component = res.data[0].status;
        checkDetectStatus(res.data[0].task_id);
      }
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
    })
      .then((res) => {
        detectStatus.component = res.data.status;
        if (res.data && res.data.status === "PENDING") {
          setTimeout(() => {
            checkDetectStatus(taskid);
          }, 1000);
        } else if (res.data && res.data.status === "SUCCESS") {
          getUIDetectResult(taskid);
        }
      })
      .catch((error) => {
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
    })
      .then((res) => {
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
          uiResults = res.data.result.bbox;
          detectStatus.component = "FINISH";
        }
      })
      .catch((error) => {
        // 请求失败，
        console.log(error);
      });
  }

  return {
    status: detectStatus,
    getResult: () => {
      return { textResults, uiResults, structures };
    },
    detectUI: processUIDetect,
    detectText: getTextDetectData,
    detectStructure: getStructureData,
  };
}
