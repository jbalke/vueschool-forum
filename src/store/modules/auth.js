import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

export default {
  namespaced: true,
  state: {
    authId: null,
    unsubscribeAuthObserver: null
  },
  getters: {
    authUser(state, getters, rootState) {
      return state.authId ? rootState.users.items[state.authId] : null;
    }
  },
  actions: {
    initAuthentication({ state, dispatch, commit }) {
      // listen to auth state changes and set the auth user on login
      return new Promise((resolve, reject) => {
        // if an observer has been set, unsubscribe before creating a new subscriber.
        if (state.unsubscribeAuthObserver) {
          console.log("😢 unsubscribing auth observer");
          state.unsubscribeAuthObserver();
        }
        // observer will continue to run in background
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
          console.log("👽 the user has changed");
          if (user) {
            dispatch("fetchAuthUser").then(dbUser => {
              resolve(dbUser);
            });
          } else {
            resolve(null);
          }
        });
        commit("setunsubscribeAuthObserver", unsubscribe);
      });
    },
    signOut({ commit }) {
      return firebase
        .auth()
        .signOut()
        .then(() => {
          commit("setAuthId", null);
        });
    },
    signInWithGoogle({ dispatch }) {
      const provider = new firebase.auth.GoogleAuthProvider();
      return firebase
        .auth()
        .signInWithPopup(provider)
        .then(({ user }) => {
          // const user = data.user;
          firebase
            .database()
            .ref("users")
            .child(user.uid)
            .once("value", snapshot => {
              if (!snapshot.exists()) {
                return dispatch(
                  "users/createUser", // users is the namespace for createUser
                  {
                    id: user.uid,
                    name: user.displayName,
                    email: user.email,
                    username: user.email,
                    avatar: user.photoURL
                  },
                  { root: true } // {root: true} to being namespace from root. if not supplied will search for nested namespaces under current module.
                ).then(() => dispatch("fetchAuthUser"));
              }
            });
        });
    },
    signInWithEmailAndPassword(context, { email, password }) {
      return firebase.auth().signInWithEmailAndPassword(email, password);
    },
    registerUserWithEmailAndPassword({ dispatch }, { email, name, username, password, avatar = null }) {
      return firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(response => {
          // console.log(response);

          // need to pass the namespace for actions in other modules e.g. "users/createUser"
          return dispatch(
            "users/createUser",
            {
              id: response.user.uid,
              email,
              name,
              username,
              password,
              avatar
            },
            { root: true }
          ); // {root: true} to being namespace from root. if not supplied will search for nested namespaces under current module.
        })
        .then(() => dispatch("fetchAuthUser"));
    },
    fetchAuthUser({ dispatch, commit }) {
      const userId = firebase.auth().currentUser.uid; // get currently logged in user from firebase

      return new Promise((resolve, reject) => {
        // check that user exists in firebase (user may have signed in with a 3rd party provider)
        firebase
          .database()
          .ref("users")
          .child(userId)
          .once("value", snapshot => {
            if (snapshot.exists()) {
              return dispatch("users/fetchUser", { id: userId }, { root: true }).then(user => {
                commit("setAuthId", userId);
                resolve(user);
              });
            } else {
              resolve(null);
            }
          });
      });
    }
  },
  mutations: {
    setAuthId(state, id) {
      state.authId = id;
    },
    setunsubscribeAuthObserver(state, unsubscribe) {
      state.unsubscribeAuthObserver = unsubscribe;
    }
  }
};
