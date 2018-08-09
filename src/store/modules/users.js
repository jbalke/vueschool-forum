import { makeAppendChildToParentMutation } from "@/store/helpers";
import { countObjectProperties } from "@/utils";
import firebase from "firebase";
import "firebase/database";

export default {
  namespaced: true,
  state: {
    items: {}
  },
  getters: {
    userPosts: (state, getters, rootState) => id => {
      const user = state.items[id];
      if (user.posts) {
        return Object.values(rootState.posts.items).filter(post => post.userId === id);
      }
      return [];
    },
    userPostsCount: state => id => countObjectProperties(state.items[id].posts), // dynamic getter
    userThreadsCount: state => id => countObjectProperties(state.items[id].threads) // dynamic getter
  },
  actions: {
    createUser({ commit, state }, { id, email, name, username, avatar = null }) {
      return new Promise((resolve, reject) => {
        const registeredAt = Math.floor(Date.now() / 1000);
        const usernameLower = username.toLowerCase();
        email = email.toLowerCase();
        const user = { avatar, email, name, username, usernameLower, registeredAt };
        // const userId = firebase
        //   .database()
        //   .ref("users")
        //   .push().key;
        firebase
          .database()
          .ref("users")
          .child(id)
          .set(user)
          .then(() => {
            commit("setItem", { resource: "users", id, item: user }, { root: true });
            resolve(state.items[id]);
          });
      });
    },
    updateUser({ commit }, user) {
      const updatedUser = { ...user };
      delete updatedUser[".key"];

      firebase
        .database()
        .ref("users")
        .child(user[".key"])
        .set(updatedUser)
        .then(() => {
          commit("setItem", { id: user[".key"], item: user, resource: "users" }, { root: true });
        });
    },
    fetchUser: ({ dispatch }, { id }) => dispatch("fetchItem", { id, emoji: "🙋‍", resource: "users" }, { root: true })
  },
  mutations: {
    appendPostToUser: makeAppendChildToParentMutation({
      parent: "users",
      child: "posts"
    }),
    appendThreadToUser: makeAppendChildToParentMutation({
      parent: "users",
      child: "threads"
    })
  }
};
