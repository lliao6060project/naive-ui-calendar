import { createApp } from 'vue'
import App from '@/App.vue'
import pinia from './store';
import 'maju-ui';
import dayjs from 'dayjs'
import "@/assets/styles/global.scss";
import AppProvider from '@/components/global-component/index.vue'

const appProvider = createApp(AppProvider)
const app = createApp(App);

app.config.globalProperties.$dayjs = dayjs
app.provide('$dayjs', dayjs)

//優先掛載一下 Provider 解決路由守衛，Axios中可使用，Dialog，Message 等之類組件
appProvider.mount('#appProvider', true)

app.use(pinia);

app.mount('#app')
