import { getSandboxTpl } from "./sandbox";
import { makeUpHtml } from "./html";
import { makeUpJs } from "./js";
import { utoa } from "../../../../utilities/index";

function generateCode(data: FormConf, type: string): string {
  const html = makeUpHtml(data, type);
  const script = makeUpJs(data, type);
  return html + script;
}

function getPlaygoundUrl(code: string) {
  const state = {
    "App.vue": code,
    "_o": {},
  };
  const hash = utoa(JSON.stringify(state));
  return `https://element-plus.run/#${hash}`;
}

export default {
  generateCode,
  getSandboxTpl,
  getPlaygoundUrl
};
