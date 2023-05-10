<template>
  <SandpackProvider
    :style="{ width: '100%', height: '100%' }"
    :files="config.files"
    :template="config.template"
    :options="config.Options.providerOptions"
  >
    <SandpackLayout style="height: 100%">
      <div class="playground-grid">
        <SandpackFileExplorer v-if="config.Components.FileExplorer" />
        <SandpackCodeEditor v-if="config.Components.Editor" v-bind="codeEditorOptions" />
        <SandpackPreview
          v-if="config.Components.Preview"
          :showNavigator="config.Options?.showNavigator"
          :showRefreshButton="config.Options?.showRefreshButton"
          :showOpenInCodeSandbox="config.Options.showOpenInCodeSandbox"
        />
        <SandpackConsole
          v-if="config.Components.Console"
          :showHeader="config.Options.consoleShowHeader"
        />
        <SandpackTests v-if="config.Components.Tests" />
      </div>
    </SandpackLayout>
  </SandpackProvider>
</template>
<script setup lang="ts">
import {
    type CodeEditorProps,
    SANDBOX_TEMPLATES,
    SandpackCodeEditor,
    SandpackFileExplorer,
    SandpackLayout,
    SandpackTests,
    SandpackPreview,
    SandpackProvider,
    SandpackConsole,
    Sandpack,
} from "sandpack-vue3";
import {
    type ComputedRef,
    computed,
    reactive,
    onMounted,
    watch,
    toRaw
} from "vue";
import DetectService from "./config/modelService";

interface Props {
    params: SandboxTemplateConfig;
}
const props = defineProps < Props > ();

const config = reactive({
    Components: {
        FileExplorer: true,
        Editor: true,
        Preview: true,
        Console: false,
        Tests: false,
    },
    files: toRaw(props.params.files),
    template: props.params.template,
    Options: {
        providerOptions: {
            bundlerTimeOut: 600000,
            // bundlerURL: DetectService.BUNDLERURL,
            // bundlerURL: 'https://2-0-17-sandpack.codesandbox.io/',
            bundlerURL: 'https://2-1-9-sandpack.codesandbox.io/',
        },
        showTabs: true,
        showLineNumbers: true,
        showInlineErrors: true,
        closableTabs: true,
        wrapContent: false,
        readOnly: false,
        showReadOnly: true,
        showConsoleButton: true,
        showConsole: true,
        showOpenInCodeSandbox: false,
        showNavigator: true,
        showRefreshButton: true,
        consoleShowHeader: false,
    },
});

watch(() => props.params, (v) => {
    config.files = toRaw(v.files)
    config.template = v.template
});

const codeEditorOptions: ComputedRef < CodeEditorProps > = computed(() => ({
    showTabs: config.Options.showTabs,
    showLineNumbers: config.Options.showLineNumbers,
    showInlineErrors: config.Options.showInlineErrors,
    wrapContent: config.Options.wrapContent,
    closableTabs: config.Options.closableTabs,
    readOnly: config.Options.readOnly,
    showReadOnly: config.Options.showReadOnly,
}));

onMounted(() => {
    window.addEventListener("message", (event) => {
        // console.log(event)
    })
});
</script>
<style scoped>
#iframe {
  width: 100%;
  height: 100%;
}

.playground-grid {
  display: flex;
  width: 100%;
  height: 100%;
}

.playground-grid .sp-file-explorer {
  flex: 1;
}

.playground-grid .sp-editor {
  flex: 2;
  max-width: 50%;
}

.playground-grid .sp-previe {
  flex: 2;
}
</style>
