<template>
  <span :title="timestamp | longDate">{{timestamp | diffDate}}</span>
  <!-- no whitespace to avoid spaces in html render -->
</template>

<script>
import moment from "moment";
export default {
  props: {
    timestamp: {
      required: true,
      type: Number
    }
  },
  filters: {
    longDate(date) {
      return moment.unix(date).format("MMMM Do YYYY, h:mm:ss a");
    },
    diffDate(date) {
      return moment.unix(date).fromNow();
    }
  }
};
</script>

<style>
</style>
