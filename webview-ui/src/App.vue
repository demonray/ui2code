<script setup lang="ts">
import {
    vscode
} from "./utilities/vscode";


function handleHowdyClick() {
    vscode.postMessage({
        command: "hello",
        text: "Hey there partner! 🤠",
    });
}

/**
 * json 数据转换成代码
 */
function json2Code(json = {}, uiComponnetType = 'elementui') {
    json = {
        "fields": [{
            "label": "单行文本",
            "type": "input",
            "bbox": []
        }]
    }
    console.log(json)
}
</script>

<template>
  <main>
    <h1>Hello world!</h1>   
    <el-button>I am ElButton</el-button>
  </main>
</template>

<style>
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
}

main > * {
  margin: 1rem 0;
}
</style>
