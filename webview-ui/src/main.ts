import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from 'element-plus';
import draggable from "vuedraggable";
import 'element-plus/dist/index.css';
import svgIcon from "@/components/svgIcon/svgicon.vue";

const app = createApp(App)

app.use(ElementPlus);
app.component("svg-icon", svgIcon);
app.component("draggable", draggable);
app.mount('#app')