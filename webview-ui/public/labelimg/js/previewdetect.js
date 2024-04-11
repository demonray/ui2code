/**
 * UI识别结果数据转换成标注预览数据
 * @param {*} bbox
 * @returns
 */
function detectBoxToLabelBox(bbox) {
  return bbox.map((it) => {
    const labels = {
      labelName: it.class,
      labelColor: "#ff0000",
      labelColorRGB: "255,0,0",
      visibility: false,
    };
    const labelLocation = {
      x: it.x,
      y: it.y,
    };
    const rectMask = {
      xMin: it.x - it.w / 2,
      yMin: it.y - it.h / 2,
      width: it.w,
      height: it.h,
    };
    let content = [
      {
        x: it.x - it.w / 2,
        y: it.y - it.h / 2,
      },
      {
        x: it.x + it.w / 2,
        y: it.y - it.h / 2,
      },
      {
        x: it.x + it.w / 2,
        y: it.y + it.h / 2,
      },
      {
        x: it.x - it.w / 2,
        y: it.y + it.h / 2,
      },
    ];
    return {
      content,
      rectMask,
      labels,
      labelLocation,
      contentType: "rect",
    };
  });
}

/**
 * 预览标注数据转换成UI识别结果数据
 * @param {*} annotates
 */
function labelBoxToDetectBox(annotates) {
  return annotates.map((it) => {
    return {
      x: it.labelLocation.x,
      y: it.labelLocation.y,
      w: it.rectMask.width,
      h: it.rectMask.height,
      prob: 1,
      class: it.labels.labelName,
    };
  });
}

// 初始化标签

var labels = [
  "input",
  "select",
  "textarea",
  "button",
  "switch",
  "datepicker",
  "timepicker",
  "timerange",
  "daterange",
  "radio",
  "checkbox",
  "steps",
  "pagination",
  "progress",
  "table",
  "tab",
  "menu",
  "tree",
  "tooltip",
  "calendar",
  "alert",
  "breadcrumb",
  "timeline",
  "rate",
  "badge",
];

labels = labels.map((it) => {
  return {
    labelColor: "#ff0000",
    labelColorB: "0",
    labelColorG: "0",
    labelColorR: "255",
    labelName: it,
  };
});

localStorage.setItem("labels", JSON.stringify(labels))

/**
 * 初始化识别结果数据
 */
function initDetectData(data) {
  var annotates = detectBoxToLabelBox(data.bbox);
  annotate.SetImage(data.resultImg, annotates);
}

var confirm = document.querySelector(".confirm-detect");
// 确认结果
confirm.addEventListener("click", function () {
  var compBbox = labelBoxToDetectBox(annotate.Arrays.imageAnnotateMemory);
  var event = {
    command: "ui2code_confirm_detect_data",
    data: compBbox,
  };
  window.parent.postMessage(event, "*");
});

// 监听初始化数据
window.addEventListener("message", (e) => {
  if (e && e.data) {
    const event = e.data;
    if (event.command === "ui2code_init_detect_data") {
      this.initDetectData(event.data.detectImg || event.data.ui);
    }
  }
});
