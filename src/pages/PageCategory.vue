<template>
  <div v-if="asyncDataStatus_ready" class="forum-wrapper">
    <div class="col-full push-top">
      <h1>{{category.name}}</h1>
    </div>

    <div class="col-full">
      <category-list-item :category="category" />
    </div>
  </div>
</template>

<script>
import CategoryListItem from "@/components/CategoryListItem";
import { mapActions } from "vuex";
import asyncDataStatus from "@/mixins/asyncDataStatus.js";

export default {
  mixins: [asyncDataStatus],
  methods: {
    ...mapActions("categories", ["fetchCategory"]),
    ...mapActions("forums", ["fetchForums"])
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  components: {
    CategoryListItem
  },
  computed: {
    category() {
      return this.$store.state.categories.items[this.id];
    }
  },
  created() {
    this.fetchCategory({ id: this.id })
      .then(category => this.fetchForums({ ids: category.forums }))
      .then(() => this.asyncDataStatus_fetched());
  }
};
</script>

<style>
.forum-wrapper {
  width: 100%;
}
</style>
