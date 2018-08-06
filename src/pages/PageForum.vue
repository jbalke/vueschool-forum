<template>
  <div v-if="asyncDataStatus_ready" class="forum-wrapper">
    <div class="col-full push-top">
      <div class="forum-header">
        <div class="forum-details">
          <h1>{{forum.name}}</h1>
          <p class="text-lead">{{forum.description}}</p>
        </div>
        <router-link class="btn-green btn-small" :to="{name: 'ThreadCreate', params: {forumId: forum['.key']}}">Start a thread</router-link>
      </div>
    </div>

    <div class="col-full push-top">
      <thread-list :threads="threads" />
    </div>
  </div>
</template>

<script>
import ThreadList from "@/components/ThreadList";
import { mapActions } from "vuex";
import asyncDataStatus from "@/mixins/asyncDataStatus.js";

export default {
  mixins: [asyncDataStatus],
  methods: { ...mapActions(["fetchForum", "fetchThreads", "fetchUser"]) },
  components: {
    ThreadList
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  computed: {
    // we create these as computed properties so they will be re-evaluated when their dependencies change. Data properties would not do this.
    forum() {
      return this.$store.state.forums[this.id];
    },
    threads() {
      return Object.values(this.$store.state.threads).filter(thread => thread.forumId === this.id);
    }
  },
  created() {
    this.fetchForum({ id: this.id })
      .then(forum => this.fetchThreads({ ids: forum.threads }))
      .then(threads => Promise.all(threads.map(thread => this.fetchUser({ id: thread.userId })))) // refactored from using threads.foreach to Promise.all(threads.map...)
      .then(() => this.asyncDataStatus_fetched());
  }
};
</script>

<style scoped>
.forum-wrapper {
  width: 100%;
}
</style>
