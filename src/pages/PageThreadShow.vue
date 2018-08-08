<template>
  <div v-if="asyncDataStatus_ready" class="push-top col-full">

    <h1>{{thread.title}}
      <router-link :to="{name: 'ThreadEdit', id: this.id}" class="btn-green btn-small" tag='button'>Edit Thread</router-link>
    </h1>

    <p>
      By
      <a href="#" class="link-unstyled">{{user.username}}</a>,
      <app-date :timestamp="thread.publishedAt" />.
      <span style="float:right; margin-top: 2px;" class="hide-mobile text-faded text-small">{{replyCount}} replies by {{contributorsCount}} contributors</span>
    </p>

    <post-list :posts="posts" />
    <post-editor v-if='authUser' :threadId="id" />
    <div v-else class="text-center" style="margin-bottom: 50px;">
      <router-link :to="{name: 'SignIn', query: {redirectTo: $route.path}}">Sign In</router-link> or
      <router-link :to="{name: 'Register', query: {redirectTo: $route.path}}">Register</router-link> to post a reply.
    </div>
  </div>
</template>

<script>
import PostList from "@/components/PostList";
import PostEditor from "@/components/PostEditor";
import { mapActions, mapGetters } from "vuex";
import asyncDataStatus from "@/mixins/asyncDataStatus.js";

export default {
  mixins: [asyncDataStatus],
  components: {
    PostList,
    PostEditor
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  methods: { ...mapActions(["fetchThread", "fetchPosts", "fetchUser"]) },
  computed: {
    ...mapGetters(["authUser"]),
    user() {
      return this.$store.state.users[this.thread.userId];
    },
    thread() {
      return this.$store.state.threads[this.id];
    },
    posts() {
      const postIds = Object.values(this.thread.posts);

      return Object.values(this.$store.state.posts).filter(post => postIds.includes(post[".key"])); // get all post objects from posts and filter on post ids in thread object
    },
    replyCount() {
      return this.$store.getters.threadRepliesCount(this.thread[".key"]);
    },
    contributorsCount() {
      return this.$store.getters.threadContributorsCount(this.thread[".key"]);

      // // get replies and filter out the first post
      // const replies = Object.keys(this.thread.posts)
      //   .filter(postId => postId !== this.thread.firstPostId)
      //   .map(postId => this.$store.state.posts[postId]);

      // // get the userIds of the filtered posts
      // const userIds = replies.map(post => post.userId);

      // // to get the unique values we filter where the indexOf an item is the value of index. This will remove the duplicate values that may appear later in the array.
      // return userIds.filter((id, index) => userIds.indexOf(id) === index)
      //   .length;
    }
  },
  created() {
    // fetch thread
    this.fetchThread({ id: this.id })
      .then(thread => {
        // fetch user that created the thread
        this.fetchUser({ id: thread.userId });

        // for each thread postId
        // Object.keys(thread.posts).forEach(postId => {
        //   // get the post
        //   this.$store.dispatch("fetchPost", { id: postId }).then(post => {
        //     // get user for post
        //     this.$store.dispatch("fetchUser", { id: post.userId });
        //   });
        // });

        return this.fetchPosts({ ids: Object.keys(thread.posts) }).then(posts =>
          Promise.all(posts.map(post => this.fetchUser({ id: post.userId })))
        );
      })
      .then(() => this.asyncDataStatus_fetched());
  }
};
</script>

<style scoped>
</style>
