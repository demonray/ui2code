<script setup lang="ts">
import {
    vscode
} from "./utilities/vscode";
import {ref, computed } from "vue";
import Editor from './components/Editor.vue';
import Design from './Design.vue';

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
const designStep = ref(1)
/**
 * json 数据转换成代码
 */
function json2Code(json = {}, uiComponnetType = 'elementui') {
    console.log(json)
}
function goDesign() {
    designStep.value =  2
}
</script>

<template>
  <main>
    <el-button @click="goDesign">设计</el-button>
    <editor v-show="designStep === 1" :value="jsonText"/>
    <design v-show="designStep === 2" />
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
