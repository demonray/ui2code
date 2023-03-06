import { getParameters } from "codesandbox/lib/api/define";

/**
 * 生成sandbox预览文件
 * @param tpl
 * @returns
 */
export function getSandboxTpl(tpl: string): string {
  const parameters = getParameters({
    files: {
      "index.html": {
        isBinary: false,
        content: `<!DOCTYPE html>
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
        content: `import { createApp } from "vue";
        import App from "./App.vue";
        
        createApp(App).mount("#app");`,
      },
      "src/App.vue": {
        isBinary: false,
        content: `${tpl}`,
      },
      "src/shims-vue.d.ts": {
        isBinary: false,
        content: `declare module '*.vue' {
            import { DefineComponent } from 'vue'
            const component: DefineComponent<{}, {}, any>
            export default component
          }
          `,
      },
      "package.json": {
        isBinary: false,
        //@ts-ignore
        content: {
          name: "element-plus-test-template",
          version: "0.0.0",
          scripts: {
            dev: "vite",
            build: "vite build",
            serve: "vite preview",
          },
          dependencies: {
            "@vitejs/plugin-vue": "^1.1.5",
            "@vue/compiler-sfc": "^3.0.7",
            "element-plus": "1.1.0-beta.24",
            "typescript": "4.4.4",
            "unplugin-vue-components": "0.16.0",
            "vite": "^2.0.5",
            "vue": "3.2.20",
          },
          keywords: [],
          description: "",
        },
      },
      "pnpm-lock.yaml": {
        isBinary: false,
        content: `dependencies:
        vue: 3.0.7
      devDependencies:
        '@vitejs/plugin-vue': 1.1.5_@vue+compiler-sfc@3.0.7
        '@vue/compiler-sfc': 3.0.7_vue@3.0.7
        typescript: 4.2.3
        vite: 2.0.5
        vite-plugin-windicss: 0.6.6_vite@2.0.5
      lockfileVersion: 5.2
      packages:
        /@babel/helper-validator-identifier/7.12.11:
          resolution:
            integrity: sha512-np/lG3uARFybkoHokJUmf1QfEvRVCPbmQeUQpKow5cQ3xWrV9i3rUHodKDJPQfTVX61qKi+UdYk8kik84n7XOw==
        /@babel/parser/7.13.9:
          engines:
            node: '>=6.0.0'
          hasBin: true
          resolution:
            integrity: sha512-nEUfRiARCcaVo3ny3ZQjURjHQZUo/JkEw7rLlSZy/psWGnvwXFtPcr6jb7Yb41DVW5LTe6KRq9LGleRNsg1Frw==
        /@babel/types/7.13.0:
          dependencies:
            '@babel/helper-validator-identifier': 7.12.11
            lodash: 4.17.21
            to-fast-properties: 2.0.0
          resolution:
            integrity: sha512-hE+HE8rnG1Z6Wzo+MhaKE5lM5eMx71T4EHJgku2E3xIfaULhDcxiiRxUYgwX8qwP1BBSlag+TdGOt6JAidIZTA==
        /@nodelib/fs.scandir/2.1.4:
          dependencies:
            '@nodelib/fs.stat': 2.0.4
            run-parallel: 1.2.0
          dev: true
          engines:
            node: '>= 8'
          resolution:
            integrity: sha512-33g3pMJk3bg5nXbL/+CY6I2eJDzZAni49PfJnL5fghPTggPvBd/pFNSgJsdAgWptuFu7qq/ERvOYFlhvsLTCKA==
        /@nodelib/fs.stat/2.0.4:
          dev: true
          engines:
            node: '>= 8'
          resolution:
            integrity: sha512-IYlHJA0clt2+Vg7bccq+TzRdJvv19c2INqBSsoOLp1je7xjtr7J26+WXR72MCdvU9q1qTzIWDfhMf+DRvQJK4Q==
        /@nodelib/fs.walk/1.2.6:
          dependencies:
            '@nodelib/fs.scandir': 2.1.4
            fastq: 1.11.0
          dev: true
          engines:
            node: '>= 8'
          resolution:
            integrity: sha512-8Broas6vTtW4GIXTAHDoE32hnN2M5ykgCpWGbuXHQ15vEMqr23pB76e/GZcYsZCHALv50ktd24qhEyKr6wBtow==
        /@vitejs/plugin-vue/1.1.5_@vue+compiler-sfc@3.0.7:
          dependencies:
            '@vue/compiler-sfc': 3.0.7_vue@3.0.7
          dev: true
          engines:
            node: '>=12.0.0'
          peerDependencies:
            '@vue/compiler-sfc': ^3.0.6
          resolution:
            integrity: sha512-4DV8VPYo8/OR1YsnK39QN16xhKENt2XvcmJxqfRtyz75kvbjBYh1zTSHLp7XsXqv4R2I+fOZlbEBvxosMYLcPA==
        /@vue/compiler-core/3.0.7:
          dependencies:
            '@babel/parser': 7.13.9
            '@babel/types': 7.13.0
            '@vue/shared': 3.0.7
            estree-walker: 2.0.2
            source-map: 0.6.1
          resolution:
            integrity: sha512-JFohgBXoyUc3mdeI2WxlhjQZ5fakfemJkZHX8Gu/nFbEg3+lKVUZmNKWmmnp9aOzJQZKoj77LjmFxiP+P+7lMQ==
        /@vue/compiler-dom/3.0.7:
          dependencies:
            '@vue/compiler-core': 3.0.7
            '@vue/shared': 3.0.7
          resolution:
            integrity: sha512-VnIH9EbWQm/Tkcp+8dCaNVsVvhm/vxCrIKWRkXY9215hTqOqQOvejT8IMjd2kc++nIsYMsdQk6H9qqBvoLe/Cw==
        /@vue/compiler-sfc/3.0.7_vue@3.0.7:
          dependencies:
            '@babel/parser': 7.13.9
            '@babel/types': 7.13.0
            '@vue/compiler-core': 3.0.7
            '@vue/compiler-dom': 3.0.7
            '@vue/compiler-ssr': 3.0.7
            '@vue/shared': 3.0.7
            consolidate: 0.16.0
            estree-walker: 2.0.2
            hash-sum: 2.0.0
            lru-cache: 5.1.1
            magic-string: 0.25.7
            merge-source-map: 1.1.0
            postcss: 8.2.7
            postcss-modules: 4.0.0_postcss@8.2.7
            postcss-selector-parser: 6.0.4
            source-map: 0.6.1
            vue: 3.0.7
          dev: true
          peerDependencies:
            vue: 3.0.7
          resolution:
            integrity: sha512-37/QILpGE+J3V+bP9Slg9e6xGqfk+MmS2Yj8ChR4fS0/qWUU/YoYHE0GPIzjmBdH0JVOOmJqunxowIXmqNiHng==
        /@vue/compiler-ssr/3.0.7:
          dependencies:
            '@vue/compiler-dom': 3.0.7
            '@vue/shared': 3.0.7
          dev: true
          resolution:
            integrity: sha512-nHRbHeSpfXwjypettjrA16TjgfDcPEwq3m/zHnGyLC1QqdLtklXmpSM43/CPwwTCRa/qdt0pldJf22MiCEuTSQ==
        /@vue/reactivity/3.0.7:
          dependencies:
            '@vue/shared': 3.0.7
          dev: false
          resolution:
            integrity: sha512-FotWcNNaKhqpFZrdgsUOZ1enlJ5lhTt01CNTtLSyK7jYFgZBTuw8vKsEutZKDYZ1XKotOfoeO8N3pZQqmM6Etw==
        /@vue/runtime-core/3.0.7:
          dependencies:
            '@vue/reactivity': 3.0.7
            '@vue/shared': 3.0.7
          dev: false
          resolution:
            integrity: sha512-DBAZAwVvdmMXuyd6/9qqj/kYr/GaLTmn1L2/QLxLwP+UfhIboiTSBc/tUUb8MRk7Bb98GzNeAWkkT6AfooS3dQ==
        /@vue/runtime-dom/3.0.7:
          dependencies:
            '@vue/runtime-core': 3.0.7
            '@vue/shared': 3.0.7
            csstype: 2.6.16
          dev: false
          resolution:
            integrity: sha512-Oij4ruOtnpQpCj+/Q3JPzgpTJ1Q7+N67pA53A8KVITEtxfvKL46NN6dhAZ5NGqwX6RWZpYqWQNewITeF0pHr8g==
        /@vue/shared/3.0.7:
          resolution:
            integrity: sha512-dn5FyfSc4ky424jH4FntiHno7Ss5yLkqKNmM/NXwANRnlkmqu74pnGetexDFVG5phMk9/FhwovUZCWGxsotVKg==
        /@windicss/plugin-utils/0.6.6:
          dependencies:
            esbuild: 0.8.56
            esbuild-register: 2.1.0_esbuild@0.8.56
            fast-glob: 3.2.5
            micromatch: 4.0.2
            windicss: 2.2.6
          dev: true
          resolution:
            integrity: sha512-9W6sy8oSDqYDeTtv03S5AMm5qc8w70f2obwFiVeI0JuhFM1lra3+bMin4HEbRJqJQCjy6xDiSkF6vxOiLSg9kQ==
        /big.js/5.2.2:
          dev: true
          resolution:
            integrity: sha512-vyL2OymJxmarO8gxMr0mhChsO9QGwhynfuu4+MHTAW6czfq9humCB7rKpUjDd9YUiDPU4mzpyupFSvOClAwbmQ==
        /bluebird/3.7.2:
          dev: true
          resolution:
            integrity: sha512-XpNj6GDQzdfW+r2Wnn7xiSAd7TM3jzkxGXBGTtWKuSXv1xUV+azxAm8jdWZN06QTQk+2N2XB9jRDkvbmQmcRtg==
        /braces/3.0.2:
          dependencies:
            fill-range: 7.0.1
          dev: true
          engines:
            node: '>=8'
          resolution:
            integrity: sha512-b8um+L1RzM3WDSzvhm6gIz1yfTbBt6YTlcEKAvsmqCZZFw46z626lVj9j1yEPW33H5H+lBQpZMP1k8l+78Ha0A==
        /colorette/1.2.2:
          dev: true
          resolution:
            integrity: sha512-MKGMzyfeuutC/ZJ1cba9NqcNpfeqMUcYmyF1ZFY6/Cn7CNSAKx6a+s48sqLqyAiZuaP2TcqMhoo+dlwFnVxT9w==
        /consolidate/0.16.0:
          dependencies:
            bluebird: 3.7.2
          dev: true
          engines:
            node: '>= 0.10.0'
          resolution:
            integrity: sha512-Nhl1wzCslqXYTJVDyJCu3ODohy9OfBMB5uD2BiBTzd7w+QY0lBzafkR8y8755yMYHAaMD4NuzbAw03/xzfw+eQ==
        /cssesc/3.0.0:
          dev: true
          engines:
            node: '>=4'
          hasBin: true
          resolution:
            integrity: sha512-/Tb/JcjK111nNScGob5MNtsntNM1aCNUDipB/TkwZFhyDrrE47SOx/18wF2bbjgc3ZzCSKW1T5nt5EbFoAz/Vg==
        /csstype/2.6.16:
          dev: false
          resolution:
            integrity: sha512-61FBWoDHp/gRtsoDkq/B1nWrCUG/ok1E3tUrcNbZjsE9Cxd9yzUirjS3+nAATB8U4cTtaQmAHbNndoFz5L6C9Q==
        /emojis-list/3.0.0:
          dev: true
          engines:
            node: '>= 4'
          resolution:
            integrity: sha512-/kyM18EfinwXZbno9FyUGeFh87KC8HRQBQGildHZbEuRyWFOmv1U10o9BBp8XVZDVNNuQKyIGIu5ZYAAXJ0V2Q==
        /esbuild-register/2.1.0_esbuild@0.8.56:
          dependencies:
            esbuild: 0.8.56
          dev: true
          peerDependencies:
            esbuild: '>=0.8.31'
          resolution:
            integrity: sha512-NS/ptwYqFfmRT50SwRuxlwuKDwraijsqhDjngX4QyYj5VxSlbujbglQbXTz1qrRQhZRhx4Ap9369W7t+aJtdmQ==
        /esbuild/0.8.56:
          dev: true
          hasBin: true
          requiresBuild: true
          resolution:
            integrity: sha512-PTMdAWK3JI2MNW811znGssGP5GR44tQPr++VQ1rPP0n8Z1cTKbCPD3S/kXPLr3ZZDIwAaVm08fuFym6Rp8l/0A==
        /estree-walker/2.0.2:
          resolution:
            integrity: sha512-Rfkk/Mp/DL7JVje3u18FxFujQlTNR2q6QfMSMB7AvCBx91NGj/ba3kCfza0f6dVDbw7YlRf/nDrn7pQrCCyQ/w==
        /fast-glob/3.2.5:
          dependencies:
            '@nodelib/fs.stat': 2.0.4
            '@nodelib/fs.walk': 1.2.6
            glob-parent: 5.1.1
            merge2: 1.4.1
            micromatch: 4.0.2
            picomatch: 2.2.2
          dev: true
          engines:
            node: '>=8'
          resolution:
            integrity: sha512-2DtFcgT68wiTTiwZ2hNdJfcHNke9XOfnwmBRWXhmeKM8rF0TGwmC/Qto3S7RoZKp5cilZbxzO5iTNTQsJ+EeDg==
        /fastq/1.11.0:
          dependencies:
            reusify: 1.0.4
          dev: true
          resolution:
            integrity: sha512-7Eczs8gIPDrVzT+EksYBcupqMyxSHXXrHOLRRxU2/DicV8789MRBRR8+Hc2uWzUupOs4YS4JzBmBxjjCVBxD/g==
        /fill-range/7.0.1:
          dependencies:
            to-regex-range: 5.0.1
          dev: true
          engines:
            node: '>=8'
          resolution:
            integrity: sha512-qOo9F+dMUmC2Lcb4BbVvnKJxTPjCm+RRpe4gDuGrzkL7mEVl/djYSu2OdQ2Pa302N4oqkSg9ir6jaLWJ2USVpQ==
        /fsevents/2.3.2:
          dev: true
          engines:
            node: ^8.16.0 || ^10.6.0 || >=11.0.0
          optional: true
          os:
            - darwin
          resolution:
            integrity: sha512-xiqMQR4xAeHTuB9uWm+fFRcIOgKBMiOBP+eXiyT7jsgVCq1bkVygt00oASowB7EdtpOHaaPgKt812P9ab+DDKA==
        /function-bind/1.1.1:
          dev: true
          resolution:
            integrity: sha512-yIovAzMX49sF8Yl58fSCWJ5svSLuaibPxXQJFLmBObTuCr0Mf1KiPopGM9NiFjiYBCbfaa2Fh6breQ6ANVTI0A==
        /generic-names/2.0.1:
          dependencies:
            loader-utils: 1.4.0
          dev: true
          resolution:
            integrity: sha512-kPCHWa1m9wGG/OwQpeweTwM/PYiQLrUIxXbt/P4Nic3LbGjCP0YwrALHW1uNLKZ0LIMg+RF+XRlj2ekT9ZlZAQ==
        /glob-parent/5.1.1:
          dependencies:
            is-glob: 4.0.1
          dev: true
          engines:
            node: '>= 6'
          resolution:
            integrity: sha512-FnI+VGOpnlGHWZxthPGR+QhR78fuiK0sNLkHQv+bL9fQi57lNNdquIbna/WrfROrolq8GK5Ek6BiMwqL/voRYQ==
        /has/1.0.3:
          dependencies:
            function-bind: 1.1.1
          dev: true
          engines:
            node: '>= 0.4.0'
          resolution:
            integrity: sha512-f2dvO0VU6Oej7RkWJGrehjbzMAjFp5/VKPp5tTpWIV4JHHZK1/BxbFRtf/siA2SWTe09caDmVtYYzWEIbBS4zw==
        /hash-sum/2.0.0:
          dev: true
          resolution:
            integrity: sha512-WdZTbAByD+pHfl/g9QSsBIIwy8IT+EsPiKDs0KNX+zSHhdDLFKdZu0BQHljvO+0QI/BasbMSUa8wYNCZTvhslg==
        /icss-replace-symbols/1.1.0:
          dev: true
          resolution:
            integrity: sha1-Bupvg2ead0njhs/h/oEq5dsiPe0=
        /icss-utils/5.1.0_postcss@8.2.7:
          dependencies:
            postcss: 8.2.7
          dev: true
          engines:
            node: ^10 || ^12 || >= 14
          peerDependencies:
            postcss: ^8.1.0
          resolution:
            integrity: sha512-soFhflCVWLfRNOPU3iv5Z9VUdT44xFRbzjLsEzSr5AQmgqPMTHdU3PMT1Cf1ssx8fLNJDA1juftYl+PUcv3MqA==
        /indexes-of/1.0.1:
          dev: true
          resolution:
            integrity: sha1-8w9xbI4r00bHtn0985FVZqfAVgc=
        /is-core-module/2.2.0:
          dependencies:
            has: 1.0.3
          dev: true
          resolution:
            integrity: sha512-XRAfAdyyY5F5cOXn7hYQDqh2Xmii+DEfIcQGxK/uNwMHhIkPWO0g8msXcbzLe+MpGoR951MlqM/2iIlU4vKDdQ==
        /is-extglob/2.1.1:
          dev: true
          engines:
            node: '>=0.10.0'
          resolution:
            integrity: sha1-qIwCU1eR8C7TfHahueqXc8gz+MI=
        /is-glob/4.0.1:
          dependencies:
            is-extglob: 2.1.1
          dev: true
          engines:
            node: '>=0.10.0'
          resolution:
            integrity: sha512-5G0tKtBTFImOqDnLB2hG6Bp2qcKEFduo4tZu9MT/H6NQv/ghhy30o55ufafxJ/LdH79LLs2Kfrn85TLKyA7BUg==
        /is-number/7.0.0:
          dev: true
          engines:
            node: '>=0.12.0'
          resolution:
            integrity: sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==
        /json5/1.0.1:
          dependencies:
            minimist: 1.2.5
          dev: true
          hasBin: true
          resolution:
            integrity: sha512-aKS4WQjPenRxiQsC93MNfjx+nbF4PAdYzmd/1JIj8HYzqfbu86beTuNgXDzPknWk0n0uARlyewZo4s++ES36Ow==
        /loader-utils/1.4.0:
          dependencies:
            big.js: 5.2.2
            emojis-list: 3.0.0
            json5: 1.0.1
          dev: true
          engines:
            node: '>=4.0.0'
          resolution:
            integrity: sha512-qH0WSMBtn/oHuwjy/NucEgbx5dbxxnxup9s4PVXJUDHZBQY+s0NWA9rJf53RBnQZxfch7euUui7hpoAPvALZdA==
        /lodash.camelcase/4.3.0:
          dev: true
          resolution:
            integrity: sha1-soqmKIorn8ZRA1x3EfZathkDMaY=
        /lodash/4.17.21:
          resolution:
            integrity: sha512-v2kDEe57lecTulaDIuNTPy3Ry4gLGJ6Z1O3vE1krgXZNrsQ+LFTGHVxVjcXPs17LhbZVGedAJv8XZ1tvj5FvSg==
        /lru-cache/5.1.1:
          dependencies:
            yallist: 3.1.1
          dev: true
          resolution:
            integrity: sha512-KpNARQA3Iwv+jTA0utUVVbrh+Jlrr1Fv0e56GGzAFOXN7dk/FviaDW8LHmK52DlcH4WP2n6gI8vN1aesBFgo9w==
        /magic-string/0.25.7:
          dependencies:
            sourcemap-codec: 1.4.8
          dev: true
          resolution:
            integrity: sha512-4CrMT5DOHTDk4HYDlzmwu4FVCcIYI8gauveasrdCu2IKIFOJ3f0v/8MDGJCDL9oD2ppz/Av1b0Nj345H9M+XIA==
        /merge-source-map/1.1.0:
          dependencies:
            source-map: 0.6.1
          dev: true
          resolution:
            integrity: sha512-Qkcp7P2ygktpMPh2mCQZaf3jhN6D3Z/qVZHSdWvQ+2Ef5HgRAPBO57A77+ENm0CPx2+1Ce/MYKi3ymqdfuqibw==
        /merge2/1.4.1:
          dev: true
          engines:
            node: '>= 8'
          resolution:
            integrity: sha512-8q7VEgMJW4J8tcfVPy8g09NcQwZdbwFEqhe/WZkoIzjn/3TGDwtOCYtXGxA3O8tPzpczCCDgv+P2P5y00ZJOOg==
        /micromatch/4.0.2:
          dependencies:
            braces: 3.0.2
            picomatch: 2.2.2
          dev: true
          engines:
            node: '>=8'
          resolution:
            integrity: sha512-y7FpHSbMUMoyPbYUSzO6PaZ6FyRnQOpHuKwbo1G+Knck95XVU4QAiKdGEnj5wwoS7PlOgthX/09u5iFJ+aYf5Q==
        /minimist/1.2.5:
          dev: true
          resolution:
            integrity: sha512-FM9nNUYrRBAELZQT3xeZQ7fmMOBg6nWNmJKTcgsJeaLstP/UODVpGsr5OhXhhXg6f+qtJ8uiZ+PUxkDWcgIXLw==
        /nanoid/3.1.20:
          dev: true
          engines:
            node: ^10 || ^12 || ^13.7 || ^14 || >=15.0.1
          hasBin: true
          resolution:
            integrity: sha512-a1cQNyczgKbLX9jwbS/+d7W8fX/RfgYR7lVWwWOGIPNgK2m0MWvrGF6/m4kk6U3QcFMnZf3RIhL0v2Jgh/0Uxw==
        /path-parse/1.0.6:
          dev: true
          resolution:
            integrity: sha512-GSmOT2EbHrINBf9SR7CDELwlJ8AENk3Qn7OikK4nFYAu3Ote2+JYNVvkpAEQm3/TLNEJFD/xZJjzyxg3KBWOzw==
        /picomatch/2.2.2:
          dev: true
          engines:
            node: '>=8.6'
          resolution:
            integrity: sha512-q0M/9eZHzmr0AulXyPwNfZjtwZ/RBZlbN3K3CErVrk50T2ASYI7Bye0EvekFY3IP1Nt2DHu0re+V2ZHIpMkuWg==
        /postcss-modules-extract-imports/3.0.0_postcss@8.2.7:
          dependencies:
            postcss: 8.2.7
          dev: true
          engines:
            node: ^10 || ^12 || >= 14
          peerDependencies:
            postcss: ^8.1.0
          resolution:
            integrity: sha512-bdHleFnP3kZ4NYDhuGlVK+CMrQ/pqUm8bx/oGL93K6gVwiclvX5x0n76fYMKuIGKzlABOy13zsvqjb0f92TEXw==
        /postcss-modules-local-by-default/4.0.0_postcss@8.2.7:
          dependencies:
            icss-utils: 5.1.0_postcss@8.2.7
            postcss: 8.2.7
            postcss-selector-parser: 6.0.4
            postcss-value-parser: 4.1.0
          dev: true
          engines:
            node: ^10 || ^12 || >= 14
          peerDependencies:
            postcss: ^8.1.0
          resolution:
            integrity: sha512-sT7ihtmGSF9yhm6ggikHdV0hlziDTX7oFoXtuVWeDd3hHObNkcHRo9V3yg7vCAY7cONyxJC/XXCmmiHHcvX7bQ==
        /postcss-modules-scope/3.0.0_postcss@8.2.7:
          dependencies:
            postcss: 8.2.7
            postcss-selector-parser: 6.0.4
          dev: true
          engines:
            node: ^10 || ^12 || >= 14
          peerDependencies:
            postcss: ^8.1.0
          resolution:
            integrity: sha512-hncihwFA2yPath8oZ15PZqvWGkWf+XUfQgUGamS4LqoP1anQLOsOJw0vr7J7IwLpoY9fatA2qiGUGmuZL0Iqlg==
        /postcss-modules-values/4.0.0_postcss@8.2.7:
          dependencies:
            icss-utils: 5.1.0_postcss@8.2.7
            postcss: 8.2.7
          dev: true
          engines:
            node: ^10 || ^12 || >= 14
          peerDependencies:
            postcss: ^8.1.0
          resolution:
            integrity: sha512-RDxHkAiEGI78gS2ofyvCsu7iycRv7oqw5xMWn9iMoR0N/7mf9D50ecQqUo5BZ9Zh2vH4bCUR/ktCqbB9m8vJjQ==
        /postcss-modules/4.0.0_postcss@8.2.7:
          dependencies:
            generic-names: 2.0.1
            icss-replace-symbols: 1.1.0
            lodash.camelcase: 4.3.0
            postcss: 8.2.7
            postcss-modules-extract-imports: 3.0.0_postcss@8.2.7
            postcss-modules-local-by-default: 4.0.0_postcss@8.2.7
            postcss-modules-scope: 3.0.0_postcss@8.2.7
            postcss-modules-values: 4.0.0_postcss@8.2.7
            string-hash: 1.1.3
          dev: true
          peerDependencies:
            postcss: ^8.0.0
          resolution:
            integrity: sha512-ghS/ovDzDqARm4Zj6L2ntadjyQMoyJmi0JkLlYtH2QFLrvNlxH5OAVRPWPeKilB0pY7SbuhO173KOWkPAxRJcw==
        /postcss-selector-parser/6.0.4:
          dependencies:
            cssesc: 3.0.0
            indexes-of: 1.0.1
            uniq: 1.0.1
            util-deprecate: 1.0.2
          dev: true
          engines:
            node: '>=4'
          resolution:
            integrity: sha512-gjMeXBempyInaBqpp8gODmwZ52WaYsVOsfr4L4lDQ7n3ncD6mEyySiDtgzCT+NYC0mmeOLvtsF8iaEf0YT6dBw==
        /postcss-value-parser/4.1.0:
          dev: true
          resolution:
            integrity: sha512-97DXOFbQJhk71ne5/Mt6cOu6yxsSfM0QGQyl0L25Gca4yGWEGJaig7l7gbCX623VqTBNGLRLaVUCnNkcedlRSQ==
        /postcss/8.2.7:
          dependencies:
            colorette: 1.2.2
            nanoid: 3.1.20
            source-map: 0.6.1
          dev: true
          engines:
            node: ^10 || ^12 || >=14
          resolution:
            integrity: sha512-DsVLH3xJzut+VT+rYr0mtvOtpTjSyqDwPf5EZWXcb0uAKfitGpTY9Ec+afi2+TgdN8rWS9Cs88UDYehKo/RvOw==
        /queue-microtask/1.2.2:
          dev: true
          resolution:
            integrity: sha512-dB15eXv3p2jDlbOiNLyMabYg1/sXvppd8DP2J3EOCQ0AkuSXCW2tP7mnVouVLJKgUMY6yP0kcQDVpLCN13h4Xg==
        /resolve/1.20.0:
          dependencies:
            is-core-module: 2.2.0
            path-parse: 1.0.6
          dev: true
          resolution:
            integrity: sha512-wENBPt4ySzg4ybFQW2TT1zMQucPK95HSh/nq2CFTZVOGut2+pQvSsgtda4d26YrYcr067wjbmzOG8byDPBX63A==
        /reusify/1.0.4:
          dev: true
          engines:
            iojs: '>=1.0.0'
            node: '>=0.10.0'
          resolution:
            integrity: sha512-U9nH88a3fc/ekCF1l0/UP1IosiuIjyTh7hBvXVMHYgVcfGvt897Xguj2UOLDeI5BG2m7/uwyaLVT6fbtCwTyzw==
        /rollup/2.40.0:
          dev: true
          engines:
            node: '>=10.0.0'
          hasBin: true
          optionalDependencies:
            fsevents: 2.3.2
          resolution:
            integrity: sha512-WiOGAPbXoHu+TOz6hyYUxIksOwsY/21TRWoO593jgYt8mvYafYqQl+axaA8y1z2HFazNUUrsMSjahV2A6/2R9A==
        /run-parallel/1.2.0:
          dependencies:
            queue-microtask: 1.2.2
          dev: true
          resolution:
            integrity: sha512-5l4VyZR86LZ/lDxZTR6jqL8AFE2S0IFLMP26AbjsLVADxHdhB/c0GUsH+y39UfCi3dzz8OlQuPmnaJOMoDHQBA==
        /source-map/0.6.1:
          engines:
            node: '>=0.10.0'
          resolution:
            integrity: sha512-UjgapumWlbMhkBgzT7Ykc5YXUT46F0iKu8SGXq0bcwP5dz/h0Plj6enJqjz1Zbq2l5WaqYnrVbwWOWMyF3F47g==
        /sourcemap-codec/1.4.8:
          dev: true
          resolution:
            integrity: sha512-9NykojV5Uih4lgo5So5dtw+f0JgJX30KCNI8gwhz2J9A15wD0Ml6tjHKwf6fTSa6fAdVBdZeNOs9eJ71qCk8vA==
        /string-hash/1.1.3:
          dev: true
          resolution:
            integrity: sha1-6Kr8CsGFW0Zmkp7X3RJ1311sgRs=
        /to-fast-properties/2.0.0:
          engines:
            node: '>=4'
          resolution:
            integrity: sha1-3F5pjL0HkmW8c+A3doGk5Og/YW4=
        /to-regex-range/5.0.1:
          dependencies:
            is-number: 7.0.0
          dev: true
          engines:
            node: '>=8.0'
          resolution:
            integrity: sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==
        /typescript/4.2.3:
          dev: true
          engines:
            node: '>=4.2.0'
          hasBin: true
          resolution:
            integrity: sha512-qOcYwxaByStAWrBf4x0fibwZvMRG+r4cQoTjbPtUlrWjBHbmCAww1i448U0GJ+3cNNEtebDteo/cHOR3xJ4wEw==
        /uniq/1.0.1:
          dev: true
          resolution:
            integrity: sha1-sxxa6CVIRKOoKBVBzisEuGWnNP8=
        /util-deprecate/1.0.2:
          dev: true
          resolution:
            integrity: sha1-RQ1Nyfpw3nMnYvvS1KKJgUGaDM8=
        /vite-plugin-windicss/0.6.6_vite@2.0.5:
          dependencies:
            '@windicss/plugin-utils': 0.6.6
            vite: 2.0.5
            windicss: 2.2.6
          dev: true
          peerDependencies:
            vite: ^2.0.1
          resolution:
            integrity: sha512-V2UlnHKxCmH1BwrI96YMaBocpIoHzBRYsfv1GOi0jMs7gyakAz3QcnjGwdB2ZtSsE+wPlv5MhSFbL1CFVsvW/A==
        /vite/2.0.5:
          dependencies:
            esbuild: 0.8.56
            postcss: 8.2.7
            resolve: 1.20.0
            rollup: 2.40.0
          dev: true
          engines:
            node: '>=12.0.0'
          hasBin: true
          optionalDependencies:
            fsevents: 2.3.2
          resolution:
            integrity: sha512-QTgEDbq1WsTtr6j+++ewjhBFEk6c8v0xz4fb/OWJQKNYU8ZZtphOshwOqAlnarSstPBtWCBR0tsugXx6ajfoUg==
        /vue/3.0.7:
          dependencies:
            '@vue/compiler-dom': 3.0.7
            '@vue/runtime-dom': 3.0.7
            '@vue/shared': 3.0.7
          dev: false
          resolution:
            integrity: sha512-8h4TikD+JabbMK9aRlBO4laG0AtNHRPHynxYgWZ9sq1YUPfzynd9Jeeb27XNyZytC7aCQRX9xe1+TQJuc181Tw==
        /windicss/2.2.6:
          dev: true
          engines:
            node: '>= 12'
          hasBin: true
          resolution:
            integrity: sha512-RK502Xwsw0ptjVueJum0TEr286YJgtqK6kXpa60R6a1z2gGkVpEcaIfr6okQ5EYUk8WMRLrXoK6B2E6dSRg/sw==
        /yallist/3.1.1:
          dev: true
          resolution:
            integrity: sha512-a4UGQaWPH59mOXUYnAG2ewncQS4i4F43Tv3JoAM+s2VDAmS9NsK8GpDMLrCHPksFT7h3K6TOoUNn2pb7RoXx4g==
      specifiers:
        '@vitejs/plugin-vue': ^1.1.5
        '@vue/compiler-sfc': ^3.0.5
        typescript: ^4.1.3
        vite: ^2.0.5
        vite-plugin-windicss: ^0.6.6
        vue: ^3.0.5
      `,
      },
      "sandbox.config.json": {
        isBinary: false,
        content: `{
            "infiniteLoopProtection": true,
            "hardReloadOnChange": false,
            "view": "browser",
            "container": {
              "node": "14"
            },
            "startScript": "dev"
          }
          `,
      },
      "tsconfig.json": {
        isBinary: false,
        content: `{
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
          }
          `,
      },
      "vite.config.ts": {
        isBinary: false,
        content: `import { defineConfig } from "vite";
        import vue from "@vitejs/plugin-vue";
        import ViteComponents from "unplugin-vue-components/vite";
        import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
        export default defineConfig({
          plugins: [
            vue(),
            ViteComponents({
              resolvers: [ElementPlusResolver()]
            })
          ]
        });
        `,
      },
      "yarn.lock": {
        isBinary: false,
        content: `# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
        # yarn lockfile v1
        
        
        "@antfu/utils@^0.3.0":
          version "0.3.0"
          resolved "https://registry.yarnpkg.com/@antfu/utils/-/utils-0.3.0.tgz#6306c43b52a883bd8e973e3ed8dd64248418bcc4"
          integrity sha512-UU8TLr/EoXdg7OjMp0h9oDoIAVr+Z/oW9cpOxQQyrsz6Qzd2ms/1CdWx8fl2OQdFpxGmq5Vc4TwfLHId6nAZjA==
          dependencies:
            "@types/throttle-debounce" "^2.1.0"
        
        "@babel/helper-validator-identifier@^7.12.11":
          version "7.12.11"
          resolved "https://registry.yarnpkg.com/@babel/helper-validator-identifier/-/helper-validator-identifier-7.12.11.tgz#c9a1f021917dcb5ccf0d4e453e399022981fc9ed"
          integrity sha512-np/lG3uARFybkoHokJUmf1QfEvRVCPbmQeUQpKow5cQ3xWrV9i3rUHodKDJPQfTVX61qKi+UdYk8kik84n7XOw==
        
        "@babel/parser@^7.12.0":
          version "7.13.10"
          resolved "https://registry.yarnpkg.com/@babel/parser/-/parser-7.13.10.tgz#8f8f9bf7b3afa3eabd061f7a5bcdf4fec3c48409"
          integrity sha512-0s7Mlrw9uTWkYua7xWr99Wpk2bnGa0ANleKfksYAES8LpWH4gW1OUr42vqKNf0us5UQNfru2wPqMqRITzq/SIQ==
        
        "@babel/parser@^7.15.0":
          version "7.15.8"
          resolved "https://registry.yarnpkg.com/@babel/parser/-/parser-7.15.8.tgz#7bacdcbe71bdc3ff936d510c15dcea7cf0b99016"
          integrity sha512-BRYa3wcQnjS/nqI8Ac94pYYpJfojHVvVXJ97+IDCImX4Jc8W8Xv1+47enbruk+q1etOpsQNwnfFcNGw+gtPGxA==
        
        "@babel/types@^7.12.0":
          version "7.13.0"
          resolved "https://registry.yarnpkg.com/@babel/types/-/types-7.13.0.tgz#74424d2816f0171b4100f0ab34e9a374efdf7f80"
          integrity sha512-hE+HE8rnG1Z6Wzo+MhaKE5lM5eMx71T4EHJgku2E3xIfaULhDcxiiRxUYgwX8qwP1BBSlag+TdGOt6JAidIZTA==
          dependencies:
            "@babel/helper-validator-identifier" "^7.12.11"
            lodash "^4.17.19"
            to-fast-properties "^2.0.0"
        
        "@element-plus/icons@^0.0.11":
          version "0.0.11"
          resolved "https://registry.yarnpkg.com/@element-plus/icons/-/icons-0.0.11.tgz#9b187c002774548b911850d17fa5fc2f9a515f57"
          integrity sha512-iKQXSxXu131Ai+I9Ymtcof9WId7kaXvB1+WRfAfpQCW7UiAMYgdNDqb/u0hgTo2Yq3MwC4MWJnNuTBEpG8r7+A==
        
        "@nodelib/fs.scandir@2.1.5":
          version "2.1.5"
          resolved "https://registry.yarnpkg.com/@nodelib/fs.scandir/-/fs.scandir-2.1.5.tgz#7619c2eb21b25483f6d167548b4cfd5a7488c3d5"
          integrity sha512-vq24Bq3ym5HEQm2NKCr3yXDwjc7vTsEThRDnkp2DK9p1uqLR+DHurm/NOTo0KG7HYHU7eppKZj3MyqYuMBf62g==
          dependencies:
            "@nodelib/fs.stat" "2.0.5"
            run-parallel "^1.1.9"
        
        "@nodelib/fs.stat@2.0.5", "@nodelib/fs.stat@^2.0.2":
          version "2.0.5"
          resolved "https://registry.yarnpkg.com/@nodelib/fs.stat/-/fs.stat-2.0.5.tgz#5bd262af94e9d25bd1e71b05deed44876a222e8b"
          integrity sha512-RkhPPp2zrqDAQA/2jNhnztcPAlv64XdhIp7a7454A5ovI7Bukxgt7MX7udwAu3zg1DcpPU0rz3VV1SeaqvY4+A==
        
        "@nodelib/fs.walk@^1.2.3":
          version "1.2.7"
          resolved "https://registry.yarnpkg.com/@nodelib/fs.walk/-/fs.walk-1.2.7.tgz#94c23db18ee4653e129abd26fb06f870ac9e1ee2"
          integrity sha512-BTIhocbPBSrRmHxOAJFtR18oLhxTtAFDAvL8hY1S3iU8k+E60W/YFs4jrixGzQjMpF4qPXxIQHcjVD9dz1C2QA==
          dependencies:
            "@nodelib/fs.scandir" "2.1.5"
            fastq "^1.6.0"
        
        "@popperjs/core@^2.10.2":
          version "2.10.2"
          resolved "https://registry.yarnpkg.com/@popperjs/core/-/core-2.10.2.tgz#0798c03351f0dea1a5a4cabddf26a55a7cbee590"
          integrity sha512-IXf3XA7+XyN7CP9gGh/XB0UxVMlvARGEgGXLubFICsUMGz6Q+DU+i4gGlpOxTjKvXjkJDJC8YdqdKkDj9qZHEQ==
        
        "@rollup/pluginutils@^4.1.1":
          version "4.1.1"
          resolved "https://registry.yarnpkg.com/@rollup/pluginutils/-/pluginutils-4.1.1.tgz#1d4da86dd4eded15656a57d933fda2b9a08d47ec"
          integrity sha512-clDjivHqWGXi7u+0d2r2sBi4Ie6VLEAzWMIkvJLnDmxoOhBYOTfzGbOQBA32THHm11/LiJbd01tJUpJsbshSWQ==
          dependencies:
            estree-walker "^2.0.1"
            picomatch "^2.2.2"
        
        "@types/throttle-debounce@^2.1.0":
          version "2.1.0"
          resolved "https://registry.yarnpkg.com/@types/throttle-debounce/-/throttle-debounce-2.1.0.tgz#1c3df624bfc4b62f992d3012b84c56d41eab3776"
          integrity sha512-5eQEtSCoESnh2FsiLTxE121IiE60hnMqcb435fShf4bpLRjEu1Eoekht23y6zXS9Ts3l+Szu3TARnTsA0GkOkQ==
        
        "@vitejs/plugin-vue@^1.1.5":
          version "1.1.5"
          resolved "https://registry.yarnpkg.com/@vitejs/plugin-vue/-/plugin-vue-1.1.5.tgz#fa1e8e5e049c35e213672e33f73fe81706ad5dbe"
          integrity sha512-4DV8VPYo8/OR1YsnK39QN16xhKENt2XvcmJxqfRtyz75kvbjBYh1zTSHLp7XsXqv4R2I+fOZlbEBvxosMYLcPA==
        
        "@vue/compiler-core@3.0.7":
          version "3.0.7"
          resolved "https://registry.yarnpkg.com/@vue/compiler-core/-/compiler-core-3.0.7.tgz#421782a4c67cc3f2b7c30457ef446d74f8524f74"
          integrity sha512-JFohgBXoyUc3mdeI2WxlhjQZ5fakfemJkZHX8Gu/nFbEg3+lKVUZmNKWmmnp9aOzJQZKoj77LjmFxiP+P+7lMQ==
          dependencies:
            "@babel/parser" "^7.12.0"
            "@babel/types" "^7.12.0"
            "@vue/shared" "3.0.7"
            estree-walker "^2.0.1"
            source-map "^0.6.1"
        
        "@vue/compiler-core@3.2.20":
          version "3.2.20"
          resolved "https://registry.yarnpkg.com/@vue/compiler-core/-/compiler-core-3.2.20.tgz#af5a3c5237818835b0d0be837eb5885a8d21c160"
          integrity sha512-vcEXlKXoPwBXFP5aUTHN9GTZaDfwCofa9Yu9bbW2C5O/QSa9Esdt7OG4+0RRd3EHEMxUvEdj4RZrd/KpQeiJbA==
          dependencies:
            "@babel/parser" "^7.15.0"
            "@vue/shared" "3.2.20"
            estree-walker "^2.0.2"
            source-map "^0.6.1"
        
        "@vue/compiler-dom@3.0.7":
          version "3.0.7"
          resolved "https://registry.yarnpkg.com/@vue/compiler-dom/-/compiler-dom-3.0.7.tgz#54d2e12fb9a7aff53abd19dac2c2679533f0c919"
          integrity sha512-VnIH9EbWQm/Tkcp+8dCaNVsVvhm/vxCrIKWRkXY9215hTqOqQOvejT8IMjd2kc++nIsYMsdQk6H9qqBvoLe/Cw==
          dependencies:
            "@vue/compiler-core" "3.0.7"
            "@vue/shared" "3.0.7"
        
        "@vue/compiler-dom@3.2.20":
          version "3.2.20"
          resolved "https://registry.yarnpkg.com/@vue/compiler-dom/-/compiler-dom-3.2.20.tgz#8e0ef354449c0faf41519b00bfc2045eae01dcb5"
          integrity sha512-QnI77ec/JtV7R0YBbcVayYTDCRcI9OCbxiUQK6izVyqQO0658n0zQuoNwe+bYgtqnvGAIqTR3FShTd5y4oOjdg==
          dependencies:
            "@vue/compiler-core" "3.2.20"
            "@vue/shared" "3.2.20"
        
        "@vue/compiler-sfc@3.2.20":
          version "3.2.20"
          resolved "https://registry.yarnpkg.com/@vue/compiler-sfc/-/compiler-sfc-3.2.20.tgz#2d7668e76f066c566dd7c09c15c9acce4e876e0a"
          integrity sha512-03aZo+6tQKiFLfunHKSPZvdK4Jsn/ftRCyaro8AQIWkuxJbvSosbKK6HTTn+D2c3nPScG155akJoxKENw7rftQ==
          dependencies:
            "@babel/parser" "^7.15.0"
            "@vue/compiler-core" "3.2.20"
            "@vue/compiler-dom" "3.2.20"
            "@vue/compiler-ssr" "3.2.20"
            "@vue/ref-transform" "3.2.20"
            "@vue/shared" "3.2.20"
            estree-walker "^2.0.2"
            magic-string "^0.25.7"
            postcss "^8.1.10"
            source-map "^0.6.1"
        
        "@vue/compiler-sfc@^3.0.7":
          version "3.0.7"
          resolved "https://registry.yarnpkg.com/@vue/compiler-sfc/-/compiler-sfc-3.0.7.tgz#900414750cc726553b870490f48073451fd14f07"
          integrity sha512-37/QILpGE+J3V+bP9Slg9e6xGqfk+MmS2Yj8ChR4fS0/qWUU/YoYHE0GPIzjmBdH0JVOOmJqunxowIXmqNiHng==
          dependencies:
            "@babel/parser" "^7.12.0"
            "@babel/types" "^7.12.0"
            "@vue/compiler-core" "3.0.7"
            "@vue/compiler-dom" "3.0.7"
            "@vue/compiler-ssr" "3.0.7"
            "@vue/shared" "3.0.7"
            consolidate "^0.16.0"
            estree-walker "^2.0.1"
            hash-sum "^2.0.0"
            lru-cache "^5.1.1"
            magic-string "^0.25.7"
            merge-source-map "^1.1.0"
            postcss "^8.1.10"
            postcss-modules "^4.0.0"
            postcss-selector-parser "^6.0.4"
            source-map "^0.6.1"
        
        "@vue/compiler-ssr@3.0.7":
          version "3.0.7"
          resolved "https://registry.yarnpkg.com/@vue/compiler-ssr/-/compiler-ssr-3.0.7.tgz#28b85d497381d75fe44234057b140b0065ca9dbf"
          integrity sha512-nHRbHeSpfXwjypettjrA16TjgfDcPEwq3m/zHnGyLC1QqdLtklXmpSM43/CPwwTCRa/qdt0pldJf22MiCEuTSQ==
          dependencies:
            "@vue/compiler-dom" "3.0.7"
            "@vue/shared" "3.0.7"
        
        "@vue/compiler-ssr@3.2.20":
          version "3.2.20"
          resolved "https://registry.yarnpkg.com/@vue/compiler-ssr/-/compiler-ssr-3.2.20.tgz#9cceb6261d9932cb5568202610c1c28f86c5e521"
          integrity sha512-rzzVVYivm+EjbfiGQvNeyiYZWzr6Hkej97RZLZvcumacQlnKv9176Xo9rRyeWwFbBlxmtNdrVMslRXtipMXk2w==
          dependencies:
            "@vue/compiler-dom" "3.2.20"
            "@vue/shared" "3.2.20"
        
        "@vue/reactivity@3.2.20":
          version "3.2.20"
          resolved "https://registry.yarnpkg.com/@vue/reactivity/-/reactivity-3.2.20.tgz#81fe1c368e7f20bc0ec1dec1045bbee253582de8"
          integrity sha512-nSmoLojUTk+H8HNTAkrUduB4+yIUBK2HPihJo2uXVSH4Spry6oqN6lFzE5zpLK+F27Sja+UqR9R1+/kIOsHV5w==
          dependencies:
            "@vue/shared" "3.2.20"
        
        "@vue/ref-transform@3.2.20":
          version "3.2.20"
          resolved "https://registry.yarnpkg.com/@vue/ref-transform/-/ref-transform-3.2.20.tgz#2a59ec90caf8e5c7336776a0900bff0a8b81c090"
          integrity sha512-Y42d3PGlYZ1lXcF3dbd3+qU/C/a3wYEZ949fyOI5ptzkjDWlkfU6vn74fmOjsLjEcjs10BXK2qO99FqQIK2r1Q==
          dependencies:
            "@babel/parser" "^7.15.0"
            "@vue/compiler-core" "3.2.20"
            "@vue/shared" "3.2.20"
            estree-walker "^2.0.2"
            magic-string "^0.25.7"
        
        "@vue/runtime-core@3.2.20":
          version "3.2.20"
          resolved "https://registry.yarnpkg.com/@vue/runtime-core/-/runtime-core-3.2.20.tgz#8f63e956a3f88fb772541443c45a7701211012cb"
          integrity sha512-d1xfUGhZPfiZzAN7SatStD4vRtT8deJSXib2+Cz3x0brjMWKxe32asQc154FF1E2fFgMCHtnfd4A90bQEzV4GQ==
          dependencies:
            "@vue/reactivity" "3.2.20"
            "@vue/shared" "3.2.20"
        
        "@vue/runtime-dom@3.2.20":
          version "3.2.20"
          resolved "https://registry.yarnpkg.com/@vue/runtime-dom/-/runtime-dom-3.2.20.tgz#8aa56ae6c30f9cd4a71ca0e9ec3c4bdc67148d15"
          integrity sha512-4TCvZMLhESWCFHFYgqN4QmMA/onnINAlUovhopjlS8ST27G1A8Z0tyxPzLoXLa+b5JrOpbMPheEMPvdKExTJig==
          dependencies:
            "@vue/runtime-core" "3.2.20"
            "@vue/shared" "3.2.20"
            csstype "^2.6.8"
        
        "@vue/server-renderer@3.2.20":
          version "3.2.20"
          resolved "https://registry.yarnpkg.com/@vue/server-renderer/-/server-renderer-3.2.20.tgz#705e07ae9425132b2b6227d308a51a13f4d4ec81"
          integrity sha512-viIbZGep9XabnrRcaxWIi00cOh1x21QYm2upIL5W0zqzTJ54VdTzpI+zi1osNp+VfRQDTHpV2U7H3Kn4ljYJvg==
          dependencies:
            "@vue/compiler-ssr" "3.2.20"
            "@vue/shared" "3.2.20"
        
        "@vue/shared@3.0.7":
          version "3.0.7"
          resolved "https://registry.yarnpkg.com/@vue/shared/-/shared-3.0.7.tgz#96d52988efc07444c108c7c6803ba7cc93e40045"
          integrity sha512-dn5FyfSc4ky424jH4FntiHno7Ss5yLkqKNmM/NXwANRnlkmqu74pnGetexDFVG5phMk9/FhwovUZCWGxsotVKg==
        
        "@vue/shared@3.2.20":
          version "3.2.20"
          resolved "https://registry.yarnpkg.com/@vue/shared/-/shared-3.2.20.tgz#53746961f731a8ea666e3316271e944238dc31db"
          integrity sha512-FbpX+hD5BvXCQerEYO7jtAGHlhAkhTQ4KIV73kmLWNlawWhTiVuQxizgVb0BOkX5oG9cIRZ42EG++d/k/Efp0w==
        
        "@vueuse/core@~6.1.0":
          version "6.1.0"
          resolved "https://registry.yarnpkg.com/@vueuse/core/-/core-6.1.0.tgz#8137c291cf49b11c2deda4d5079096e55b36fc28"
          integrity sha512-6KienU5QOWKuDqvHytep14274IGKyLlACzXjifOrgDQMkqvWZIUnDhpckT/1+O8n8DN59d5wzzICZI/2sfGCyg==
          dependencies:
            "@vueuse/shared" "6.1.0"
            vue-demi "*"
        
        "@vueuse/shared@6.1.0":
          version "6.1.0"
          resolved "https://registry.yarnpkg.com/@vueuse/shared/-/shared-6.1.0.tgz#1375fd41acefe52f9a1842f3c6a8a348786535ba"
          integrity sha512-teW0TUQryGnEprHeOI6oH8NPVJBirknxksEiNCtdEjIi8W7JSTg8JPO+e1XlGI6ly24NDlDXUDYaHJayiaXjuw==
          dependencies:
            vue-demi "*"
        
        anymatch@~3.1.2:
          version "3.1.2"
          resolved "https://registry.yarnpkg.com/anymatch/-/anymatch-3.1.2.tgz#c0557c096af32f106198f4f4e2a383537e378716"
          integrity sha512-P43ePfOAIupkguHUycrc4qJ9kz8ZiuOUijaETwX7THt0Y/GNK7v0aa8rY816xWjZ7rJdA5XdMcpVFTKMq+RvWg==
          dependencies:
            normalize-path "^3.0.0"
            picomatch "^2.0.4"
        
        async-validator@^4.0.3:
          version "4.0.7"
          resolved "https://registry.yarnpkg.com/async-validator/-/async-validator-4.0.7.tgz#034a0fd2103a6b2ebf010da75183bec299247afe"
          integrity sha512-Pj2IR7u8hmUEDOwB++su6baaRi+QvsgajuFB9j95foM1N2gy5HM4z60hfusIO0fBPG5uLAEl6yCJr1jNSVugEQ==
        
        balanced-match@^1.0.0:
          version "1.0.2"
          resolved "https://registry.yarnpkg.com/balanced-match/-/balanced-match-1.0.2.tgz#e83e3a7e3f300b34cb9d87f615fa0cbf357690ee"
          integrity sha512-3oSeUO0TMV67hN1AmbXsK4yaqU7tjiHlbxRDZOpH0KW9+CeX4bRAaX0Anxt0tx2MrpRpWwQaPwIlISEJhYU5Pw==
        
        big.js@^5.2.2:
          version "5.2.2"
          resolved "https://registry.yarnpkg.com/big.js/-/big.js-5.2.2.tgz#65f0af382f578bcdc742bd9c281e9cb2d7768328"
          integrity sha512-vyL2OymJxmarO8gxMr0mhChsO9QGwhynfuu4+MHTAW6czfq9humCB7rKpUjDd9YUiDPU4mzpyupFSvOClAwbmQ==
        
        binary-extensions@^2.0.0:
          version "2.2.0"
          resolved "https://registry.yarnpkg.com/binary-extensions/-/binary-extensions-2.2.0.tgz#75f502eeaf9ffde42fc98829645be4ea76bd9e2d"
          integrity sha512-jDctJ/IVQbZoJykoeHbhXpOlNBqGNcwXJKJog42E5HDPUwQTSdjCHdihjj0DlnheQ7blbT6dHOafNAiS8ooQKA==
        
        bluebird@^3.7.2:
          version "3.7.2"
          resolved "https://registry.yarnpkg.com/bluebird/-/bluebird-3.7.2.tgz#9f229c15be272454ffa973ace0dbee79a1b0c36f"
          integrity sha512-XpNj6GDQzdfW+r2Wnn7xiSAd7TM3jzkxGXBGTtWKuSXv1xUV+azxAm8jdWZN06QTQk+2N2XB9jRDkvbmQmcRtg==
        
        brace-expansion@^1.1.7:
          version "1.1.11"
          resolved "https://registry.yarnpkg.com/brace-expansion/-/brace-expansion-1.1.11.tgz#3c7fcbf529d87226f3d2f52b966ff5271eb441dd"
          integrity sha512-iCuPHDFgrHX7H2vEI/5xpz07zSHB00TpugqhmYtVmMO6518mCuRMoOYFldEBl0g187ufozdaHgWKcYFb61qGiA==
          dependencies:
            balanced-match "^1.0.0"
            concat-map "0.0.1"
        
        braces@^3.0.1, braces@~3.0.2:
          version "3.0.2"
          resolved "https://registry.yarnpkg.com/braces/-/braces-3.0.2.tgz#3454e1a462ee8d599e236df336cd9ea4f8afe107"
          integrity sha512-b8um+L1RzM3WDSzvhm6gIz1yfTbBt6YTlcEKAvsmqCZZFw46z626lVj9j1yEPW33H5H+lBQpZMP1k8l+78Ha0A==
          dependencies:
            fill-range "^7.0.1"
        
        builtins@^4.0.0:
          version "4.0.0"
          resolved "https://registry.yarnpkg.com/builtins/-/builtins-4.0.0.tgz#a8345420de82068fdc4d6559d0456403a8fb1905"
          integrity sha512-qC0E2Dxgou1IHhvJSLwGDSTvokbRovU5zZFuDY6oY8Y2lF3nGt5Ad8YZK7GMtqzY84Wu7pXTPeHQeHcXSXsRhw==
          dependencies:
            semver "^7.0.0"
        
        chokidar@^3.5.2:
          version "3.5.2"
          resolved "https://registry.yarnpkg.com/chokidar/-/chokidar-3.5.2.tgz#dba3976fcadb016f66fd365021d91600d01c1e75"
          integrity sha512-ekGhOnNVPgT77r4K/U3GDhu+FQ2S8TnK/s2KbIGXi0SZWuwkZ2QNyfWdZW+TVfn84DpEP7rLeCt2UI6bJ8GwbQ==
          dependencies:
            anymatch "~3.1.2"
            braces "~3.0.2"
            glob-parent "~5.1.2"
            is-binary-path "~2.1.0"
            is-glob "~4.0.1"
            normalize-path "~3.0.0"
            readdirp "~3.6.0"
          optionalDependencies:
            fsevents "~2.3.2"
        
        colorette@^1.2.2:
          version "1.2.2"
          resolved "https://registry.yarnpkg.com/colorette/-/colorette-1.2.2.tgz#cbcc79d5e99caea2dbf10eb3a26fd8b3e6acfa94"
          integrity sha512-MKGMzyfeuutC/ZJ1cba9NqcNpfeqMUcYmyF1ZFY6/Cn7CNSAKx6a+s48sqLqyAiZuaP2TcqMhoo+dlwFnVxT9w==
        
        concat-map@0.0.1:
          version "0.0.1"
          resolved "https://registry.yarnpkg.com/concat-map/-/concat-map-0.0.1.tgz#d8a96bd77fd68df7793a73036a3ba0d5405d477b"
          integrity sha1-2Klr13/Wjfd5OnMDajug1UBdR3s=
        
        consolidate@^0.16.0:
          version "0.16.0"
          resolved "https://registry.yarnpkg.com/consolidate/-/consolidate-0.16.0.tgz#a11864768930f2f19431660a65906668f5fbdc16"
          integrity sha512-Nhl1wzCslqXYTJVDyJCu3ODohy9OfBMB5uD2BiBTzd7w+QY0lBzafkR8y8755yMYHAaMD4NuzbAw03/xzfw+eQ==
          dependencies:
            bluebird "^3.7.2"
        
        cssesc@^3.0.0:
          version "3.0.0"
          resolved "https://registry.yarnpkg.com/cssesc/-/cssesc-3.0.0.tgz#37741919903b868565e1c09ea747445cd18983ee"
          integrity sha512-/Tb/JcjK111nNScGob5MNtsntNM1aCNUDipB/TkwZFhyDrrE47SOx/18wF2bbjgc3ZzCSKW1T5nt5EbFoAz/Vg==
        
        csstype@^2.6.8:
          version "2.6.17"
          resolved "https://registry.yarnpkg.com/csstype/-/csstype-2.6.17.tgz#4cf30eb87e1d1a005d8b6510f95292413f6a1c0e"
          integrity sha512-u1wmTI1jJGzCJzWndZo8mk4wnPTZd1eOIYTYvuEyOQGfmDl3TrabCCfKnOC86FZwW/9djqTl933UF/cS425i9A==
        
        dayjs@^1.10.7:
          version "1.10.7"
          resolved "https://registry.yarnpkg.com/dayjs/-/dayjs-1.10.7.tgz#2cf5f91add28116748440866a0a1d26f3a6ce468"
          integrity sha512-P6twpd70BcPK34K26uJ1KT3wlhpuOAPoMwJzpsIWUxHZ7wpmbdZL/hQqBDfz7hGurYSa5PhzdhDHtt319hL3ig==
        
        debug@^4.3.2:
          version "4.3.2"
          resolved "https://registry.yarnpkg.com/debug/-/debug-4.3.2.tgz#f0a49c18ac8779e31d4a0c6029dfb76873c7428b"
          integrity sha512-mOp8wKcvj7XxC78zLgw/ZA+6TSgkoE2C/ienthhRD298T7UNwAg9diBpLRxC0mOezLl4B0xV7M0cCO6P/O0Xhw==
          dependencies:
            ms "2.1.2"
        
        element-plus@1.1.0-beta.24:
          version "1.1.0-beta.24"
          resolved "https://registry.yarnpkg.com/element-plus/-/element-plus-1.1.0-beta.24.tgz#858b05932ebc0be15419d3974d15be2a4f4b696c"
          integrity sha512-dmo61e/D6mwJVacMhxOMSPb5sZPt/FPsuQQfsOs1kJWkhGDmTlny/sZvgIQr1z0zh3pjlJadGAlNS+0nySPMmw==
          dependencies:
            "@element-plus/icons" "^0.0.11"
            "@popperjs/core" "^2.10.2"
            "@vueuse/core" "~6.1.0"
            async-validator "^4.0.3"
            dayjs "^1.10.7"
            lodash "^4.17.21"
            memoize-one "^5.2.1"
            normalize-wheel-es "^1.1.0"
            resize-observer-polyfill "^1.5.1"
        
        emojis-list@^3.0.0:
          version "3.0.0"
          resolved "https://registry.yarnpkg.com/emojis-list/-/emojis-list-3.0.0.tgz#5570662046ad29e2e916e71aae260abdff4f6a78"
          integrity sha512-/kyM18EfinwXZbno9FyUGeFh87KC8HRQBQGildHZbEuRyWFOmv1U10o9BBp8XVZDVNNuQKyIGIu5ZYAAXJ0V2Q==
        
        esbuild@^0.8.52:
          version "0.8.57"
          resolved "https://registry.yarnpkg.com/esbuild/-/esbuild-0.8.57.tgz#a42d02bc2b57c70bcd0ef897fe244766bb6dd926"
          integrity sha512-j02SFrUwFTRUqiY0Kjplwjm1psuzO1d6AjaXKuOR9hrY0HuPsT6sV42B6myW34h1q4CRy+Y3g4RU/cGJeI/nNA==
        
        estree-walker@^2.0.1, estree-walker@^2.0.2:
          version "2.0.2"
          resolved "https://registry.yarnpkg.com/estree-walker/-/estree-walker-2.0.2.tgz#52f010178c2a4c117a7757cfe942adb7d2da4cac"
          integrity sha512-Rfkk/Mp/DL7JVje3u18FxFujQlTNR2q6QfMSMB7AvCBx91NGj/ba3kCfza0f6dVDbw7YlRf/nDrn7pQrCCyQ/w==
        
        fast-glob@^3.2.7:
          version "3.2.7"
          resolved "https://registry.yarnpkg.com/fast-glob/-/fast-glob-3.2.7.tgz#fd6cb7a2d7e9aa7a7846111e85a196d6b2f766a1"
          integrity sha512-rYGMRwip6lUMvYD3BTScMwT1HtAs2d71SMv66Vrxs0IekGZEjhM0pcMfjQPnknBt2zeCwQMEupiN02ZP4DiT1Q==
          dependencies:
            "@nodelib/fs.stat" "^2.0.2"
            "@nodelib/fs.walk" "^1.2.3"
            glob-parent "^5.1.2"
            merge2 "^1.3.0"
            micromatch "^4.0.4"
        
        fastq@^1.6.0:
          version "1.11.0"
          resolved "https://registry.yarnpkg.com/fastq/-/fastq-1.11.0.tgz#bb9fb955a07130a918eb63c1f5161cc32a5d0858"
          integrity sha512-7Eczs8gIPDrVzT+EksYBcupqMyxSHXXrHOLRRxU2/DicV8789MRBRR8+Hc2uWzUupOs4YS4JzBmBxjjCVBxD/g==
          dependencies:
            reusify "^1.0.4"
        
        fill-range@^7.0.1:
          version "7.0.1"
          resolved "https://registry.yarnpkg.com/fill-range/-/fill-range-7.0.1.tgz#1919a6a7c75fe38b2c7c77e5198535da9acdda40"
          integrity sha512-qOo9F+dMUmC2Lcb4BbVvnKJxTPjCm+RRpe4gDuGrzkL7mEVl/djYSu2OdQ2Pa302N4oqkSg9ir6jaLWJ2USVpQ==
          dependencies:
            to-regex-range "^5.0.1"
        
        fsevents@~2.3.1, fsevents@~2.3.2:
          version "2.3.2"
          resolved "https://registry.yarnpkg.com/fsevents/-/fsevents-2.3.2.tgz#8a526f78b8fdf4623b709e0b975c52c24c02fd1a"
          integrity sha512-xiqMQR4xAeHTuB9uWm+fFRcIOgKBMiOBP+eXiyT7jsgVCq1bkVygt00oASowB7EdtpOHaaPgKt812P9ab+DDKA==
        
        function-bind@^1.1.1:
          version "1.1.1"
          resolved "https://registry.yarnpkg.com/function-bind/-/function-bind-1.1.1.tgz#a56899d3ea3c9bab874bb9773b7c5ede92f4895d"
          integrity sha512-yIovAzMX49sF8Yl58fSCWJ5svSLuaibPxXQJFLmBObTuCr0Mf1KiPopGM9NiFjiYBCbfaa2Fh6breQ6ANVTI0A==
        
        generic-names@^2.0.1:
          version "2.0.1"
          resolved "https://registry.yarnpkg.com/generic-names/-/generic-names-2.0.1.tgz#f8a378ead2ccaa7a34f0317b05554832ae41b872"
          integrity sha512-kPCHWa1m9wGG/OwQpeweTwM/PYiQLrUIxXbt/P4Nic3LbGjCP0YwrALHW1uNLKZ0LIMg+RF+XRlj2ekT9ZlZAQ==
          dependencies:
            loader-utils "^1.1.0"
        
        glob-parent@^5.1.2, glob-parent@~5.1.2:
          version "5.1.2"
          resolved "https://registry.yarnpkg.com/glob-parent/-/glob-parent-5.1.2.tgz#869832c58034fe68a4093c17dc15e8340d8401c4"
          integrity sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==
          dependencies:
            is-glob "^4.0.1"
        
        has@^1.0.3:
          version "1.0.3"
          resolved "https://registry.yarnpkg.com/has/-/has-1.0.3.tgz#722d7cbfc1f6aa8241f16dd814e011e1f41e8796"
          integrity sha512-f2dvO0VU6Oej7RkWJGrehjbzMAjFp5/VKPp5tTpWIV4JHHZK1/BxbFRtf/siA2SWTe09caDmVtYYzWEIbBS4zw==
          dependencies:
            function-bind "^1.1.1"
        
        hash-sum@^2.0.0:
          version "2.0.0"
          resolved "https://registry.yarnpkg.com/hash-sum/-/hash-sum-2.0.0.tgz#81d01bb5de8ea4a214ad5d6ead1b523460b0b45a"
          integrity sha512-WdZTbAByD+pHfl/g9QSsBIIwy8IT+EsPiKDs0KNX+zSHhdDLFKdZu0BQHljvO+0QI/BasbMSUa8wYNCZTvhslg==
        
        icss-replace-symbols@^1.1.0:
          version "1.1.0"
          resolved "https://registry.yarnpkg.com/icss-replace-symbols/-/icss-replace-symbols-1.1.0.tgz#06ea6f83679a7749e386cfe1fe812ae5db223ded"
          integrity sha1-Bupvg2ead0njhs/h/oEq5dsiPe0=
        
        icss-utils@^5.0.0:
          version "5.1.0"
          resolved "https://registry.yarnpkg.com/icss-utils/-/icss-utils-5.1.0.tgz#c6be6858abd013d768e98366ae47e25d5887b1ae"
          integrity sha512-soFhflCVWLfRNOPU3iv5Z9VUdT44xFRbzjLsEzSr5AQmgqPMTHdU3PMT1Cf1ssx8fLNJDA1juftYl+PUcv3MqA==
        
        import-meta-resolve@^1.1.1:
          version "1.1.1"
          resolved "https://registry.yarnpkg.com/import-meta-resolve/-/import-meta-resolve-1.1.1.tgz#244fd542fd1fae73550d4f8b3cde3bba1d7b2b18"
          integrity sha512-JiTuIvVyPaUg11eTrNDx5bgQ/yMKMZffc7YSjvQeSMXy58DO2SQ8BtAf3xteZvmzvjYh14wnqNjL8XVeDy2o9A==
          dependencies:
            builtins "^4.0.0"
        
        indexes-of@^1.0.1:
          version "1.0.1"
          resolved "https://registry.yarnpkg.com/indexes-of/-/indexes-of-1.0.1.tgz#f30f716c8e2bd346c7b67d3df3915566a7c05607"
          integrity sha1-8w9xbI4r00bHtn0985FVZqfAVgc=
        
        is-binary-path@~2.1.0:
          version "2.1.0"
          resolved "https://registry.yarnpkg.com/is-binary-path/-/is-binary-path-2.1.0.tgz#ea1f7f3b80f064236e83470f86c09c254fb45b09"
          integrity sha512-ZMERYes6pDydyuGidse7OsHxtbI7WVeUEozgR/g7rd0xUimYNlvZRE/K2MgZTjWy725IfelLeVcEM97mmtRGXw==
          dependencies:
            binary-extensions "^2.0.0"
        
        is-core-module@^2.2.0:
          version "2.2.0"
          resolved "https://registry.yarnpkg.com/is-core-module/-/is-core-module-2.2.0.tgz#97037ef3d52224d85163f5597b2b63d9afed981a"
          integrity sha512-XRAfAdyyY5F5cOXn7hYQDqh2Xmii+DEfIcQGxK/uNwMHhIkPWO0g8msXcbzLe+MpGoR951MlqM/2iIlU4vKDdQ==
          dependencies:
            has "^1.0.3"
        
        is-extglob@^2.1.1:
          version "2.1.1"
          resolved "https://registry.yarnpkg.com/is-extglob/-/is-extglob-2.1.1.tgz#a88c02535791f02ed37c76a1b9ea9773c833f8c2"
          integrity sha1-qIwCU1eR8C7TfHahueqXc8gz+MI=
        
        is-glob@^4.0.1, is-glob@~4.0.1:
          version "4.0.1"
          resolved "https://registry.yarnpkg.com/is-glob/-/is-glob-4.0.1.tgz#7567dbe9f2f5e2467bc77ab83c4a29482407a5dc"
          integrity sha512-5G0tKtBTFImOqDnLB2hG6Bp2qcKEFduo4tZu9MT/H6NQv/ghhy30o55ufafxJ/LdH79LLs2Kfrn85TLKyA7BUg==
          dependencies:
            is-extglob "^2.1.1"
        
        is-number@^7.0.0:
          version "7.0.0"
          resolved "https://registry.yarnpkg.com/is-number/-/is-number-7.0.0.tgz#7535345b896734d5f80c4d06c50955527a14f12b"
          integrity sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==
        
        json5@^1.0.1:
          version "1.0.1"
          resolved "https://registry.yarnpkg.com/json5/-/json5-1.0.1.tgz#779fb0018604fa854eacbf6252180d83543e3dbe"
          integrity sha512-aKS4WQjPenRxiQsC93MNfjx+nbF4PAdYzmd/1JIj8HYzqfbu86beTuNgXDzPknWk0n0uARlyewZo4s++ES36Ow==
          dependencies:
            minimist "^1.2.0"
        
        loader-utils@^1.1.0:
          version "1.4.0"
          resolved "https://registry.yarnpkg.com/loader-utils/-/loader-utils-1.4.0.tgz#c579b5e34cb34b1a74edc6c1fb36bfa371d5a613"
          integrity sha512-qH0WSMBtn/oHuwjy/NucEgbx5dbxxnxup9s4PVXJUDHZBQY+s0NWA9rJf53RBnQZxfch7euUui7hpoAPvALZdA==
          dependencies:
            big.js "^5.2.2"
            emojis-list "^3.0.0"
            json5 "^1.0.1"
        
        local-pkg@^0.1.0:
          version "0.1.0"
          resolved "https://registry.yarnpkg.com/local-pkg/-/local-pkg-0.1.0.tgz#7422b2ae8fc1e3b9ef2f132b0a0e92d879df52ef"
          integrity sha512-WsR2tHvRGIxcC2clC30ECb5fjywzsjQagaHIy1+ykZaHz0ByoB0OL2riHqIYA5YYnensRXLszwbzHkhKzehZDg==
          dependencies:
            mlly "^0.2.2"
        
        lodash.camelcase@^4.3.0:
          version "4.3.0"
          resolved "https://registry.yarnpkg.com/lodash.camelcase/-/lodash.camelcase-4.3.0.tgz#b28aa6288a2b9fc651035c7711f65ab6190331a6"
          integrity sha1-soqmKIorn8ZRA1x3EfZathkDMaY=
        
        lodash@^4.17.19, lodash@^4.17.21:
          version "4.17.21"
          resolved "https://registry.yarnpkg.com/lodash/-/lodash-4.17.21.tgz#679591c564c3bffaae8454cf0b3df370c3d6911c"
          integrity sha512-v2kDEe57lecTulaDIuNTPy3Ry4gLGJ6Z1O3vE1krgXZNrsQ+LFTGHVxVjcXPs17LhbZVGedAJv8XZ1tvj5FvSg==
        
        lru-cache@^5.1.1:
          version "5.1.1"
          resolved "https://registry.yarnpkg.com/lru-cache/-/lru-cache-5.1.1.tgz#1da27e6710271947695daf6848e847f01d84b920"
          integrity sha512-KpNARQA3Iwv+jTA0utUVVbrh+Jlrr1Fv0e56GGzAFOXN7dk/FviaDW8LHmK52DlcH4WP2n6gI8vN1aesBFgo9w==
          dependencies:
            yallist "^3.0.2"
        
        lru-cache@^6.0.0:
          version "6.0.0"
          resolved "https://registry.yarnpkg.com/lru-cache/-/lru-cache-6.0.0.tgz#6d6fe6570ebd96aaf90fcad1dafa3b2566db3a94"
          integrity sha512-Jo6dJ04CmSjuznwJSS3pUeWmd/H0ffTlkXXgwZi+eq1UCmqQwCh+eLsYOYCwY991i2Fah4h1BEMCx4qThGbsiA==
          dependencies:
            yallist "^4.0.0"
        
        magic-string@^0.25.7:
          version "0.25.7"
          resolved "https://registry.yarnpkg.com/magic-string/-/magic-string-0.25.7.tgz#3f497d6fd34c669c6798dcb821f2ef31f5445051"
          integrity sha512-4CrMT5DOHTDk4HYDlzmwu4FVCcIYI8gauveasrdCu2IKIFOJ3f0v/8MDGJCDL9oD2ppz/Av1b0Nj345H9M+XIA==
          dependencies:
            sourcemap-codec "^1.4.4"
        
        memoize-one@^5.2.1:
          version "5.2.1"
          resolved "https://registry.yarnpkg.com/memoize-one/-/memoize-one-5.2.1.tgz#8337aa3c4335581839ec01c3d594090cebe8f00e"
          integrity sha512-zYiwtZUcYyXKo/np96AGZAckk+FWWsUdJ3cHGGmld7+AhvcWmQyGCYUh1hc4Q/pkOhb65dQR/pqCyK0cOaHz4Q==
        
        merge-source-map@^1.1.0:
          version "1.1.0"
          resolved "https://registry.yarnpkg.com/merge-source-map/-/merge-source-map-1.1.0.tgz#2fdde7e6020939f70906a68f2d7ae685e4c8c646"
          integrity sha512-Qkcp7P2ygktpMPh2mCQZaf3jhN6D3Z/qVZHSdWvQ+2Ef5HgRAPBO57A77+ENm0CPx2+1Ce/MYKi3ymqdfuqibw==
          dependencies:
            source-map "^0.6.1"
        
        merge2@^1.3.0:
          version "1.4.1"
          resolved "https://registry.yarnpkg.com/merge2/-/merge2-1.4.1.tgz#4368892f885e907455a6fd7dc55c0c9d404990ae"
          integrity sha512-8q7VEgMJW4J8tcfVPy8g09NcQwZdbwFEqhe/WZkoIzjn/3TGDwtOCYtXGxA3O8tPzpczCCDgv+P2P5y00ZJOOg==
        
        micromatch@^4.0.4:
          version "4.0.4"
          resolved "https://registry.yarnpkg.com/micromatch/-/micromatch-4.0.4.tgz#896d519dfe9db25fce94ceb7a500919bf881ebf9"
          integrity sha512-pRmzw/XUcwXGpD9aI9q/0XOwLNygjETJ8y0ao0wdqprrzDa4YnxLcz7fQRZr8voh8V10kGhABbNcHVk5wHgWwg==
          dependencies:
            braces "^3.0.1"
            picomatch "^2.2.3"
        
        minimatch@^3.0.4:
          version "3.0.4"
          resolved "https://registry.yarnpkg.com/minimatch/-/minimatch-3.0.4.tgz#5166e286457f03306064be5497e8dbb0c3d32083"
          integrity sha512-yJHVQEhyqPLUTgt9B83PXu6W3rx4MvvHvSUvToogpwoGDOUQ+yDrR0HRot+yOCdCO7u4hX3pWft6kWBBcqh0UA==
          dependencies:
            brace-expansion "^1.1.7"
        
        minimist@^1.2.0:
          version "1.2.5"
          resolved "https://registry.yarnpkg.com/minimist/-/minimist-1.2.5.tgz#67d66014b66a6a8aaa0c083c5fd58df4e4e97602"
          integrity sha512-FM9nNUYrRBAELZQT3xeZQ7fmMOBg6nWNmJKTcgsJeaLstP/UODVpGsr5OhXhhXg6f+qtJ8uiZ+PUxkDWcgIXLw==
        
        mlly@^0.2.2:
          version "0.2.10"
          resolved "https://registry.yarnpkg.com/mlly/-/mlly-0.2.10.tgz#645902c9761dc6b5ded174b8e717147fe52e4893"
          integrity sha512-xfyW6c2QBGArtctzNnTV5leOKX8nOMz2simeubtXofdsdSJFSNw+Ncvrs8kxcN3pBrQLXuYBHNFV6NgZ5Ryf4A==
          dependencies:
            import-meta-resolve "^1.1.1"
        
        ms@2.1.2:
          version "2.1.2"
          resolved "https://registry.yarnpkg.com/ms/-/ms-2.1.2.tgz#d09d1f357b443f493382a8eb3ccd183872ae6009"
          integrity sha512-sGkPx+VjMtmA6MX27oA4FBFELFCZZ4S4XqeGOXCv68tT+jb3vk/RyaKWP0PTKyWtmLSM0b+adUTEvbs1PEaH2w==
        
        nanoid@^3.1.20:
          version "3.1.20"
          resolved "https://registry.yarnpkg.com/nanoid/-/nanoid-3.1.20.tgz#badc263c6b1dcf14b71efaa85f6ab4c1d6cfc788"
          integrity sha512-a1cQNyczgKbLX9jwbS/+d7W8fX/RfgYR7lVWwWOGIPNgK2m0MWvrGF6/m4kk6U3QcFMnZf3RIhL0v2Jgh/0Uxw==
        
        normalize-path@^3.0.0, normalize-path@~3.0.0:
          version "3.0.0"
          resolved "https://registry.yarnpkg.com/normalize-path/-/normalize-path-3.0.0.tgz#0dcd69ff23a1c9b11fd0978316644a0388216a65"
          integrity sha512-6eZs5Ls3WtCisHWp9S2GUy8dqkpGi4BVSz3GaqiE6ezub0512ESztXUwUB6C6IKbQkY2Pnb/mD4WYojCRwcwLA==
        
        normalize-wheel-es@^1.1.0:
          version "1.1.0"
          resolved "https://registry.yarnpkg.com/normalize-wheel-es/-/normalize-wheel-es-1.1.0.tgz#db017af1dd5d4c6222c07ae38bc224049d25861e"
          integrity sha512-gkcE5xzp8WkSGgu2HItXePGyh3qDOetgPYg0RnjclOIaWTCMB75NTrk0t6KVlbm6ShSikV3ykBFZMiR9GDkvkA==
        
        path-parse@^1.0.6:
          version "1.0.6"
          resolved "https://registry.yarnpkg.com/path-parse/-/path-parse-1.0.6.tgz#d62dbb5679405d72c4737ec58600e9ddcf06d24c"
          integrity sha512-GSmOT2EbHrINBf9SR7CDELwlJ8AENk3Qn7OikK4nFYAu3Ote2+JYNVvkpAEQm3/TLNEJFD/xZJjzyxg3KBWOzw==
        
        picomatch@^2.0.4, picomatch@^2.2.1, picomatch@^2.2.2, picomatch@^2.2.3:
          version "2.3.0"
          resolved "https://registry.yarnpkg.com/picomatch/-/picomatch-2.3.0.tgz#f1f061de8f6a4bf022892e2d128234fb98302972"
          integrity sha512-lY1Q/PiJGC2zOv/z391WOTD+Z02bCgsFfvxoXXf6h7kv9o+WmsmzYqrAwY63sNgOxE4xEdq0WyUnXfKeBrSvYw==
        
        postcss-modules-extract-imports@^3.0.0:
          version "3.0.0"
          resolved "https://registry.yarnpkg.com/postcss-modules-extract-imports/-/postcss-modules-extract-imports-3.0.0.tgz#cda1f047c0ae80c97dbe28c3e76a43b88025741d"
          integrity sha512-bdHleFnP3kZ4NYDhuGlVK+CMrQ/pqUm8bx/oGL93K6gVwiclvX5x0n76fYMKuIGKzlABOy13zsvqjb0f92TEXw==
        
        postcss-modules-local-by-default@^4.0.0:
          version "4.0.0"
          resolved "https://registry.yarnpkg.com/postcss-modules-local-by-default/-/postcss-modules-local-by-default-4.0.0.tgz#ebbb54fae1598eecfdf691a02b3ff3b390a5a51c"
          integrity sha512-sT7ihtmGSF9yhm6ggikHdV0hlziDTX7oFoXtuVWeDd3hHObNkcHRo9V3yg7vCAY7cONyxJC/XXCmmiHHcvX7bQ==
          dependencies:
            icss-utils "^5.0.0"
            postcss-selector-parser "^6.0.2"
            postcss-value-parser "^4.1.0"
        
        postcss-modules-scope@^3.0.0:
          version "3.0.0"
          resolved "https://registry.yarnpkg.com/postcss-modules-scope/-/postcss-modules-scope-3.0.0.tgz#9ef3151456d3bbfa120ca44898dfca6f2fa01f06"
          integrity sha512-hncihwFA2yPath8oZ15PZqvWGkWf+XUfQgUGamS4LqoP1anQLOsOJw0vr7J7IwLpoY9fatA2qiGUGmuZL0Iqlg==
          dependencies:
            postcss-selector-parser "^6.0.4"
        
        postcss-modules-values@^4.0.0:
          version "4.0.0"
          resolved "https://registry.yarnpkg.com/postcss-modules-values/-/postcss-modules-values-4.0.0.tgz#d7c5e7e68c3bb3c9b27cbf48ca0bb3ffb4602c9c"
          integrity sha512-RDxHkAiEGI78gS2ofyvCsu7iycRv7oqw5xMWn9iMoR0N/7mf9D50ecQqUo5BZ9Zh2vH4bCUR/ktCqbB9m8vJjQ==
          dependencies:
            icss-utils "^5.0.0"
        
        postcss-modules@^4.0.0:
          version "4.0.0"
          resolved "https://registry.yarnpkg.com/postcss-modules/-/postcss-modules-4.0.0.tgz#2bc7f276ab88f3f1b0fadf6cbd7772d43b5f3b9b"
          integrity sha512-ghS/ovDzDqARm4Zj6L2ntadjyQMoyJmi0JkLlYtH2QFLrvNlxH5OAVRPWPeKilB0pY7SbuhO173KOWkPAxRJcw==
          dependencies:
            generic-names "^2.0.1"
            icss-replace-symbols "^1.1.0"
            lodash.camelcase "^4.3.0"
            postcss-modules-extract-imports "^3.0.0"
            postcss-modules-local-by-default "^4.0.0"
            postcss-modules-scope "^3.0.0"
            postcss-modules-values "^4.0.0"
            string-hash "^1.1.1"
        
        postcss-selector-parser@^6.0.2, postcss-selector-parser@^6.0.4:
          version "6.0.4"
          resolved "https://registry.yarnpkg.com/postcss-selector-parser/-/postcss-selector-parser-6.0.4.tgz#56075a1380a04604c38b063ea7767a129af5c2b3"
          integrity sha512-gjMeXBempyInaBqpp8gODmwZ52WaYsVOsfr4L4lDQ7n3ncD6mEyySiDtgzCT+NYC0mmeOLvtsF8iaEf0YT6dBw==
          dependencies:
            cssesc "^3.0.0"
            indexes-of "^1.0.1"
            uniq "^1.0.1"
            util-deprecate "^1.0.2"
        
        postcss-value-parser@^4.1.0:
          version "4.1.0"
          resolved "https://registry.yarnpkg.com/postcss-value-parser/-/postcss-value-parser-4.1.0.tgz#443f6a20ced6481a2bda4fa8532a6e55d789a2cb"
          integrity sha512-97DXOFbQJhk71ne5/Mt6cOu6yxsSfM0QGQyl0L25Gca4yGWEGJaig7l7gbCX623VqTBNGLRLaVUCnNkcedlRSQ==
        
        postcss@^8.1.10, postcss@^8.2.1:
          version "8.2.7"
          resolved "https://registry.yarnpkg.com/postcss/-/postcss-8.2.7.tgz#48ed8d88b4de10afa0dfd1c3f840aa57b55c4d47"
          integrity sha512-DsVLH3xJzut+VT+rYr0mtvOtpTjSyqDwPf5EZWXcb0uAKfitGpTY9Ec+afi2+TgdN8rWS9Cs88UDYehKo/RvOw==
          dependencies:
            colorette "^1.2.2"
            nanoid "^3.1.20"
            source-map "^0.6.1"
        
        queue-microtask@^1.2.2:
          version "1.2.3"
          resolved "https://registry.yarnpkg.com/queue-microtask/-/queue-microtask-1.2.3.tgz#4929228bbc724dfac43e0efb058caf7b6cfb6243"
          integrity sha512-NuaNSa6flKT5JaSYQzJok04JzTL1CA6aGhv5rfLW3PgqA+M2ChpZQnAC8h8i4ZFkBS8X5RqkDBHA7r4hej3K9A==
        
        readdirp@~3.6.0:
          version "3.6.0"
          resolved "https://registry.yarnpkg.com/readdirp/-/readdirp-3.6.0.tgz#74a370bd857116e245b29cc97340cd431a02a6c7"
          integrity sha512-hOS089on8RduqdbhvQ5Z37A0ESjsqz6qnRcffsMU3495FuTdqSm+7bhJ29JvIOsBDEEnan5DPu9t3To9VRlMzA==
          dependencies:
            picomatch "^2.2.1"
        
        resize-observer-polyfill@^1.5.1:
          version "1.5.1"
          resolved "https://registry.yarnpkg.com/resize-observer-polyfill/-/resize-observer-polyfill-1.5.1.tgz#0e9020dd3d21024458d4ebd27e23e40269810464"
          integrity sha512-LwZrotdHOo12nQuZlHEmtuXdqGoOD0OhaxopaNFxWzInpEgaLWoVuAMbTzixuosCx2nEG58ngzW3vxdWoxIgdg==
        
        resolve@^1.19.0, resolve@^1.20.0:
          version "1.20.0"
          resolved "https://registry.yarnpkg.com/resolve/-/resolve-1.20.0.tgz#629a013fb3f70755d6f0b7935cc1c2c5378b1975"
          integrity sha512-wENBPt4ySzg4ybFQW2TT1zMQucPK95HSh/nq2CFTZVOGut2+pQvSsgtda4d26YrYcr067wjbmzOG8byDPBX63A==
          dependencies:
            is-core-module "^2.2.0"
            path-parse "^1.0.6"
        
        reusify@^1.0.4:
          version "1.0.4"
          resolved "https://registry.yarnpkg.com/reusify/-/reusify-1.0.4.tgz#90da382b1e126efc02146e90845a88db12925d76"
          integrity sha512-U9nH88a3fc/ekCF1l0/UP1IosiuIjyTh7hBvXVMHYgVcfGvt897Xguj2UOLDeI5BG2m7/uwyaLVT6fbtCwTyzw==
        
        rollup@^2.38.5:
          version "2.41.0"
          resolved "https://registry.yarnpkg.com/rollup/-/rollup-2.41.0.tgz#b2a398bbabbf227738dedaef099e494aed468982"
          integrity sha512-Gk76XHTggulWPH95q8V62bw6uqDH6UGvbD6LOa3QUyhuMF3eOuaeDHR7SLm1T9faitkpNrqzUAVYx47klcMnlA==
          optionalDependencies:
            fsevents "~2.3.1"
        
        run-parallel@^1.1.9:
          version "1.2.0"
          resolved "https://registry.yarnpkg.com/run-parallel/-/run-parallel-1.2.0.tgz#66d1368da7bdf921eb9d95bd1a9229e7f21a43ee"
          integrity sha512-5l4VyZR86LZ/lDxZTR6jqL8AFE2S0IFLMP26AbjsLVADxHdhB/c0GUsH+y39UfCi3dzz8OlQuPmnaJOMoDHQBA==
          dependencies:
            queue-microtask "^1.2.2"
        
        semver@^7.0.0:
          version "7.3.5"
          resolved "https://registry.yarnpkg.com/semver/-/semver-7.3.5.tgz#0b621c879348d8998e4b0e4be94b3f12e6018ef7"
          integrity sha512-PoeGJYh8HK4BTO/a9Tf6ZG3veo/A7ZVsYrSA6J8ny9nb3B1VrpkuN+z9OE5wfE5p6H4LchYZsegiQgbJD94ZFQ==
          dependencies:
            lru-cache "^6.0.0"
        
        source-map@^0.6.1:
          version "0.6.1"
          resolved "https://registry.yarnpkg.com/source-map/-/source-map-0.6.1.tgz#74722af32e9614e9c287a8d0bbde48b5e2f1a263"
          integrity sha512-UjgapumWlbMhkBgzT7Ykc5YXUT46F0iKu8SGXq0bcwP5dz/h0Plj6enJqjz1Zbq2l5WaqYnrVbwWOWMyF3F47g==
        
        sourcemap-codec@^1.4.4:
          version "1.4.8"
          resolved "https://registry.yarnpkg.com/sourcemap-codec/-/sourcemap-codec-1.4.8.tgz#ea804bd94857402e6992d05a38ef1ae35a9ab4c4"
          integrity sha512-9NykojV5Uih4lgo5So5dtw+f0JgJX30KCNI8gwhz2J9A15wD0Ml6tjHKwf6fTSa6fAdVBdZeNOs9eJ71qCk8vA==
        
        string-hash@^1.1.1:
          version "1.1.3"
          resolved "https://registry.yarnpkg.com/string-hash/-/string-hash-1.1.3.tgz#e8aafc0ac1855b4666929ed7dd1275df5d6c811b"
          integrity sha1-6Kr8CsGFW0Zmkp7X3RJ1311sgRs=
        
        to-fast-properties@^2.0.0:
          version "2.0.0"
          resolved "https://registry.yarnpkg.com/to-fast-properties/-/to-fast-properties-2.0.0.tgz#dc5e698cbd079265bc73e0377681a4e4e83f616e"
          integrity sha1-3F5pjL0HkmW8c+A3doGk5Og/YW4=
        
        to-regex-range@^5.0.1:
          version "5.0.1"
          resolved "https://registry.yarnpkg.com/to-regex-range/-/to-regex-range-5.0.1.tgz#1648c44aae7c8d988a326018ed72f5b4dd0392e4"
          integrity sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==
          dependencies:
            is-number "^7.0.0"
        
        typescript@4.4.4:
          version "4.4.4"
          resolved "https://registry.yarnpkg.com/typescript/-/typescript-4.4.4.tgz#2cd01a1a1f160704d3101fd5a58ff0f9fcb8030c"
          integrity sha512-DqGhF5IKoBl8WNf8C1gu8q0xZSInh9j1kJJMqT3a94w1JzVaBU4EXOSMrz9yDqMT0xt3selp83fuFMQ0uzv6qA==
        
        uniq@^1.0.1:
          version "1.0.1"
          resolved "https://registry.yarnpkg.com/uniq/-/uniq-1.0.1.tgz#b31c5ae8254844a3a8281541ce2b04b865a734ff"
          integrity sha1-sxxa6CVIRKOoKBVBzisEuGWnNP8=
        
        unplugin-vue-components@0.16.0:
          version "0.16.0"
          resolved "https://registry.yarnpkg.com/unplugin-vue-components/-/unplugin-vue-components-0.16.0.tgz#15a5d5d03ad658ae0202523811ec76150776569d"
          integrity sha512-BM/5p6/btLgDjUxf290cKbzbaGow95NFibhp+TSQhL0wyb1Q6sP0nmlqOvGnpLANFq0+urXxXDloMLlTJH6Fww==
          dependencies:
            "@antfu/utils" "^0.3.0"
            "@rollup/pluginutils" "^4.1.1"
            chokidar "^3.5.2"
            debug "^4.3.2"
            fast-glob "^3.2.7"
            local-pkg "^0.1.0"
            magic-string "^0.25.7"
            minimatch "^3.0.4"
            resolve "^1.20.0"
            unplugin "^0.2.13"
        
        unplugin@^0.2.13:
          version "0.2.16"
          resolved "https://registry.yarnpkg.com/unplugin/-/unplugin-0.2.16.tgz#6f34e9f5068ca3ec92a36b016f47b5ad8bb875ca"
          integrity sha512-KkXatHba0baJszSHW+2e8EQU/5Bz7rYwzYXu8wUeq97tE6K3wvub+7OWSuRv04LttvzNLsJ2jXEyR35gofv74Q==
          dependencies:
            webpack-virtual-modules "^0.4.3"
        
        util-deprecate@^1.0.2:
          version "1.0.2"
          resolved "https://registry.yarnpkg.com/util-deprecate/-/util-deprecate-1.0.2.tgz#450d4dc9fa70de732762fbd2d4a28981419a0ccf"
          integrity sha1-RQ1Nyfpw3nMnYvvS1KKJgUGaDM8=
        
        vite@^2.0.5:
          version "2.0.5"
          resolved "https://registry.yarnpkg.com/vite/-/vite-2.0.5.tgz#ac46857a3fa8686d077921e61bd48a986931df1d"
          integrity sha512-QTgEDbq1WsTtr6j+++ewjhBFEk6c8v0xz4fb/OWJQKNYU8ZZtphOshwOqAlnarSstPBtWCBR0tsugXx6ajfoUg==
          dependencies:
            esbuild "^0.8.52"
            postcss "^8.2.1"
            resolve "^1.19.0"
            rollup "^2.38.5"
          optionalDependencies:
            fsevents "~2.3.1"
        
        vue-demi@*:
          version "0.11.4"
          resolved "https://registry.yarnpkg.com/vue-demi/-/vue-demi-0.11.4.tgz#6101992fe4724cf5634018a16e953f3052e94e2a"
          integrity sha512-/3xFwzSykLW2HiiLie43a+FFgNOcokbBJ+fzvFXd0r2T8MYohqvphUyDQ8lbAwzQ3Dlcrb1c9ykifGkhSIAk6A==
        
        vue@3.2.20:
          version "3.2.20"
          resolved "https://registry.yarnpkg.com/vue/-/vue-3.2.20.tgz#940f8aa8bf3e3be78243ca582bad41fcd45ae3e6"
          integrity sha512-81JjEP4OGk9oO8+CU0h2nFPGgJBm9mNa3kdCX2k6FuRdrWrC+CNe+tOnuIeTg8EWwQuI+wwdra5Q7vSzp7p4Iw==
          dependencies:
            "@vue/compiler-dom" "3.2.20"
            "@vue/compiler-sfc" "3.2.20"
            "@vue/runtime-dom" "3.2.20"
            "@vue/server-renderer" "3.2.20"
            "@vue/shared" "3.2.20"
        
        webpack-virtual-modules@^0.4.3:
          version "0.4.3"
          resolved "https://registry.yarnpkg.com/webpack-virtual-modules/-/webpack-virtual-modules-0.4.3.tgz#cd597c6d51d5a5ecb473eea1983a58fa8a17ded9"
          integrity sha512-5NUqC2JquIL2pBAAo/VfBP6KuGkHIZQXW/lNKupLPfhViwh8wNsu0BObtl09yuKZszeEUfbXz8xhrHvSG16Nqw==
        
        yallist@^3.0.2:
          version "3.1.1"
          resolved "https://registry.yarnpkg.com/yallist/-/yallist-3.1.1.tgz#dbb7daf9bfd8bac9ab45ebf602b8cbad0d5d08fd"
          integrity sha512-a4UGQaWPH59mOXUYnAG2ewncQS4i4F43Tv3JoAM+s2VDAmS9NsK8GpDMLrCHPksFT7h3K6TOoUNn2pb7RoXx4g==
        
        yallist@^4.0.0:
          version "4.0.0"
          resolved "https://registry.yarnpkg.com/yallist/-/yallist-4.0.0.tgz#9bb92790d9c0effec63be73519e11a35019a3a72"
          integrity sha512-3wdGidZyq5PB084XLES5TpOSRA3wjXAlIWMhum2kRcv/41Sn2emQ0dycQW4uZXLejwKvg6EsvbdlVL+FYEct7A==
        `,
      },
    },
  });
  return parameters;
}
