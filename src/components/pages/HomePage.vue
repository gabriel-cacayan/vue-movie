<template>
  <section class="bg-black">
    <div
      v-if="landingInfo"
      id="main"
      :style="{
        backgroundImage: `url('${renderPoster(landingInfo.backdrop_path)}')`,
      }"
      class="d-none d-md-flex"
    >
      <div id="overlay"></div>
      <div
        class="d-flex flex-column flex-md-row align-center px-4"
        id="overlay-main"
      >
        <div class="px-4">
          <v-img
            v-if="landingInfo.poster_path"
            class="rounded-lg"
            height="500"
            width="300"
            aspect-ratio="16/9"
            eager
            :src="renderPoster(landingInfo.poster_path)"
            cover
          ></v-img>
          <v-img
            v-else
            height="300"
            width="300"
            :src="cardImagePlaceholder"
          ></v-img>
        </div>
        <div class="pa-4">
          <h1>{{ landingInfo.original_title }}</h1>
          <p class="text-grey-lighten-1 mb-4">{{ landingInfo.tagline }}</p>
          <p class="text-grey-lighten-3 mb-4 pr-2">
            {{ landingInfo.overview }}
          </p>
          <p class="mb-4">
            Genres:
            <template v-for="genre in landingInfo.genres" :key="genre.id">
              <v-chip class="mr-2">
                {{ genre.name }}
              </v-chip>
            </template>
          </p>
          <p class="mb-4">
            Budget:
            {{ budget }}
          </p>
          <p class="mb-4">
            Revenue:
            {{ revenue }}
          </p>
          <p class="mb-4">
            Runtime:
            {{ runtime }}
          </p>
          <v-btn
            color="info"
            variant="outlined"
            :to="{ name: 'movies.show', params: { id: landingInfo.id } }"
            >View Details</v-btn
          >
        </div>
      </div>
    </div>

    <div class="pa-4">
      <p class="text-grey-lighten-1 mt-4">
        Vue Movie is an online database of information related to films,
        television series, music videos, podcasts, home videos, video games, and
        streaming content online including cast, production crew and personal
        biographies, plot summaries, trivia, ratings, and fan and critical
        reviews.
      </p>
    </div>

    <!-- Popular this week  -->
    <div v-if="popularMovies">
      <h1 class="text-h5 ma-4">Popular this week</h1>
      <v-sheet class="my-10 mx-auto">
        <v-slide-group v-model="model" class="pa-4 bg-black" show-arrows>
          <v-slide-group-item v-for="movie in popularMovies" :key="movie.id">
            <v-card
              class="mx-4 fill-height"
              hover
              v-ripple
              height="350"
              width="175"
              @click="getSpecificMovie(movie.id)"
            >
              <v-img
                :src="renderPoster(movie.poster_path)"
                :lazy-src="cardImagePlaceholder"
                :alt="movie.poster"
                height="250"
                cover
              ></v-img>

              <v-card-title>{{ movie.original_title }}</v-card-title>

              <v-card-subtitle class="d-flex mb-4">
                <div>
                  <v-icon icon="mdi-star" color="#FFFF00"></v-icon>
                  {{ Math.round(movie.vote_average) }}
                </div>
                <v-spacer></v-spacer>
                <p>
                  {{ parseInt(movie.release_date) }}
                </p>
              </v-card-subtitle>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-sheet>
    </div>

    <!-- Top rated -->
    <div v-if="topRatedMovies">
      <h1 class="text-h5 ma-4">Top Rated</h1>
      <v-sheet class="my-10 mx-auto">
        <v-slide-group v-model="model" class="pa-4 bg-black" show-arrows>
          <v-slide-group-item v-for="movie in topRatedMovies" :key="movie.id">
            <v-card
              class="mx-4 fill-height"
              hover
              v-ripple
              height="350"
              width="175"
              @click="getSpecificMovie(movie.id)"
            >
              <v-img
                :src="renderPoster(movie.poster_path)"
                :lazy-src="cardImagePlaceholder"
                :alt="movie.poster"
                height="250"
                cover
              ></v-img>

              <v-card-title>{{ movie.original_title }}</v-card-title>

              <v-card-subtitle class="d-flex mb-4">
                <div>
                  <v-icon icon="mdi-star" color="#FFFF00"></v-icon>
                  {{ Math.round(movie.vote_average) }}
                </div>
                <v-spacer></v-spacer>
                <p>
                  {{ parseInt(movie.release_date) }}
                </p>
              </v-card-subtitle>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-sheet>
    </div>

    <!-- Upcoming -->
    <div v-if="upcomingMovies">
      <h1 class="text-h5 ma-4">Upcoming</h1>
      <v-sheet class="my-10 mx-auto">
        <v-slide-group v-model="model" class="pa-4 bg-black" show-arrows>
          <v-slide-group-item v-for="movie in upcomingMovies" :key="movie.id">
            <v-card
              class="mx-4 fill-height"
              hover
              v-ripple
              height="350"
              width="175"
              @click="getSpecificMovie(movie.id)"
            >
              <v-img
                :src="renderPoster(movie.poster_path)"
                :lazy-src="cardImagePlaceholder"
                :alt="movie.poster"
                height="250"
                cover
              ></v-img>

              <v-card-title>{{ movie.original_title }}</v-card-title>

              <v-card-subtitle class="d-flex mb-4">
                <div>
                  <v-icon icon="mdi-star" color="#FFFF00"></v-icon>
                  {{ Math.round(movie.vote_average) }}
                </div>
                <v-spacer></v-spacer>
                <p>
                  {{ parseInt(movie.release_date) }}
                </p>
              </v-card-subtitle>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-sheet>
    </div>

    <!-- Popular TV Shows -->
    <div v-if="popularTvShows">
      <h1 class="text-h5 ma-4">Popular TV Shows</h1>
      <v-sheet class="my-10 mx-auto">
        <v-slide-group v-model="model" class="pa-4 bg-black" show-arrows>
          <v-slide-group-item v-for="tv in popularTvShows" :key="tv.id">
            <v-card
              class="mx-4 fill-height"
              hover
              v-ripple
              height="350"
              width="175"
              @click="routeToTvDetails(tv.id)"
            >
              <v-img
                :src="renderPoster(tv.poster_path)"
                :lazy-src="cardImagePlaceholder"
                :alt="tv.poster"
                height="250"
                cover
              ></v-img>

              <v-card-title>{{ tv.original_title }}</v-card-title>

              <v-card-subtitle class="d-flex mb-4">
                <div>
                  <v-icon icon="mdi-star" color="#FFFF00"></v-icon>
                  {{ Math.round(tv.vote_average) }}
                </div>
                <v-spacer></v-spacer>
                <p>
                  {{ parseInt(tv.first_air_date) }}
                </p>
              </v-card-subtitle>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-sheet>
    </div>
    <br />
  </section>
