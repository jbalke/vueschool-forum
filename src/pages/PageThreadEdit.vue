<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">

    <h1>Editing
      <i>{{thread.title}}</i>
    </h1>

    <thread-editor ref="editor" :title="thread.title" :text="text" @save="save" @cancel="cancel" />

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
      return this.$store.state.threads.items[this.id];
    },
    text() {
      const post = this.$store.state.posts.items[this.thread.firstPostId];
      return post ? post.text : null;
    },
    hasUnsavedChanges() {
      return this.thread.title !== this.$refs.editor.form.title || this.text !== this.$refs.editor.form.text;
    }
  },
  methods: {
    ...mapActions("threads", ["updateThread", "fetchThread"]),
    ...mapActions("posts", ["fetchPost"]),
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
  },
  beforeRouteLeave(to, from, next) {
    // we assign a ref to <thread-editor> so we can access its data to check if the use has entered title or text
    if (this.hasUnsavedChanges) {
      const confirmed = window.confirm("Are you sure you want to leave? Unsaved changes will be lost.");
      if (confirmed) {
        next();
      } else {
        next(false); // abort navigation
      }
    } else {
      next();
    }
  }
};
</script>

<style>
</style>
