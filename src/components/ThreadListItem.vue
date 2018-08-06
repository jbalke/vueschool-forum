<template>
  <div v-if="thread && user" class="thread">
    <div>
      <p>
        <router-link :to="{name: 'ThreadShow', params: {id: thread['.key']}}">
          {{thread.title}}
        </router-link>
      </p>
      <p class="text-faded text-xsmall">
        By
        <a href="#">{{user.name}}</a>,
        <app-date :timestamp="thread.publishedAt" />.
      </p>
    </div>

    <div class="activity">
      <p class="replies-count">
        {{replyCount}} replies
      </p>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    replyCount() {
      return this.$store.getters.threadRepliesCount(this.thread[".key"]);
    },
    user() {
      return this.$store.state.users[this.thread.userId];
    }
  },
  props: {
    thread: {
      required: true,
      type: Object
    }
  }
};
</script>
