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

const json = [
    {
        "x": "0.73001367",
        "y": "0.40559962",
        "w": "0.13526885",
        "h": "0.09335684",
        "prob": "0.8283823",
        "class": "button"
    },
    {
        "x": "0.23011144",
        "y": "0.4046911",
        "w": "0.14032874",
        "h": "0.09926499",
        "prob": "0.8282909",
        "class": "button"
    },
    {
        "x": "0.18785153",
        "y": "0.73002577",
        "w": "0.037325967",
        "h": "0.055918068",
        "prob": "0.735477",
        "class": "checkbox"
    },
    {
        "x": "0.33550453",
        "y": "0.729786",
        "w": "0.04292574",
        "h": "0.05701639",
        "prob": "0.660237",
        "class": "checkbox"
    },
    {
        "x": "0.20616086",
        "y": "0.908746",
        "w": "0.07129701",
        "h": "0.05521894",
        "prob": "0.5464702",
        "class": "switch"
    },
    {
        "x": "0.287422",
        "y": "0.08054652",
        "w": "0.040219646",
        "h": "0.062977",
        "prob": "0.52024114",
        "class": "checkbox"
    },
    {
        "x": "0.5678698",
        "y": "0.23956224",
        "w": "0.7835867",
        "h": "0.09822105",
        "prob": "0.5148172",
        "class": "select"
    },
    {
        "x": "0.5680048",
        "y": "0.5629138",
        "w": "0.7891068",
        "h": "0.09934762",
        "prob": "0.504775",
        "class": "select"
    },
    {
        "x": "0.21028899",
        "y": "0.9077145",
        "w": "0.073078185",
        "h": "0.06421638",
        "prob": "0.43518117",
        "class": "button"
    },
    {
        "x": "0.18510452",
        "y": "0.07711594",
        "w": "0.04010473",
        "h": "0.06945005",
        "prob": "0.42854437",
        "class": "checkbox"
    }
]
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
    <editor v-show="designStep === 1" :value="jsonText" language="json" />
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
