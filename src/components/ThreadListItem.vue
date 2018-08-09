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
      // if we don't use mapGetters and specify a namespace we have to use bracket syntax and specify a namespace.
      return this.$store.getters["threads/threadRepliesCount"](this.thread[".key"]); // dynamic getter i.e. returns a function
    },
    user() {
      return this.$store.state.users.items[this.thread.userId];
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
