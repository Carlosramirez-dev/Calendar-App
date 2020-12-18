import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import VueTextareaAutosize from 'vue-textarea-autosize';

import firebase from 'firebase/app';
import 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjhlNOG10kV5ZoWSJ7XMcyr1pywAgzSVU",
  authDomain: "vue-calendar-69978.firebaseapp.com",
  databaseURL: "https://vue-calendar-69978-default-rtdb.firebaseio.com",
  projectId: "vue-calendar-69978",
  storageBucket: "vue-calendar-69978.appspot.com",
  messagingSenderId: "243635367222",
  appId: "1:243635367222:web:a01ba164a6dc91291fd797"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
