import { createRouter, createWebHistory } from "vue-router";
import MovieDetails from "./components/pages/Movies/MovieDetails";
import HomePage from "./components/pages/HomePage";
import PersonDetails from "./components/pages/Person/PersonDetails";
import NotFound from "./components/pages/NotFound";
import SearchResult from "./components/pages/Search/SearchResult";
import FindMovie from "./components/pages/Search/FindMovie";
import TvDetails from "./components/pages/TV/TvDetails";
import MovieCredits from "./components/pages/Person/MovieCredits";
import TvCasts from "./components/pages/TV/TvCasts";
import TvPage from "./components/pages/TvPage";
import TvCredits from "./components/pages/Person/TvCredits";
import TvSeason from "./components/pages/TV/TvSeason";
import TvEpisode from "./components/pages/TV/TvEpisode";
import MovieCasts from "./components/pages/Movies/MovieCasts";
// import MovieCasts from "@/components/pages/Movies/MovieCasts";

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
      path: "/movie/:id(\\d+)/casts",
      name: "movies.casts",
      component: MovieCasts,
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
      name: "tv.show",
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
      path: "/tv/:id(\\d+)/season/:seasonNumber",
      name: "tv.season",
      component: TvSeason,
      props: true,
    },
    {
      path: "/tv/:id(\\d+)/season/:seasonNumber/episode/:episodeNumber",
      name: "tv.episode",
      component: TvEpisode,
      props: true,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFound,
    },
  ],
  linkActiveClass: "text-yellow-accent-4",
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 };
  },
});

export default router;
