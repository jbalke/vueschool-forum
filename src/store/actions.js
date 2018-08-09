import firebase from "firebase";

export default {
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
          resolve(state[resource].items[id]);
        });
    });
  },
  fetchItems({ dispatch }, { ids = [], resource, emoji }) {
    // create an array of dispatches with map() and pass to Promise.all() to return a single promise.
    ids = Array.isArray(ids) ? ids : Object.keys(ids);
    return Promise.all(ids.map(id => dispatch("fetchItem", { id, resource, emoji })));
  }
};
