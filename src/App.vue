<template>
  <div id="app">
    <TheNavBar/>
    <div class="container">
      <!--  can't use v-if as the component will not render and the compnent code will not run -->
      <router-view v-show="showPage" @ready='pageReady' />
      <app-spinner v-show="!showPage" class="push-top" />
    </div>
  </div>
</template>

<script>
import TheNavBar from "@/components/TheNavBar";
import AppSpinner from "@/components/AppSpinner";
import NProgress from "nprogress"; // minimlaist progress bar

export default {
  data() {
    return {
      showPage: false
    };
  },
  components: {
    TheNavBar,
    AppSpinner
  },
  methods: {
    // the 'ready' event sent from child components triggers this to hide the spinner
    pageReady() {
      this.showPage = true;
      NProgress.done();
    }
  },
  created() {
    NProgress.configure({
      speed: 500,
      showSpinner: false
    });
    NProgress.start();

    // set showPage to false before every page navigation
    this.$router.beforeEach((to, from, next) => {
      this.showPage = false;
      NProgress.start();
      next();
    });
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Open+Sans");
@import "assets/css/styles.css";
@import url("https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");
@import "~nprogress/nprogress.css"; /* tilda maps to node_moudles */
</style>
