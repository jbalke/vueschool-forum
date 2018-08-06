import Category from '@/pages/PageCategory';
import Forum from '@/pages/PageForum';
import Home from '@/pages/PageHome';
import NotFound from '@/pages/PageNotFound';
import Profile from '@/pages/PageProfile';
import ThreadCreate from '@/pages/PageThreadCreate';
import ThreadEdit from '@/pages/PageThreadEdit';
import ThreadShow from '@/pages/PageThreadShow';
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/category/:id',
      name: 'Category',
      component: Category,
      props: true
    },
    {
      path: '/forum/:id',
      name: 'Forum',
      component: Forum,
      props: true
    },
    {
      path: '/thread/create/:forumId',
      name: 'ThreadCreate',
      component: ThreadCreate,
      props: true // passes route params as props i.e. 'id'
    },
    {
      path: '/thread/:id',
      name: 'ThreadShow',
      component: ThreadShow,
      props: true // passes route params as props i.e. 'id'
    },
    {
      path: '/thread/:id/edit',
      name: 'ThreadEdit',
      component: ThreadEdit,
      props: true // passes route params as props i.e. 'id'
    },
    {
      path: '/me',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/me/edit',
      name: 'ProfileEdit',
      component: Profile,
      props: {
        edit: true
      }
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }
  ],
  mode: 'history'
})
