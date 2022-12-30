<script setup lang="ts">
import {
    vscode
} from "./utilities/vscode";
import { computed } from "vue";
import Editor from './Editor.vue';

function handleHowdyClick() {
    vscode.postMessage({
        command: "hello",
        text: "Hey there partner! 🤠",
    });
}
const json = {
    "fields": [{
        "label": "单行文本",
        "type": "input",
        "bbox": []
    }]
}
const jsonText = computed(()=>{
    return JSON.stringify(json)
})
/**
 * json 数据转换成代码
 */
function json2Code(json = {}, uiComponnetType = 'elementui') {
    
    console.log(json)
}
</script>

<template>
  <main>
    <h1>Hello world!</h1>   
    <el-button>I am ElButton</el-button>
    <Editor :value="jsonText"/>
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
