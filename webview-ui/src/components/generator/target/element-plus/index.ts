import { getSandboxTpl } from "./sandbox";
import { makeUpHtml } from "./html";
import { makeUpJs } from "./js";
import { utoa } from "../../../../utilities/index";

function generateCode(data: FormConf, type: string): string {
  const html = makeUpHtml(data, type);
  const script = makeUpJs(data, type, html);
  return html + script;
}

function getPlaygoundUrl(code: string) {
  code += `<style>
@import url('https://cdn.jsdelivr.net/npm/element-plus@2.3.5/dist/index.css')</style>`;
  const state = {
    "App.vue": code,
    "import-map.json": `{"imports": {
        "vue": "https://play.vuejs.org/vue.runtime.esm-browser.js",
        "vue/server-renderer": "https://play.vuejs.org/server-renderer.esm-browser.js",
        "element-plus": "https://cdn.jsdelivr.net/npm/element-plus@2.3.5/dist/index.full.mjs"
      }}`,
    "_o": {},
  };
  const hash = utoa(JSON.stringify(state));
  return `https://play.vuejs.org/#${hash}`;
}

export default {
  generateCode,
  getSandboxTpl,
  getPlaygoundUrl,
};
