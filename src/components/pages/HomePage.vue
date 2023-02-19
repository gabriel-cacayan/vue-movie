<template>
  <v-main>
    <!-- Search function -->
    <div>
      <v-parallax class="d-flex align-center" height="300" :src="parallaxImage">
        <!-- <v-text-field
          clearable
          label="Enter your keywords"
          variant="outlined"
          class="w-75 mx-auto"
          v-model="search"
          @keyup.enter="searchMovie"
        ></v-text-field> -->
      </v-parallax>
    </div>

    <div class="pa-4">
      <p class="text-grey-lighten-1">
        Vue Movie is an online database of information related to films,
        television series, music videos, podcasts, home videos, video games, and
        streaming content online – including cast, production crew and personal
        biographies, plot summaries, trivia, ratings, and fan and critical
        reviews.
      </p>
    </div>

    <!-- Popular this week  -->
    <div v-if="popularMovies" class="pa-4">
      <h1 class="text-h5 my-4">Popular this week</h1>
      <v-row>
        <v-col
          v-for="movie in popularMovies"
          :key="movie.id"
          :cols="transferToCol"
        >
          <v-card
            class="mx-auto"
            hover
            v-ripple
            max-width="344"
            @click="getSpecificMovie(movie.id)"
          >
            <v-img
              :src="renderPoster(movie.poster_path)"
              :lazy-src="cardImagePlaceholder"
              :alt="movie.poster"
              height="344"
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
        </v-col>
      </v-row>
    </div>

    <!-- Top rated -->
    <div v-if="topRatedMovies" class="pa-4">
      <h1 class="text-h5 my-4">Top rated</h1>
      <v-row>
        <v-col
          v-for="movie in topRatedMovies"
          :key="movie.id"
          :cols="transferToCol"
        >
          <v-card
            class="mx-auto"
            hover
            v-ripple
            max-width="344"
            @click="getSpecificMovie(movie.id)"
          >
            <v-img
              :src="renderPoster(movie.poster_path)"
              :lazy-src="cardImagePlaceholder"
              :alt="movie.poster"
              height="344"
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
        </v-col>
      </v-row>
    </div>

    <!-- Upcoming Movies -->
    <div v-if="topRatedMovies" class="pa-4">
      <h1 class="text-h5 my-4">Upcoming</h1>
      <v-row>
        <v-col
          v-for="movie in upcomingMovies"
          :key="movie.id"
          :cols="transferToCol"
        >
          <v-card
            class="mx-auto"
            hover
            v-ripple
            max-width="344"
            @click="getSpecificMovie(movie.id)"
          >
            <v-img
              :src="renderPoster(movie.poster_path)"
              :lazy-src="cardImagePlaceholder"
              :alt="movie.poster"
              height="344"
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
        </v-col>
      </v-row>
    </div>
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
      searchMovies: [],
    };
  },
  provide() {
    return {
      searchMovies: this.searchMovies,
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
     * * Search a movie from api.
     *
     *
     */
    searchMovie: function () {
      this.$router.push({ name: "search", params: { search: this.search } });

      fetch(
        `
https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&language=en-US&query=${this.search}&page=1&include_adult=false
`
      )
        .then((response) => response.json())
        .then((result) => {
          result.results.forEach((element) => {
            this.searchMovies.push(element);
          });

          this.isLoading = false;
        })
        .catch((error) => {
          console.error("Error:", error);
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
