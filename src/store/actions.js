import firebase from "firebase";

export default {
  createPost({ commit, state }, post) {
    // const postId = "greatPost" + Math.random();
    const postId = firebase
      .database()
      .ref("posts")
      .push().key;
    // post[".key"] = postId;
    post.userId = state.authId;
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
        commit("setItem", { item: post, id: postId, resource: "posts" });
        commit("appendPostToThread", { childId: postId, parentId: post.threadId });
        commit("appendContributorToThread", { childId: post.userId, parentId: post.threadId });
        commit("appendPostToUser", { childId: postId, parentId: post.userId });

        return Promise.resolve(state.posts[postId]);
      });
  },
  updateThread({ state, commit, dispatch }, { title, text, id }) {
    return new Promise((resolve, reject) => {
      const thread = state.threads[id];
      const post = state.posts[thread.firstPostId];
      const newThread = {
        ...thread,
        title
      };
      const edited = { at: Math.floor(Date.now() / 1000), by: state.authId };
      const updates = {};
      updates[`threads/${id}/title`] = title;
      updates[`posts/${thread.firstPostId}/text`] = text;
      updates[`posts/${thread.firstPostId}/edited`] = edited;

      firebase
        .database()
        .ref()
        .update(updates)
        .then(() => {
          commit("setItem", {
            item: newThread,
            id: id,
            resource: "threads"
          });
          commit("setItem", {
            id: thread.firstPostId,
            item: { ...post, text, edited },
            resource: "posts"
          });
          resolve(newThread);
          // wait for updatePost to complete before resolving promise.
          // dispatch("updatePost", {
          //   id: thread.firstPostId,
          //   text
          // }).then(() => {
          //   resolve(newThread);
          // });
        });
    });
  },
  createThread({ commit, state, dispatch }, { title, text, forumId }) {
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
      const userId = state.authId;
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
          commit("setItem", { item: thread, id: threadId, resource: "threads" });
          commit("appendThreadToForum", { childId: threadId, parentId: forumId });
          commit("appendThreadToUser", { childId: threadId, parentId: userId });
          // update post
          commit("setItem", { item: post, id: postId, resource: "posts" });
          commit("appendPostToThread", { childId: postId, parentId: post.threadId });
          commit("appendPostToUser", { childId: postId, parentId: post.userId });

          resolve(state.threads[threadId]);
        });
    });
  },
  updateUser({ commit }, user) {
    commit("setUser", { userId: user[".key"], user });
  },
  updatePost({ state, commit }, { id, text }) {
    return new Promise((resolve, reject) => {
      const post = state.posts[id];
      const edited = { at: Math.floor(Date.now() / 1000), by: state.authId };
      const updates = { text, edited };

      firebase
        .database()
        .ref("posts")
        .child(id)
        .update(updates)
        .then(() => {
          commit("setItem", { id, item: { ...post, text, edited }, resource: "posts" });
          resolve(post);
        });
    });
  },

  fetchCategory: ({ dispatch }, { id }) => dispatch("fetchItem", { id, emoji: "🏷", resource: "categories" }),
  fetchForum: ({ dispatch }, { id }) => dispatch("fetchItem", { id, emoji: "🌧", resource: "forums" }),
  fetchThread: ({ dispatch }, { id }) => dispatch("fetchItem", { id, emoji: "📃", resource: "threads" }),
  fetchPost: ({ dispatch }, { id }) => dispatch("fetchItem", { id, emoji: "🗨", resource: "posts" }),
  fetchUser: ({ dispatch }, { id }) => dispatch("fetchItem", { id, emoji: "🙋‍", resource: "users" }),

  fetchCategories: ({ dispatch }, { ids }) => dispatch("fetchItems", { ids, resource: "categories", emoji: "🏷" }),
  fetchForums: ({ dispatch }, { ids }) => dispatch("fetchItems", { ids, resource: "forums", emoji: "🌧" }),
  fetchThreads: ({ dispatch }, { ids }) => dispatch("fetchItems", { ids, resource: "threads", emoji: "📃" }),
  fetchPosts: ({ dispatch }, { ids }) => dispatch("fetchItems", { ids, resource: "posts", emoji: "💬" }),

  fetchAllCategories({ commit, state }) {
    console.log("🔥", "🏷", "all");
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref("categories")
        .once("value", snapshot => {
          const categoriesObj = snapshot.val();
          Object.keys(categoriesObj).forEach(categoryId => {
            const category = categoriesObj[categoryId];
            commit("setItem", {
              resource: "categories",
              id: categoryId,
              item: category
            });
          });
          resolve(Object.values(state.categories));
        });
    });
  },
  fetchItem({ state, commit }, { id, emoji, resource }) {
    console.log("🔥", emoji, id);

    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref(resource)
        .child(id)
        .once("value", snapshot => {
          commit("setItem", {
            id: snapshot.key,
            item: snapshot.val(),
            resource
          });
          resolve(state[resource][id]);
        });
    });
  },
  fetchItems({ dispatch }, { ids, resource, emoji }) {
    // create an array of dispatches with map() and pass to Promise.all() to return a single promise.
    ids = Array.isArray(ids) ? ids : Object.keys(ids);
    return Promise.all(ids.map(id => dispatch("fetchItem", { id, resource, emoji })));
  }
};
