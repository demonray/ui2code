import { getSandboxTpl } from "./sandbox";
import { makeUpHtml } from './html';
import { makeUpJs } from './js';

function generateCode(data: FormConf): string {
    const html = makeUpHtml(data)
    const script = makeUpJs(data)
    return  html + script
}

export default {
  generateCode,
  getSandboxTpl,
};
