import Vue from 'vue';

const makeAppendChildToParentMutation = ({
    parent,
    child
  }) =>
  (state, {
    childId,
    parentId
  }) => {
    const resource = state[parent][parentId];
    if (!resource[child]) {
      Vue.set(resource, child, {}); // initialise the child object
    }
    Vue.set(resource[child], childId, childId);
  };

export {
  makeAppendChildToParentMutation
};

// appendPostToThread(state, {
//   postId,
//   threadId
// }) {
//   // append post to thread
//   const thread = state.threads[threadId];
//   if (!thread.posts) {
//     Vue.set(thread, 'posts', {});
//   }
//   Vue.set(thread.posts, postId, postId);
// }
