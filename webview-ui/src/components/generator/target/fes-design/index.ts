import { getSandboxTpl } from "./sandbox";
import { makeUpHtml } from './html';
import { makeUpJs } from './js';

function generateCode(data: FormConf, type: string): string {
    const html = makeUpHtml(data, type)
    const script = makeUpJs(data, type)
    return  html + script
}

export default {
  generateCode,
  getSandboxTpl,
};
