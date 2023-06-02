import { getParameters } from "codesandbox/lib/api/define";

/**
 * 生成sandbox预览文件
 * @param tpl
 * @param previewLocal
 * @returns
 */
export function getSandboxTpl(tpl: string, previewLocal: boolean): string | SandboxTemplateConfig {
  const files = {
    "index.html": {
      isBinary: false,
      code: `<!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Vite App</title>
            </head>
            <body>
              <div id="app"></div>
              <script type="module" src="/src/main.ts"></script>
            </body>
          </html>
          `,
    },
    "src/main.ts": {
      isBinary: false,
      code: `import { createApp } from "vue";
      //import ElementPlus from 'element-plus'
      import 'element-plus/dist/index.css'
      import App from "./App.vue";
      const app = createApp(App);
      
      //app.use(ElementPlus);
      app.mount('#app');`,
    },
    "src/App.vue": {
      isBinary: false,
      code: `${tpl}`,
    },
    "src/shims-vue.d.ts": {
      isBinary: false,
      code: `declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
  }
  `,
    },
    "package.json": {
      isBinary: false,
      code: `{"name":"element-plus-test-template","version":"0.0.0","scripts":{"serve":"vue-cli-service serve","build":"vue-cli-service build"},"dependencies":{"element-plus":"2.1.10","core-js":"^3.26.1","vue":"3.2.20"},"main":"/src/main.ts","keywords":[],"description":"","devDependencies":{"@vue/cli-plugin-babel":"^5.0.8","@vue/cli-plugin-typescript":"^5.0.8","@vue/cli-service":"^5.0.8","typescript":"^4.9.3"}}`,
    },
    "tsconfig.json": {
      isBinary: false,
      code: `{
  "compilerOptions": {
  "target": "esnext",
  "module": "esnext",
  "moduleResolution": "node",
  "strict": true,
  "jsx": "preserve",
  "sourceMap": true,
  "resolveJsonModule": true,
  "esModuleInterop": true,
  "lib": ["esnext", "dom"],
  "types": ["vite/client"]
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"]
}`,
    },
  };
  if (previewLocal) {
    return {
      files,
      main: "/src/App.vue",
      template: "vue-ts",
      environment: "vue-cli",
    };
  } else {
    Object.keys(files).forEach((it) => {
      //@ts-ignore
      const item = files[it];
      item.content = item.code;
      delete item.code;
    });
  }
  const parameters = getParameters({
    //@ts-ignore
    files,
  });
  return parameters;
}
