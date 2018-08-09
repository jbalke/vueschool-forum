// import sourceData from "@/data";
import Vue from "vue";
import Vuex from "vuex";
import actions from "./actions";
import getters from "./getters";
import auth from "./modules/auth";
import categories from "./modules/categories";
import forums from "./modules/forums";
import posts from "./modules/posts";
import threads from "./modules/threads";
import users from "./modules/users";
import mutations from "./mutations";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters,
  mutations,
  actions,
  modules: {
    categories,
    forums,
    threads,
    posts,
    users,
    auth
  }
});
