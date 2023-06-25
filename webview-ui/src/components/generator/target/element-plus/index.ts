import { getSandboxTpl } from "./sandbox";
import { makeUpHtml } from "./html";
import { makeUpJs } from "./js";
import DetectConfig from "../../../../config";
import { utoa } from "../../../../utilities/index";

function generateCode(data: FormConf, type: string): string {
  const html = makeUpHtml(data, type);
  const script = makeUpJs(data, type, html);
  return html + '\n' + script;
}

function getPlaygoundUrl(code: string) {
  let libUrl = "https://cdn.jsdelivr.net/npm/";
  let playground = "https://play.vuejs.org/";
  if (DetectConfig.playground) {
    playground = DetectConfig.playground;
    if (DetectConfig.playground.indexOf("play.vuejs.org") < 0) {
      libUrl = DetectConfig.playground;
    }
  }

  code += `<style>
@import url('${libUrl}element-plus@2.3.5/dist/index.css')</style>`;
  const state = {
    "App.vue": code,
    "import-map.json": `{"imports": {
        "vue": "${playground}vue.runtime.esm-browser.js",
        "vue/server-renderer": "${playground}server-renderer.esm-browser.js",
        "element-plus": "${libUrl}element-plus@2.3.5/dist/index.full.mjs"
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
