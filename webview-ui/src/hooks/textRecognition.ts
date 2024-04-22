import * as ocr from "@paddle-js-models/ocr";

let ocrloaded = 0;
function loadModel(cb?: Function) {
  ocr.init().then(() => {
    ocrloaded = 1;
    if (cb) {
      cb();
    }
  });
}

async function recognize(img: HTMLImageElement) {
  return new Promise((resolve, reject) => {
    if (ocrloaded == 1) {
      ocr.recognize(img).then((res) => {
        const data: { text: string; text_region: any[] }[] = [];
        res.points.forEach((it: any, idx: number) => {
          data.push({
            text: res.text[idx],
            text_region: it,
          });
        });
        resolve({
          data,
        });
      });
    } else {
      reject("模型未加载");
    }
  });
}

export default {
  loadModel,
  recognize,
};
