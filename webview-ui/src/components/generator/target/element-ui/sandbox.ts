import { getParameters } from "codesandbox/lib/api/define";

/**
 * 生成sandbox预览文件
 * @param tpl
 * @param previewLocal
 * @returns
 */
export function getSandboxTpl(tpl: string, previewLocal: boolean): string | SandboxTemplateConfig {
  const files: IFiles = {
    "public/index.html": {
      isBinary: false,
      code: `<!DOCTYPE html>
<html lang="en">
  <head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
  <noscript>
      <strong
      >We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work
      properly without JavaScript enabled. Please enable it to
      continue.</strong
      >
  </noscript>
  <div id="app"></div>
  <!-- built files will be auto injected -->
  </body>
</html>`,
    },
    "src/main.js": {
      isBinary: false,
      code: `import Vue from "vue";
import App from "./App.vue";
import elementUi from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(elementUi);
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App)
}).$mount("#app");
`,
    },
    "src/App.vue": {
      isBinary: false,
      code: `${tpl}`,
    },
    "package.json": {
      isBinary: false,
      code: `{"scripts":{"serve":"vue-cli-service serve","build":"vue-cli-service build","lint":"vue-cli-service lint"},"dependencies":{"@vue/cli-plugin-babel":"4.1.1","element-ui":"2.13.2","vue":"^2.6.11"},"devDependencies":{"@vue/cli-plugin-eslint":"4.1.1","@vue/cli-service":"4.1.1","babel-eslint":"^10.0.3","eslint":"^6.7.2","eslint-plugin-vue":"^6.0.1","vue-template-compiler":"^2.6.11"},"eslintConfig":{"root":true,"env":{"node":true},"extends":["plugin:vue/essential","eslint:recommended"],"rules":{},"parserOptions":{"parser":"babel-eslint"}},"postcss":{"plugins":{"autoprefixer":{}}},"browserslist":["> 1%","last 2 versions","not ie <= 8"]}`,
    },
  };
  if (previewLocal) {
    return {
      files,
      main: "/src/App.vue",
      template: "vue",
      environment: "vue-cli",
    };
  } else {
    Object.keys(files).forEach((it) => {
      const item = files[it];
      item.content = item.code;
      delete item.code;
    });
  }
  const parameters = getParameters({
    template: "vue-cli",
    files,
  });
  return parameters;
}
