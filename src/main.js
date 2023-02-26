import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import { createRouter, createWebHistory } from "vue-router";
import MovieDetails from "./components/pages/Movies/MovieDetails.vue";
import HomePage from "./components/pages/HomePage.vue";
import PersonDetails from "./components/pages/Person/PersonDetails.vue";
import NotFound from "./components/NotFound.vue";
import SearchResult from "./components/pages/Search/SearchResult.vue";
import FindMovie from "./components/pages/Search/FindMovie.vue";
import TvDetails from "./components/pages/TV/TvDetails.vue";
import MovieCredits from "./components/pages/Person/MovieCredits.vue";
import TvCasts from "./components/pages/TV/TvCasts.vue";
import TvPage from "./components/pages/TvPage.vue";
import TvCredits from "./components/pages/Person/TvCredits.vue";

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
      path: "/tv/",
      name: "tv.index",
      component: TvPage,
    },
    {
      path: "/find-a-movie/",
      name: "find",
      component: FindMovie,
    },
    {
      path: "/search/",
      name: "search",
      component: SearchResult,
    },
    {
      path: "/movie/:id(\\d+)",
      name: "movies.show",
      component: MovieDetails,
      props: true,
    },
    {
      path: "/person/:id(\\d+)",
      name: "persons.show",
      component: PersonDetails,
      props: true,
    },
    {
      path: "/person/:id(\\d+)/movies",
      name: "persons.movie",
      component: MovieCredits,
      props: true,
    },
    {
      path: "/person/:id(\\d+)/tv",
      name: "persons.tv",
      component: TvCredits,
      props: true,
    },
    {
      path: "/tv/:id(\\d+)",
      name: "tv",
      component: TvDetails,
      props: true,
    },
    {
      path: "/tv/:id(\\d+)/casts",
      name: "tv.casts",
      component: TvCasts,
      props: true,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFound,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 };
  },
});

loadFonts();

createApp(App).use(router).use(vuetify).mount("#app");
