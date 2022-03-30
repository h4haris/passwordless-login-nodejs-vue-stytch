import { createApp } from 'vue'
import App from './App.vue'
import './main.css'
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import router from './router'

const vm = createApp(App).use(router).use(VueToast).mount('#app')

export default vm