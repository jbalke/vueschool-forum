<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">

    <h1>Create new thread in
      <i>{{forum.name}}</i>
    </h1>

    <thread-editor ref="editor" @save="save" @cancel="cancel" />

  </div>
</template>

<script>
import ThreadEditor from "@/components/ThreadEditor";
import { mapActions } from "vuex";
import asyncDataStatus from "@/mixins/asyncDataStatus.js";

export default {
  data() {
    return {
      saved: false
    };
  },
  mixins: [asyncDataStatus],
  components: {
    ThreadEditor
  },
  props: {
    forumId: {
      required: true,
      type: String
    }
  },
  computed: {
    forum() {
      return this.$store.state.forums.items[this.forumId];
    },
    hasUnsavedChanges() {
      return (this.$refs.editor.form.title || this.$refs.editor.form.text) && !this.saved;
    }
  },
  methods: {
    ...mapActions("threads", ["createThread"]),
    ...mapActions("forums", ["fetchForum"]),
    save({ title, text }) {
      // as we don't know the threadId until it is handled by the createThread action, we have the action return a promise with the complete thread object!
      this.createThread({
        title,
        text,
        forumId: this.forum[".key"]
      }).then(thread => {
        this.saved = true;
        this.$router.push({
          name: "ThreadShow",
          params: { id: thread[".key"] }
        });
      });
    },
    cancel() {
      this.$router.push({ name: "Forum", params: { id: this.forum[".key"] } });
    }
  },
  created() {
    this.fetchForum({ id: this.forumId }).then(() => this.asyncDataStatus_fetched());
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
