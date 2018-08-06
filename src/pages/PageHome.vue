<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>Welcome to the Forums</h1>
    <category-list :categories="categories" />
  </div>
</template>

<script>
import CategoryList from "@/components/CategoryList";
import { mapActions } from "vuex";
import asyncDataStatus from "@/mixins/asyncDataStatus.js";

export default {
  methods: {
    ...mapActions(["fetchAllCategories", "fetchForums"])
  },
  components: {
    CategoryList
  },
  mixins: [asyncDataStatus],
  computed: {
    categories() {
      return Object.values(this.$store.state.categories);
    }
  },
  created() {
    this.fetchAllCategories()
      .then(categories =>
        Promise.all(categories.map(category => this.fetchForums({ ids: Object.keys(category.forums) })))
      )
      .then(() => {
        this.asyncDataStatus_fetched();
      })
      .catch(error => console.log(error));
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
