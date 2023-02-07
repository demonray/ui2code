import { makeUpHtml } from './html'
import { makeUpJs } from './js'
import { getSandboxTpl } from "./sandbox";

export function vueTemplate(str: string) {
  return `<template>
        <div>
          ${str}
        </div>
      </template>`;
}

export function vueScript(str: string) {
  return `<script>
        ${str}
      </script>`;
}

export function cssStyle(cssStr: string) {
  return `<style>
        ${cssStr}
      </style>`;
}

/**
 * 生成目标组件库代码
 * @param data 
 * @param type 
 * @returns 
 */
export function generateCode(data: FormConf, type: string): string {
  const script = vueScript(makeUpJs(data, type))
  const html = vueTemplate(makeUpHtml(data, type));
  // const css = cssStyle(makeUpCss(data))
  return html + script;
}

export default {
  generateCode,
  getSandboxTpl,
};
