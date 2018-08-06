<template>
  <div class="flex-grid">

    <user-profile-card v-if="!edit" :user="user" />
    <user-profile-card-editor v-else :user="user" />

    <div class="col-7 push-top">

      <div class="profile-header">
        <span class="text-lead">
          {{user.username}}'s recent activity
        </span>
        <a href="#">See only started threads?</a>
      </div>

      <hr>

      <post-list :posts="userPosts" />

    </div>
  </div>
</template>

<script>
import UserProfileCardEditor from "@/components/UserProfileCardEditor";
import PostList from "@/components/PostList";
import UserProfileCard from "@/components/UserProfileCard";
import { mapGetters } from "vuex";

export default {
  props: {
    edit: {
      default: false,
      type: Boolean
    }
  },
  components: {
    PostList,
    UserProfileCard,
    UserProfileCardEditor
  },
  computed: {
    ...mapGetters({
      user: "authUser"
    }),
    userPosts() {
      if (this.user.posts) {
        return Object.values(this.$store.state.posts).filter(post => post.userId === this.user[".key"]);
      }
      return [];
    }
  },
  created() {
    this.$emit("ready");
  }
};
</script>

<style>
</style>
