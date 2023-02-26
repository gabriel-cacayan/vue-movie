<template>
  <v-container id="search-result-container">
    <!-- Search Result For Movie -->
    <div v-if="searchMovies.length != 0" class="pa-4 my-10">
      <h1 class="text-h5 my-4">Your search for - {{ search }}</h1>
      <v-row>
        <v-col v-for="movie in searchMovies" :key="movie.id" cols="6" md="3">
          <v-card
            class="mx-auto"
            hover
            v-ripple
            @click="getMovieDetails(movie.id)"
          >
            <v-img
              v-if="movie.poster_path"
              :src="renderPoster(movie.poster_path)"
              :lazy-src="defaultCardImage"
              cover
            ></v-img>
            <v-img v-else :src="defaultCardImage" cover></v-img>

            <v-card-title>{{ movie.original_title }}</v-card-title>

            <v-card-subtitle class="d-flex mb-4">
              <div>
                <v-icon icon="mdi-star" color="#FFFF00"></v-icon>
                {{ Math.round(movie.vote_average) }}
              </div>
              <v-spacer></v-spacer>
              <p>
                {{ movie.release_date ? parseInt(movie.release_date) : "N/A" }}
              </p>
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Search Result For People  -->
    <div v-if="searchPersons.length != 0" class="pa-4 my-10">
      <h1 class="text-h5 my-4">Your search for - {{ search }}</h1>
      <v-row>
        <v-col v-for="person in searchPersons" :key="person.id" cols="6" md="3">
          <v-card class="mx-auto" hover v-ripple>
            <v-img
              v-if="person.profile_path"
              :src="renderPoster(person.profile_path)"
              :lazy-src="defaultCardImage"
              cover
              @click="getPersonDetails(person.id)"
            ></v-img>
            <v-img
              v-else
              :src="defaultCardImage"
              cover
              @click="getPersonDetails(person.id)"
            ></v-img>

            <v-card-title>{{ person.original_name }}</v-card-title>

            <v-card-subtitle class="d-flex mb-4">
              <div>
                <v-icon icon="mdi-star" color="#FFFF00"></v-icon>
                {{ Math.round(person.popularity) }}
              </div>
              <v-spacer></v-spacer>
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Search Result For Tvs  -->
    <div v-if="searchTvs.length != 0" class="pa-4 my-10">
      <h1 class="text-h5 my-4">Your search for - {{ search }}</h1>
      <v-row>
        <v-col v-for="tv in searchTvs" :key="tv.id" cols="6" md="3">
          <v-card class="mx-auto" hover v-ripple>
            <v-img
              v-if="tv.poster_path"
              :src="renderPoster(tv.poster_path)"
              :lazy-src="defaultCardImage"
              cover
              @click="getTvDetails(tv.id)"
            ></v-img>
            <v-img
              v-else
              :src="defaultCardImage"
              cover
              @click="getTvDetails(tv.id)"
            ></v-img>

            <v-card-title>{{ tv.original_name }}</v-card-title>

            <v-card-subtitle class="d-flex mb-4">
              <div>
                <v-icon icon="mdi-star" color="#FFFF00"></v-icon>
                {{ Math.round(tv.vote_average) }}
              </div>
              <v-spacer></v-spacer>
              <p>
                {{ tv.first_air_date ? parseInt(tv.first_air_date) : "N/A" }}
              </p>
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
export default {
  inject: [
    "apiKey",
    "renderPoster",
    "getMovieDetails",
    "getTvDetails",
    "getPersonDetails",
    "defaultCardImage",
  ],
  data() {
    return {
      searchMovies: [],
      searchPersons: [],
      searchTvs: [],
      search: this.$route.query.search,
      criteria: this.$route.query.criteria,
    };
  },
  methods: {
    /**
     * Search a movie from api.
     */
    searchMovie: function (search, criteria) {
      if (criteria == "Movie") {
        fetch(
          `
https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&language=en-US&query=${search}&page=1&include_adult=false
`
        )
          .then((response) => response.json())
          .then((result) => {
            let sortedByVoteCount = result.results.sort(function (a, b) {
              return b.vote_count - a.vote_count;
            });

            sortedByVoteCount.forEach((element) => {
              this.searchMovies.push(element);
            });
          })
          .catch((error) => {});
      } else if (criteria == "Tv") {
        fetch(
          `
https://api.themoviedb.org/3/search/tv?api_key=${this.apiKey}&language=en-US&query=${search}&page=1&include_adult=false
`
        )
          .then((response) => response.json())
          .then((result) => {
            result.results.forEach((element) => {
              this.searchTvs.push(element);
            });
          })
          .catch((error) => {});
      } else {
        fetch(
          `
https://api.themoviedb.org/3/search/person?api_key=${this.apiKey}&language=en-US&query=${search}&page=1&include_adult=false
`
        )
          .then((response) => response.json())
          .then((result) => {
            let sortedByPopularity = result.results.sort(function (a, b) {
              return b.popularity - a.popularity;
            });

            sortedByPopularity.forEach((element) => {
              this.searchPersons.push(element);
            });
          })
          .catch((error) => {});
      }
    },
  },
  mounted() {
    this.searchMovie(this.search, this.criteria);
  },
};
</script>

<style scoped>
#search-result-container {
  min-height: 100vh;
}
</style>
