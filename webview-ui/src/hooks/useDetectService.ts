import { reactive, watch } from "vue";
import type { UploadFile } from "element-plus";
import { getBase64 } from "../utilities/index";
import Axios from "../utilities/request";
import DetectConfig from "../config";

type DetectStatus = {
  text: "PROCESSING" | "SUCCESS";
  component: "PROCESSING" | "PENDING" | "SUCCESS" | "FINISH";
  structure: "PROCESSING" | "SUCCESS";
  msg: string;
};

type DetectService = {
  detectUI: (file: UploadFile) => void;
  detectText: (file: UploadFile) => void;
  getResult: () => {
    uiResults: DetectItem[];
    textResults: TextItem[];
    structures: StructureItem[]
  };
  detectStructure: (file: UploadFile) => void;
  status: DetectStatus
};

export default function useDetectService(): DetectService {
  const detectStatus: DetectStatus = reactive({
    component: "PROCESSING",
    text: "PROCESSING",
    structure: "PROCESSING",
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

  let structures: StructureItem[] = [{"type":"table","bbox":[0,0,1326,740],"res":{"cell_bbox":[[185.55055236816406,43.0648078918457,307.78790283203125,51.07573318481445,287.9521484375,78.95995330810547,165.904541015625,68.81842041015625],[606.2998046875,64.65746307373047,366.63751220703125,72.13361358642578,307.7749328613281,61.15046310424805,523.2098388671875,53.93317413330078],[870.8186645507812,60.14937210083008,675.6942749023438,65.77749633789062,599.2601318359375,68.79197692871094,792.5513916015625,62.49681854248047],[1128.0042724609375,58.34479904174805,1032.0770263671875,63.75145721435547,969.1015625,74.00433349609375,1071.688232421875,67.83892822265625],[295.02935791015625,200.51441955566406,216.89524841308594,223.71182250976562,180.2811737060547,215.24484252929688,244.97024536132812,192.517822265625],[624.277099609375,232.55772399902344,409.0141296386719,257.54718017578125,343.25054931640625,186.85780334472656,535.225830078125,167.09689331054688],[969.0553588867188,230.4658203125,782.5425415039062,256.1288757324219,699.86474609375,213.8118438720703,889.8897705078125,192.9844207763672],[1161.87744140625,235.4203643798828,1024.8115234375,257.611328125,958.2631225585938,213.41253662109375,1113.8553466796875,194.79257202148438],[298.5976867675781,403.1964111328125,256.1956481933594,430.8294372558594,216.0618133544922,429.5002746582031,251.21888732910156,402.7080078125],[776.329345703125,412.4643859863281,483.14093017578125,438.5457458496094,402.53216552734375,400.92095947265625,676.96923828125,375.540771484375],[1041.0472412109375,435.1838684082031,895.6309814453125,460.027587890625,823.8932495117188,391.2075500488281,976.3172607421875,367.6131591796875],[1182.202392578125,410.9286193847656,1063.899658203125,432.2633056640625,1002.6859130859375,401.0704650878906,1138.76220703125,381.3784484863281],[386.84716796875,625.748046875,217.3773956298828,643.5597534179688,189.85003662109375,623.7069702148438,341.0329284667969,604.1636352539062],[966.0667114257812,631.4271850585938,641.7783203125,647.5657348632812,554.9913330078125,616.2576904296875,885.541748046875,598.3418579101562],[1092.8974609375,657.5278930664062,934.5951538085938,668.805419921875,876.9769897460938,605.6126098632812,1044.2015380859375,589.3925170898438],[1212.6260986328125,656.1166381835938,1094.490478515625,666.6829223632812,1051.7115478515625,615.7734985351562,1185.534423828125,601.8482055664062]],"html":"<html><body><table><tr><td>日期</td><td>姓名</td><td>地址</td><td>操作</td></tr><tr><td>2016-05-01</td><td>上海市普陀区 王小虎 弄</td><td>金沙江路1516</td><td>编辑 删除</td></tr><tr><td>2016-05-02</td><td>上海市普陀区 王小虎 金沙江路1516 弄</td><td>编辑</td><td>删除</td></tr><tr><td>2016-05-03 王小虎</td><td>上海市普陀区 金沙江路1516 弄</td><td>编辑</td><td>删除</td></tr></table></body></html>"},"img_idx":0}] ;

  /**
   * 获取文本检查结果
   */
  async function getTextDetectData(uploadFile: UploadFile) {
    textResults = [];
    detectStatus.text = "PROCESSING";
    const images = await getBase64(uploadFile.raw as Blob);
    Axios({
      url: `${DetectConfig.OCR}predict-by-base64`,
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
  async function getStructureData(uploadFile: UploadFile) {
    structures = [];
    detectStatus.text = "PROCESSING";
    let data = new FormData();
    if (uploadFile.raw) {
      data.append("file", uploadFile.raw);
    }
    Axios({
      url: `${DetectConfig.OCR}predict-structure`,
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
  function processUIDetect(uploadFile: UploadFile) {
    uiResults = [];
    let formData = new FormData();
    if (uploadFile.raw) {
      formData.append("files", uploadFile.raw!);
    }
    Axios({
      url: DetectConfig.UI_DETECT_URL,
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
      url: DetectConfig.UI_DETECT_STATUS + taskid,
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
      url: DetectConfig.UI_DETECT_RESULT + taskid,
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

  watch([() => detectStatus.component, () => detectStatus.text, () => detectStatus.structure], (v) => {
    if (v[0] === "FINISH" && v[1] === "SUCCESS" && v[2] === "SUCCESS") {
      detectStatus.msg = "";
    } else {
      detectStatus.msg = "模型识别中...";
    }
  });

  return {
    status: detectStatus,
    getResult: () => {
      return { textResults, uiResults, structures };
    },
    detectUI: processUIDetect,
    detectText: getTextDetectData,
    detectStructure: getStructureData
  };
}
