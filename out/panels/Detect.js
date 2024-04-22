"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const FormData = require('form-data');
const axios_1 = require("axios");
function useDetectService(config) {
    const detectStatus = {
        component: "PROCESSING",
        text: "PROCESSING",
        structure: "PROCESSING",
    };
    if (!config.OCR || !config.UI_DETECT) {
        console.error("配置错误");
    }
    let uiResults = [];
    let textResults = [];
    let structures = [];
    let imageRes = {};
    /**
     * 获取文本检查结果
     */
    function getTextDetectData(file) {
        return __awaiter(this, void 0, void 0, function* () {
            textResults = [];
            detectStatus.text = "PROCESSING";
            let data = new FormData();
            if (file) {
                data.append("file", file.file, file.fileName);
            }
            return (0, axios_1.default)({
                url: `${config.OCR}/predict-by-file`,
                method: "post",
                data,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Origin": "https://mumblefe.cn/"
                },
            })
                .then((res) => {
                if (res.data) {
                    textResults = res.data.data;
                    imageRes.text = res.data;
                }
                detectStatus.text = "SUCCESS";
            })
                .catch((error) => {
                // 请求失败，
                console.log(error);
            });
        });
    }
    /**
     * 表格识别
     */
    function getStructureData(file) {
        return __awaiter(this, void 0, void 0, function* () {
            structures = [];
            detectStatus.text = "PROCESSING";
            let data = new FormData();
            if (file) {
                data.append("file", file.file, file.fileName);
            }
            return (0, axios_1.default)({
                url: `${config.OCR}/predict-structure`,
                method: "post",
                data,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Origin": "https://mumblefe.cn/"
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
        });
    }
    /**
     * 提交图片提交UI模型检查
     */
    function processUIDetect(file) {
        uiResults = [];
        let formData = new FormData();
        if (file) {
            formData.append("files", file.file, file.fileName);
        }
        return (0, axios_1.default)({
            url: `${config.UI_DETECT}/process`,
            method: "post",
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
                "Origin": "https://mumblefe.cn/"
            },
        }).then((res) => {
            if (res.data && res.data[0]) {
                // status: "PROCESSING"
                // task_id: "e1458014-a457-47d5-986c-30f4ca4ee2ba"
                // url_result: "/api/result/e1458014-a457-47d5-986c-30f4ca4ee2ba"
                detectStatus.component = res.data[0].status;
                checkDetectStatus(res.data[0].task_id);
            }
        }).catch(err => {
            console.log(err);
        });
    }
    /**
     * 轮训状态
     * @param taskid
     */
    function checkDetectStatus(taskid) {
        (0, axios_1.default)({
            url: `${config.UI_DETECT}/status/${taskid}`,
            method: "get",
            headers: {
                "Origin": "https://mumblefe.cn/"
            },
        })
            .then((res) => {
            detectStatus.component = res.data.status;
            if (res.data && res.data.status === "PENDING") {
                setTimeout(() => {
                    checkDetectStatus(taskid);
                }, 1000);
            }
            else if (res.data && res.data.status === "SUCCESS") {
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
    function getUIDetectResult(taskid) {
        (0, axios_1.default)({
            url: `${config.UI_DETECT}/result/${taskid}`,
            method: "get",
            headers: {
                "Origin": "https://mumblefe.cn/"
            },
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
                if (res.data.result) {
                    imageRes.ui = res.data.result;
                    uiResults = res.data.result.bbox;
                }
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
            return { textResults, uiResults, structures, imageRes };
        },
        detectUI: processUIDetect,
        detectText: getTextDetectData,
        detectStructure: getStructureData,
    };
}
function default_1(uploadFile, config) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('==');
        const detect = useDetectService(config);
        const { status, getResult, detectUI, detectText, detectStructure } = detect;
        yield Promise.all([detectUI(uploadFile), detectText(uploadFile)]);
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
                }
                else {
                    setTimeout(checkResult, 1000);
                }
            };
            checkResult();
        });
    });
}
exports.default = default_1;
//# sourceMappingURL=Detect.js.map