<template>
  <v-main>
    <v-container fluid>
      <!-- Search Result  -->
      <div v-if="searchMovies" class="pa-4">
        <h1 class="text-h5 my-4">Your search for - {{ querySearch }}</h1>
        <v-row>
          <v-col
            v-for="movie in searchMovies"
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
    </v-container>
  </v-main>
</template>

<script>
export default {
  inject: ["apiKey", "renderPoster", "transferToCol", "getSpecificMovie"],
  data() {
    return {
      searchMovies: [],
    };
  },
  computed: {
    querySearch() {
      return this.$route.query.search;
    },
  },
  methods: {
    /**
     * * Search a movie from api.
     *
     *
     */
    searchMovie: function (querySearch) {
      fetch(
        `
https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&language=en-US&query=${querySearch}&page=1&include_adult=false
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
  },
  mounted() {
    this.searchMovie(this.querySearch);
  },
};
</script>

<style></style>
