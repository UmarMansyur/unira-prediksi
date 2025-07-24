import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { VueQueryPlugin  } from '@tanstack/vue-query';
import Vue3Toastify, { type ToastContainerOptions } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { createPinia } from 'pinia';


// tanstack query

createApp(App).use(router).use(VueQueryPlugin).use(createPinia())
  .use(Vue3Toastify, {
    autoClose: 3000,
    position: "top-right",
    hideProgressBar: true,
    closeOnClick: true,
    theme: "colored",
    icon: true,
    closeButton: false,
  } as ToastContainerOptions).mount('#app')
