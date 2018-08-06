export default {
  data() {
    return {
      asyncDataStatus_ready: false // best practice to prefix the property names to avoid name conflicts
    };
  },
  methods: {
    asyncDataStatus_fetched() {
      this.asyncDataStatus_ready = true;
      this.$emit("ready");
    }
  }
};
