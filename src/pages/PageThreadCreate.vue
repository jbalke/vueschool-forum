<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">

    <h1>Create new thread in
      <i>{{forum.name}}</i>
    </h1>

    <thread-editor @save="save" @cancel="cancel" />

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
    forumId: {
      required: true,
      type: String
    }
  },
  computed: {
    forum() {
      return this.$store.state.forums[this.forumId];
    }
  },
  methods: {
    ...mapActions(["createThread", "fetchForum"]),
    save({ title, text }) {
      // as we don't know the threadId until it is handled by the createThread action, we have the action return a promise with the complete thread object!
      this.createThread({
        title,
        text,
        forumId: this.forum[".key"]
      }).then(thread => {
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
  }
};
</script>

<style>
</style>
