import { reactive, watch } from "vue";
import type { UploadFile } from "element-plus";
import { getBase64 } from "../utilities/index";
import Axios from "../utilities/request";
import DetectService from "../config/modelService";

type DetectStatus = {
  text: "PROCESSING" | "PENDING" | "SUCCESS";
  component: "PROCESSING" | "PENDING" | "SUCCESS" | "FINISH";
  msg: string;
};

type DetectService = {
  detectUI: (file: UploadFile) => void;
  detectText: (file: UploadFile) => void;
  getResult: () => {
    uiResults: DetectItem[];
    textResults: TextItem[];
  };
  status: DetectStatus;
};

export default function useDetectService(): DetectService {
  const detectStatus: DetectStatus = reactive({
    component: "PROCESSING",
    text: "PROCESSING",
    msg: "",
  });

  let uiResults: DetectItem[] = [
    {
      x: 227.26868,
      y: 282.0313,
      w: 126.47966,
      h: 69.251785,
      prob: 0.83942795,
      class: "button",
    },
    {
      x: 720.71326,
      y: 281.76306,
      w: 128.93451,
      h: 68.31349,
      prob: 0.8297539,
      class: "button",
    },
    {
      x: 204.12418,
      y: 628.3985,
      w: 75.278275,
      h: 47.082397,
      prob: 0.81199855,
      class: "switch",
    },
    {
      x: 331.99463,
      y: 504.80762,
      w: 35.679657,
      h: 38.046417,
      prob: 0.7667269,
      class: "checkbox",
    },
    {
      x: 184.19519,
      y: 504.84927,
      w: 39.31729,
      h: 36.75006,
      prob: 0.74878865,
      class: "checkbox",
    },
    {
      x: 558.47614,
      y: 391.0879,
      w: 765.92017,
      h: 70.0264,
      prob: 0.5698105,
      class: "select",
    },
    {
      x: 558.47394,
      y: 167.0047,
      w: 761.61896,
      h: 70.095215,
      prob: 0.55842805,
      class: "select",
    },
    {
      x: 183.71057,
      y: 56.114388,
      w: 39.39354,
      h: 44.376083,
      prob: 0.5047664,
      class: "radio",
    },
    {
      x: 285.49518,
      y: 54.839325,
      w: 39.003296,
      h: 45.75209,
      prob: 0.43677723,
      class: "radio",
    },
  ];

  let textResults: TextItem[] = [
    {
      confidence: 0.9801278114318848,
      text: "*单选框组",
      text_region: [
        [55, 46],
        [158, 43],
        [158, 64],
        [55, 66],
      ],
    },
    {
      confidence: 0.9996135830879211,
      text: "男",
      text_region: [
        [208, 46],
        [231, 46],
        [231, 67],
        [208, 67],
      ],
    },
    {
      confidence: 0.7817301750183105,
      text: "?女",
      text_region: [
        [274, 45],
        [331, 45],
        [331, 68],
        [274, 68],
      ],
    },
    {
      confidence: 0.9579564929008484,
      text: "*密码",
      text_region: [
        [99, 155],
        [156, 158],
        [155, 181],
        [98, 178],
      ],
    },
    {
      confidence: 0.997824490070343,
      text: "请输入密码",
      text_region: [
        [198, 158],
        [303, 158],
        [303, 178],
        [198, 178],
      ],
    },
    {
      confidence: 0.9589386582374573,
      text: "Q搜索",
      text_region: [
        [196, 269],
        [261, 269],
        [261, 291],
        [196, 291],
      ],
    },
    {
      confidence: 0.7299702763557434,
      text: "画删除",
      text_region: [
        [691, 271],
        [753, 271],
        [753, 293],
        [691, 293],
      ],
    },
    {
      confidence: 0.9690972566604614,
      text: "*下拉选择",
      text_region: [
        [59, 385],
        [155, 385],
        [155, 402],
        [59, 402],
      ],
    },
    {
      confidence: 0.9876394867897034,
      text: "选项一",
      text_region: [
        [196, 384],
        [259, 384],
        [259, 404],
        [196, 404],
      ],
    },
    {
      confidence: 0.968501091003418,
      text: "*多选框组",
      text_region: [
        [57, 496],
        [157, 496],
        [157, 514],
        [57, 514],
      ],
    },
    {
      confidence: 0.9248738884925842,
      text: "Iphone",
      text_region: [
        [208, 497],
        [277, 497],
        [277, 515],
        [208, 515],
      ],
    },
    {
      confidence: 0.9797406196594238,
      text: "MacBook",
      text_region: [
        [356, 498],
        [445, 498],
        [445, 513],
        [356, 513],
      ],
    },
    {
      confidence: 0.951630175113678,
      text: "*开关",
      text_region: [
        [100, 617],
        [156, 617],
        [156, 638],
        [100, 638],
      ],
    },
  ];

  /**
   * 获取文本检查结果
   */
  async function getTextDetectData(uploadFile: UploadFile) {
    textResults = [];
    detectStatus.text = "PROCESSING";
    const images = await getBase64(uploadFile.raw as Blob);
    Axios({
      url: DetectService.OCR,
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
   * 提交图片提交UI模型检查
   */
  function processUIDetect(uploadFile: UploadFile) {
    uiResults = [];
    let formData = new FormData();
    if (uploadFile.raw) {
      formData.append("files", uploadFile.raw!);
    }
    Axios({
      url: DetectService.UI_DETECT_URL,
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
      url: DetectService.UI_DETECT_STATUS + taskid,
      method: "get",
    })
      .then((res) => {
        // result: ""
        // status: "PENDING"
        // task_id: "7bfd83e5-17e2-4650-8476-7e573b4b2b03"
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
      url: DetectService.UI_DETECT_RESULT + taskid,
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

  watch([() => detectStatus.component, () => detectStatus.text], (v) => {
    if (v[0] === "FINISH" && v[1] === "SUCCESS") {
      detectStatus.msg = "";
    }
    const loading =
      ["PROCESSING", "PENDING"].indexOf(v[0]) > -1 || ["PROCESSING", "PENDING"].indexOf(v[1]) > -1;
    if (loading) {
      detectStatus.msg = "模型识别中...";
    }
  });

  return {
    status: detectStatus,
    getResult: () => {
      return { textResults, uiResults };
    },
    detectUI: processUIDetect,
    detectText: getTextDetectData,
  };
}
