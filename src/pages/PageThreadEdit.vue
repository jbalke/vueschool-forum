<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">

    <h1>Editing
      <i>{{thread.name}}</i>
    </h1>

    <thread-editor :title="thread.title" :text="text" @save="save" @cancel="cancel" />

  </div>
</template>

<script>
import ThreadEditor from "@/components/ThreadEditor";
import { mapActions } from "vuex";
import asyncDataStatus from "@/mixins/asyncDataStatus.js";

export default {
  mixins: [asyncDataStatus],
  components: {
    ThreadEditor
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  computed: {
    thread() {
      return this.$store.state.threads[this.id];
    },
    text() {
      const post = this.$store.state.posts[this.thread.firstPostId];
      return post ? post.text : null;
    }
  },
  methods: {
    ...mapActions(["updateThread", "fetchThread", "fetchPost"]),
    save({ title, text }) {
      // as we don't know the threadId until it is handled by the createThread action, we have the action return a promise with the complete thread object!
      this.updateThread({
        title,
        text,
        id: this.id
      }).then(thread => {
        this.$router.push({
          name: "ThreadShow",
          params: { id: this.id }
        });
      });
    },
    cancel() {
      this.$router.push({
        name: "ThreadShow",
        params: { id: this.id }
      });
    }
  },
  created() {
    this.fetchThread({ id: this.id })
      .then(thread => this.fetchPost({ id: thread.firstPostId }))
      .then(() => this.asyncDataStatus_fetched());
  }
};
</script>

<style>
</style>
