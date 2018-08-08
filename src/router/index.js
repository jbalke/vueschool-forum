import Category from "@/pages/PageCategory";
import Forum from "@/pages/PageForum";
import Home from "@/pages/PageHome";
import NotFound from "@/pages/PageNotFound";
import Profile from "@/pages/PageProfile";
import Register from "@/pages/PageRegister";
import SignIn from "@/pages/PageSignIn";
import ThreadCreate from "@/pages/PageThreadCreate";
import ThreadEdit from "@/pages/PageThreadEdit";
import ThreadShow from "@/pages/PageThreadShow";
import store from "@/store";
import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/category/:id",
      name: "Category",
      component: Category,
      props: true
    },
    {
      path: "/forum/:id",
      name: "Forum",
      component: Forum,
      props: true
    },
    {
      path: "/thread/create/:forumId",
      name: "ThreadCreate",
      component: ThreadCreate,
      meta: { requiresAuth: true },
      props: true // passes route params as props i.e. 'id'
    },
    {
      path: "/thread/:id",
      name: "ThreadShow",
      component: ThreadShow,
      props: true // passes route params as props i.e. 'id'
    },
    {
      path: "/thread/:id/edit",
      name: "ThreadEdit",
      component: ThreadEdit,
      meta: { requiresAuth: true },
      props: true // passes route params as props i.e. 'id'
    },
    {
      path: "/me",
      name: "Profile",
      component: Profile,
      meta: { requiresAuth: true }
    },
    {
      path: "/me/edit",
      name: "ProfileEdit",
      component: Profile,
      meta: { requiresAuth: true },
      props: {
        edit: true
      }
    },
    {
      path: "/register",
      name: "Register",
      meta: { requiresGuest: true },
      component: Register
    },
    {
      path: "/signin",
      name: "SignIn",
      meta: { requiresGuest: true },
      component: SignIn
    },
    {
      path: "/logout",
      name: "SignOut",
      meta: { requiresAuth: true },
      beforeEnter(to, from, next) {
        store.dispatch("signOut").then(() => next({ name: "Home" }));
      }
    },
    {
      path: "*",
      name: "NotFound",
      component: NotFound
    }
  ],
  mode: "history"
});

// global navigation guard middleware
router.beforeEach((to, from, next) => {
  console.log(`🚦 navigating to ${to.name} from ${from.name}.`);
  store.dispatch("initAuthentication").then(user => {
    // check for matched/nested routes and protect them as well
    if (to.matched.some(route => route.meta.requiresAuth)) {
      // protected route
      if (user) {
        next();
      } else {
        next({ name: "SignIn", query: { redirectTo: to.path } }); // set the original url path as a query param to be picked up by the SignIn Component
      }
    } else if (to.matched.some(route => route.meta.requiresGuest)) {
      // protected route
      if (!user) {
        next();
      } else {
        next({ name: "Home" });
      }
    } else {
      next();
    }
  });
});

export default router;
