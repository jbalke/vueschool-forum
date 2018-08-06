// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import AppDate from "@/components/AppDate";
import store from "@/store";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
import Vue from "vue";
import App from "./App";
import router from "./router";

Vue.component("AppDate", AppDate); // global component
Vue.config.productionTip = false;

// Initialize Firebase
// values set in config/prod.env.js or dev.env.js
const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
};
firebase.initializeApp(config);

// listen to auth state changes and set the auth user on login
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    store.dispatch("fetchAuthUser");
  }
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  template: "<App/>",
  components: {
    App
  }
});
