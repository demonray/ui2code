import { getSandboxTpl } from "./sandbox";
import { makeUpHtml } from "./html";
import { makeUpJs } from "./js";
import DetectConfig from "../../../../config";
import { utoa } from "../../../../utilities/index";
import type { SaveConfig } from "../../../../components/generator";


function generateCode(data: FormConf, type: SaveConfig["type"], metaInfo: any): string {
  const { html, info} = makeUpHtml(data, type, metaInfo);
  const script = makeUpJs(data, type, {html, info});
  return html + '\n' + script;
}

function getPlaygoundUrl(code: string) {
  let libUrl = "https://cdn.jsdelivr.net/npm/@fesjs/";
  let playground = "https://play.vuejs.org/";
  if (DetectConfig.playground) {
    playground = DetectConfig.playground;
    if (DetectConfig.playground.indexOf("play.vuejs.org") < 0) {
      libUrl = DetectConfig.playground;
    }
  }
  code = code.replace("./lib/fes-design.js", "@fesjs/fes-design");
  code += `<style>
  @import url('${libUrl}fes-design/dist/fes-design.css')
  </style>`;
  const state = {
    "App.vue": code,
    "import-map.json": `{"imports": {
        "vue": "${playground}vue.runtime.esm-browser.js",
        "vue/server-renderer": "${playground}server-renderer.esm-browser.js",
        "@fesjs/fes-design": "${libUrl}fes-design/dist/fes-design.esm-browser.js"
      }}`,
  };
  const hash = utoa(JSON.stringify(state));
  return `${playground}#${hash}`;
}

export default {
  generateCode,
  getSandboxTpl,
  getPlaygoundUrl,
};
