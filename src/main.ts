import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "./assets/main.css";
import "ant-design-vue/dist/antd.css";
import Antd from "ant-design-vue";

import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { QuillEditor } from "@vueup/vue-quill";

const app = createApp(App);

app.component("QuillEditor", QuillEditor);
app.use(Antd);
app.use(router);

app.mount("#app");
