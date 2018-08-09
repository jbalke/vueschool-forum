import { makeAppendChildToParentMutation } from "@/store/helpers";

export default {
  namespaced: true,
  state: {
    items: {}
  },
  getters: {},
  actions: {
    fetchForum: ({ dispatch }, { id }) => dispatch("fetchItem", { id, emoji: "🌧", resource: "forums" }, { root: true }),
    fetchForums: ({ dispatch }, { ids }) => dispatch("fetchItems", { ids, resource: "forums", emoji: "🌧" }, { root: true })
  },
  mutations: {
    appendPostToForum: makeAppendChildToParentMutation({
      parent: "forums",
      child: "posts"
    }),
    appendThreadToForum: makeAppendChildToParentMutation({
      parent: "forums",
      child: "threads"
    })
  }
};
