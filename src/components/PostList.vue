<template>
  <div class="post-list">

    <post-list-item v-for="post in posts" :post="post" :key="post['.key']" />

  </div>
</template>

<script>
import PostListItem from "./PostListItem";

export default {
  props: {
    posts: {
      required: true,
      type: Array
    }
  },
  components: {
    PostListItem
  }
};
</script>

<style>
</style>
