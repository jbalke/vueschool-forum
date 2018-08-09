import Vue from "vue";

export default {
  // setPost(state, { post, postId }) {
  //   post[".key"] = postId; // .key is only added in vuex store state, not in firebase.
  //   Vue.set(state.posts, postId, post);
  // },
  setItem(state, { item, id, resource }) {
    item[".key"] = id; // .key is only added in vuex store state, not in firebase.
    Vue.set(state[resource].items, id, item);
  }
};
