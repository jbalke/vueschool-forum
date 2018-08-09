import firebase from "firebase/app";
import "firebase/database";

export default {
  namespaced: true,
  state: {
    items: {}
  },
  getters: {},
  actions: {
    fetchCategory: ({ dispatch }, { id }) =>
      dispatch("fetchItem", { id, emoji: "🏷", resource: "categories" }, { root: true }),
    fetchCategories: ({ dispatch }, { ids }) =>
      dispatch("fetchItems", { ids, resource: "categories", emoji: "🏷" }, { root: true }),
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
              commit(
                "setItem",
                {
                  resource: "categories",
                  id: categoryId,
                  item: category
                },
                { root: true }
              );
            });
            resolve(Object.values(state.items));
          });
      });
    }
  },
  metations: {}
};
