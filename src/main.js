import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import { createRouter, createWebHistory } from "vue-router";
import TheMovie from "./components/pages/TheMovie.vue";
import HomePage from "./components/pages/HomePage.vue";
import ThePerson from "./components/pages/ThePerson.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/vue-movie/",
      redirect: "/",
    },
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/movie/:id",
      name: "movies.show",
      component: TheMovie,
      props: true,
    },
    {
      path: "/person/:id",
      name: "persons.show",
      component: ThePerson,
      props: true,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 };
  },
});

loadFonts();

// const app = createApp(App);
// // Make sure to _use_ the router instance to make the
// // whole app router-aware.
// app.use(router);
// app.use(vuetify);

// app.mount("#app");

createApp(App).use(router).use(vuetify).mount("#app");
