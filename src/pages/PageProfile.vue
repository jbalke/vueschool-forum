<template>
  <div v-if="user" class="flex-grid">

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
import asyncDataStatus from "@/mixins/asyncDataStatus";

export default {
  mixins: [asyncDataStatus],
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
      user: "auth/authUser"
    }),
    userPosts() {
      return this.$store.getters["users/userPosts"](this.user[".key"]);
    }
  },
  created() {
    this.$store.dispatch("posts/fetchPosts", { ids: this.user.posts }).then(() => this.asyncDataStatus_fetched());
  }
};
</script>

<style>
</style>
