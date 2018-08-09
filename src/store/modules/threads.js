import { makeAppendChildToParentMutation } from "@/store/helpers";
import { countObjectProperties } from "@/utils";
import firebase from "firebase/app";
import "firebase/database";

export default {
  namespaced: true,
  state: {
    items: {} // global state = state.threads.items[id]
  },
  getters: {
    threadRepliesCount: state => id => countObjectProperties(state.items[id].posts) - 1,
    threadContributorsCount: state => id => countObjectProperties(state.items[id].contributors)
  },
  actions: {
    fetchThread: ({ dispatch }, { id }) => dispatch("fetchItem", { id, emoji: "📃", resource: "threads" }, { root: true }),
    fetchThreads: ({ dispatch }, { ids }) => dispatch("fetchItems", { ids, resource: "threads", emoji: "📃" }, { root: true }),
    createThread({ commit, state, dispatch, rootState }, { title, text, forumId }) {
      return new Promise((resolve, reject) => {
        // const threadId = "greatThread" + Math.random();
        const threadId = firebase
          .database()
          .ref("threads")
          .push().key; // push() returns a reference to a new child location, which we can get the unique key from.
        const postId = firebase
          .database()
          .ref("posts")
          .push().key; // push() returns a reference to a new child location, which we can get the unique key from.
        const publishedAt = Math.floor(Date.now() / 1000);
        const userId = rootState.auth.authId;
        const thread = {
          // ".key": threadId,
          forumId,
          title,
          publishedAt,
          userId,
          firstPostId: postId,
          posts: {}
        };
        thread.posts[postId] = postId; // can't change thread and a child property in same update so have to update the object before writing to firebase

        const post = { text, publishedAt, threadId, userId };
        const updates = {};
        // thread
        updates[`threads/${threadId}`] = thread;
        updates[`forums/${forumId}/threads/${threadId}`] = threadId;
        updates[`users/${userId}/threads/${threadId}`] = threadId;

        // post
        updates[`posts/${postId}`] = post; // create posts object
        // updates[`threads/${threadId}/posts/${postId}`] = postId; // can't change thread and a child property in same update
        updates[`users/${userId}/posts/${postId}`] = postId;
        firebase
          .database()
          .ref()
          .update(updates)
          .then(() => {
            // update thread
            commit("setItem", { item: thread, id: threadId, resource: "threads" }, { root: true });
            commit("forums/appendThreadToForum", { childId: threadId, parentId: forumId }, { root: true });
            commit("users/appendThreadToUser", { childId: threadId, parentId: userId }, { root: true });
            // update post
            commit("setItem", { item: post, id: postId, resource: "posts" }, { root: true });
            commit("appendPostToThread", { childId: postId, parentId: post.threadId });
            commit("users/appendPostToUser", { childId: postId, parentId: post.userId }, { root: true });

            resolve(state.items[threadId]);
          });
      });
    },
    updateThread({ state, commit, dispatch, rootState }, { title, text, id }) {
      return new Promise((resolve, reject) => {
        const thread = state.items[id];
        const post = rootState.posts.items[thread.firstPostId];

        const edited = { at: Math.floor(Date.now() / 1000), by: rootState.auth.authId };
        const updates = {};
        updates[`threads/${id}/title`] = title;
        updates[`posts/${thread.firstPostId}/text`] = text;
        updates[`posts/${thread.firstPostId}/edited`] = edited;

        firebase
          .database()
          .ref()
          .update(updates)
          .then(() => {
            commit(
              "setItem",
              {
                item: { ...thread, title },
                id: id,
                resource: "threads"
              },
              { root: true }
            );
            commit(
              "setItem",
              {
                id: thread.firstPostId,
                item: { ...post, text, edited },
                resource: "posts"
              },
              { root: true }
            );
            resolve(post);
            // wait for updatePost to complete before resolving promise.
            // dispatch("updatePost", {
            //   id: thread.firstPostId,
            //   text
            // }).then(() => {
            //   resolve(newThread);
            // });
          });
      });
    }
  },
  mutations: {
    appendPostToThread: makeAppendChildToParentMutation({
      parent: "threads",
      child: "posts"
    }),
    appendContributorToThread: makeAppendChildToParentMutation({
      parent: "threads",
      child: "contributors"
    })
  }
};
