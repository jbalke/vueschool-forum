import Vue from "vue";
import { makeAppendChildToParentMutation } from "./helpers";

export default {
  // setPost(state, { post, postId }) {
  //   post[".key"] = postId; // .key is only added in vuex store state, not in firebase.
  //   Vue.set(state.posts, postId, post);
  // },
  setItem(state, { item, id, resource }) {
    item[".key"] = id; // .key is only added in vuex store state, not in firebase.
    Vue.set(state[resource], id, item);
  },
  appendPostToThread: makeAppendChildToParentMutation({
    parent: "threads",
    child: "posts"
  }),
  appendPostToUser: makeAppendChildToParentMutation({
    parent: "users",
    child: "posts"
  }),
  appendPostToForum: makeAppendChildToParentMutation({
    parent: "forums",
    child: "posts"
  }),
  appendThreadToUser: makeAppendChildToParentMutation({
    parent: "users",
    child: "threads"
  }),
  appendThreadToForum: makeAppendChildToParentMutation({
    parent: "forums",
    child: "threads"
  }),
  appendContributorToThread: makeAppendChildToParentMutation({
    parent: "threads",
    child: "contributors"
  }),
  setAuthId(state, id) {
    state.authId = id;
  },
  setunsubscribeAuthObserver(state, unsubscribe) {
    state.unsubscribeAuthObserver = unsubscribe;
  }
};