</template>

<script>
export default {
  inject: [
    "transferToCol",
    "apiKey",
    "renderPoster",
    "cardImagePlaceholder",
    "getSpecificMovie",
  ],
  data() {
    return {
      isLoading: false,
      popularMovies: [],
      cardId: null,
      search: "",
      parallaxImage:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F7f%2F10%2F14%2F7f10142cd34718e80d9e257271b452ef.jpg&f=1&nofb=1&ipt=db997dfaff0c5a45a2aad4e6a5b4f9af48ffef0ff72cc308aedaa465430a9d7c&ipo=images",
      topRatedMovies: [],
      upcomingMovies: [],
      model: 0,
      popularTvShows: [],
      landingInfo: null,
    };
  },
  computed: {
    budget() {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(this.landingInfo.budget);
    },
    revenue() {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(this.landingInfo.revenue);
    },
    runtime() {
      var hours = Math.floor(this.landingInfo.runtime / 60);
      var minutes = this.landingInfo.runtime % 60;
      return hours + "h " + minutes + "m";
    },
  },
  methods: {
    /**
     *
     * * Get a list of the current popular movies on TMDB. This list updates daily.
     *
     */
    getPopularMovies: function () {
      this.isLoading = true;
      fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${this.apiKey}&language=en-US&page=1`
      )
        .then((response) => response.json())
        .then((result) => {
          result.results.forEach((element) => {
            this.popularMovies.push(element);
          });
          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = false;
        });
    },
    /**
     *
     * * Get the top rated movies on TMDB.
     *
     */
    getTopRatedMovies: function () {
      this.isLoading = true;
      fetch(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${this.apiKey}&language=en-US&page=1`
      )
        .then((response) => response.json())
        .then((result) => {
          result.results.forEach((element) => {
            this.topRatedMovies.push(element);
          });
          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = false;
        });
    },
    /**
     *
     * * Get a list of upcoming movies in theatres.
     * * This is a release type query that looks for all movies that have a release type of 2 or 3 within the specified date range.
     *
     */
    getUpcomingMovies: function () {
      this.isLoading = true;
      fetch(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${this.apiKey}&language=en-US&page=1`
      )
        .then((response) => response.json())
        .then((result) => {
          result.results.forEach((element) => {
            this.upcomingMovies.push(element);
          });
          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = false;
        });
    },
    /**
     *
     * * This is a release type query that looks for all movies that have a release type of 2 or 3 within the specified date range.
     *
     */
    getPopularTvShows: function () {
      this.isLoading = true;
      fetch(
        `https://api.themoviedb.org/3/tv/popular?api_key=${this.apiKey}&language=en-US&page=1`
      )
        .then((response) => response.json())
        .then((result) => {
          // console.log(result);
          result.results.forEach((element) => {
            this.popularTvShows.push(element);
          });
          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = false;
        });
    },
    /**
     *
     * * Route to details of tv.
     * @param id int - tv id
     *
     */
    routeToTvDetails: function (id) {
      this.$router.push({
        name: "tv",
        params: { id: id },
      });
    },
    /**
     * Get Avatar to make it landing page
     */
    getAvatar: function () {
      fetch(
        `https://api.themoviedb.org/3/movie/76600?api_key=${this.apiKey}&language=en-US`
      )
        .then((response) => response.json())
        .then((result) => {
          this.landingInfo = result;
        })
        .catch((error) => {});
    },
  },
  mounted: function () {
    this.getAvatar();
    this.getPopularMovies();
    this.getTopRatedMovies();
    this.getUpcomingMovies();
    this.getPopularTvShows();
  },
};
</script>

<style scoped>
#main {
  background-repeat: no-repeat;
  background-size: cover;
  width: 100vw;
  height: 100vh;
  position: relative;
}

#overlay {
  position: absolute;
  width: 100vw;
  height: 100vh;
  background: #000;
  opacity: 0.6;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
}

#overlay-main {
  position: absolute;
  top: 50%;
  bottom: 50%;
  left: 5%;
  right: 5%;
  z-index: 3;
}
</style>
