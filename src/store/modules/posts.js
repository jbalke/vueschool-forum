import firebase from "firebase";
import "firebase/database";

export default {
  namespaced: true,
  state: {
    items: {}
  },
  getters: {},
  actions: {
    createPost({ commit, state, rootState }, post) {
      // const postId = "greatPost" + Math.random();
      const postId = firebase
        .database()
        .ref("posts")
        .push().key;
      // post[".key"] = postId;
      post.userId = rootState.auth.authId;
      post.publishedAt = Math.floor(Date.now() / 1000);

      // create a single object that contains all updates to commit in one transaction
      const updates = {};
      updates[`posts/${postId}`] = post; // create posts object
      updates[`threads/${post.threadId}/posts/${postId}`] = postId;
      updates[`threads/${post.threadId}/contributors/${post.userId}`] = post.userId;
      updates[`users/${post.userId}/posts/${postId}`] = postId;
      firebase
        .database()
        .ref()
        .update(updates)
        .then(() => {
          commit("setItem", { item: post, id: postId, resource: "posts" }, { root: true });
          commit("threads/appendPostToThread", { childId: postId, parentId: post.threadId }, { root: true });
          commit("threads/appendContributorToThread", { childId: post.userId, parentId: post.threadId }, { root: true });
          commit("users/appendPostToUser", { childId: postId, parentId: post.userId }, { root: true });

          // no need to wrap in new Promise() as mutations are synchronise
          return Promise.resolve(state.items[postId]);
        });
    },
    updatePost({ state, commit, rootState }, { id, text }) {
      return new Promise((resolve, reject) => {
        const post = state.items[id];
        const edited = { at: Math.floor(Date.now() / 1000), by: rootState.auth.authId };
        const updates = { text, edited };

        firebase
          .database()
          .ref("posts")
          .child(id)
          .update(updates)
          .then(() => {
            commit("setItem", { id, item: { ...post, text, edited }, resource: "posts" }, { root: true });
            resolve(post);
          });
      });
    },
    fetchPost: ({ dispatch }, { id }) => dispatch("fetchItem", { id, emoji: "🗨", resource: "posts" }, { root: true }),
    fetchPosts: ({ dispatch }, { ids }) => dispatch("fetchItems", { ids, resource: "posts", emoji: "💬" }, { root: true })
  },
  mutation: {}
};
