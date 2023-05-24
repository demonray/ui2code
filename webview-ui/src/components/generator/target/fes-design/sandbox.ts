import { getParameters } from "codesandbox/lib/api/define";
import FesDesignJsCode from "./lib/fes-design.js?raw";
import FesDesignCssCode from "./lib/fes-design.css?raw";
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
          <meta charset="utf-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width,initial-scale=1.0" />
          <link rel="icon" href="<%= BASE_URL %>favicon.ico" />
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
      </html>
      `,
    },
    "src/main.ts": {
      isBinary: false,
      code: `import { createApp } from "vue";
import App from "./App.vue";
import "./lib/fes-design.css";
createApp(App).mount("#app");
`,
    },
    "src/App.vue": {
      isBinary: false,
      code: `${tpl}`,
    },
    "src/shims-vue.d.ts": {
      isBinary: false,
      code: `declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}`,
    },
    "package.json": {
      isBinary: false,
      code: `{"name":"fesdesign-test-template","version":"0.0.0","scripts":{"serve":"vue-cli-service serve","build":"vue-cli-service build"},"dependencies":{"core-js":"^3.26.1","tslib": "2.0.3","vue":"3.2.20"},"main":"/src/main.ts","keywords":[],"description":"","devDependencies":{"@vue/cli-plugin-babel":"^5.0.8","@vue/cli-plugin-typescript":"^5.0.8","@vue/cli-service":"^5.0.8","typescript":"^4.9.3"}}`,
    },
    "tsconfig.json": {
      isBinary: false,
      code: `{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "strict": true,
    "jsx": "preserve",
    "importHelpers": true,
    "moduleResolution": "node",
    "experimentalDecorators": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "sourceMap": true,
    "baseUrl": ".",
    "types": [
    "webpack-env"
    ],
    "paths": {
    "@/*": [
        "src/*"
    ]
    },
    "lib": [
    "esnext",
    "dom",
    "dom.iterable",
    "scripthost"
    ]
  }
}`,
    },
    "babel.config.js": {
      isBinary: false,
      code: `module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ]
}`,
    },
    ".eslintrce.js": {
      isBinary: false,
      code: `module.exports = {
  root: true,

  env: {
    node: true
  },

  parserOptions: {
    parser: "@typescript-eslint/parser"
 },

  rules: {
    "no-console": "off",
    "no-debugger": "off",
    "vue/no-multiple-template-root": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"]
  },

  overrides: [
    {
    files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)"
    ],
    env: {}
    }
  ],

  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/prettier",
    "@vue/typescript"
  ]
};
`,
    },
    "src/lib/fes-design.js": {
      isBinary: false,
      code: FesDesignJsCode,
    },
    "src/lib/fes-design.css": {
      isBinary: false,
      code: FesDesignCssCode,
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
