<template>
  <v-container fluid>
    <!-- Search Result For Movie -->
    <div v-if="searchMovies.length != 0" class="pa-4">
      <h1 class="text-h5 my-4">Your search for - {{ search }}</h1>
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
                {{
                  movie.release_date
                    ? parseInt(movie.release_date)
                    : "No data available."
                }}
              </p>
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Search Result For People  -->
    <div v-if="searchPersons.length != 0" class="pa-4">
      <h1 class="text-h5 my-4">Your search for - {{ search }}</h1>
      <v-row>
        <v-col
          v-for="person in searchPersons"
          :key="person.id"
          :cols="transferToCol"
        >
          <v-card class="mx-auto" hover v-ripple max-width="344">
            <v-img
              :src="renderPoster(person.profile_path)"
              :lazy-src="cardImagePlaceholder"
              :alt="person.name"
              height="250"
              cover
              @click="getPerson(person.id)"
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
  </v-container>
</template>

<script>
export default {
  inject: [
    "apiKey",
    "renderPoster",
    "transferToCol",
    "getSpecificMovie",
    "cardImagePlaceholder",
  ],
  data() {
    return {
      searchMovies: [],
      searchPersons: [],
      search: this.$route.query.search,
      criteria: this.$route.query.criteria,
    };
  },
  methods: {
    /**
     * * Search a movie from api.
     *
     *
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
            result.results.forEach((element) => {
              this.searchMovies.push(element);
            });

            this.isLoading = false;
          })
          .catch((error) => {
            console.error("Error:", error);
            this.isLoading = false;
          });
      } else {
        fetch(
          `
https://api.themoviedb.org/3/search/person?api_key=${this.apiKey}&language=en-US&query=${search}&page=1&include_adult=false
`
        )
          .then((response) => response.json())
          .then((result) => {
            result.results.forEach((element) => {
              this.searchPersons.push(element);
            });
            // console.log(result);

            this.isLoading = false;
          })
          .catch((error) => {
            console.error("Error:", error);
            this.isLoading = false;
          });
      }
    },
    /**
     *
     * * Get the primary person details by id.
     * @param id int - cast id
     */
    getPerson: function (id) {
      this.$router.push({ name: "persons.show", params: { id: id } });
    },
  },
  mounted() {
    this.searchMovie(this.search, this.criteria);
  },
};
</script>

<style></style>
