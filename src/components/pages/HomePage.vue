<template>
  <v-main class="bg-black">
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
                :lazy-src="defaultImg"
                :alt="movie.poster"
                height="250"
                cover
              ></v-img>

              <v-card-title>{{ movie.original_title }}</v-card-title>

              <v-card-subtitle class="d-flex mb-4">
                <div>
                  <v-icon icon="mdi-star" color="#FFFF00"></v-icon>
                  {{ movie.vote_average }}
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
                :lazy-src="defaultImg"
                :alt="movie.poster"
                height="250"
                cover
              ></v-img>

              <v-card-title>{{ movie.original_title }}</v-card-title>

              <v-card-subtitle class="d-flex mb-4">
                <div>
                  <v-icon icon="mdi-star" color="#FFFF00"></v-icon>
                  {{ movie.vote_average }}
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
                :lazy-src="defaultImg"
                :alt="movie.poster"
                height="250"
                cover
              ></v-img>

              <v-card-title>{{ movie.original_title }}</v-card-title>

              <v-card-subtitle class="d-flex mb-4">
                <div>
                  <v-icon icon="mdi-star" color="#FFFF00"></v-icon>
                  {{ movie.vote_average }}
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
    <!-- test -->
  </v-main>
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
    };
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
  },
  mounted: function () {
    this.getPopularMovies();
    this.getTopRatedMovies();
    this.getUpcomingMovies();
  },
};
</script>

<style scoped></style>
