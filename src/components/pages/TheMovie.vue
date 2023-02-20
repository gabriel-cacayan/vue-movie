<template>
  <v-main>
    <v-container class="bg-black-4 h-100 pa-0">
      <div v-if="movieInfo" class="d-flex flex-column flex-md-row align-center">
        <div>
          <v-img
            v-if="movieInfo.backdrop_path"
            height="500"
            width="500"
            :src="renderPoster(movieInfo.backdrop_path)"
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
          <h1>{{ movieInfo.original_title }}</h1>
          <p class="text-grey-darken-1 mb-4">{{ movieInfo.tagline }}</p>
          <p class="text-grey-lighten-1 mb-4">{{ movieInfo.overview }}</p>
          <p class="mb-4">
            Genres:
            <template v-for="genre in movieInfo.genres" :key="genre.id">
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
        </div>
      </div>

      <!-- Tabs -->

      <v-card>
        <v-tabs v-model="tab" color="red-accent-4" align-tabs="title">
          <v-tab v-for="item in items" :key="item" :value="item">{{
            item
          }}</v-tab>
        </v-tabs>
        <v-window v-model="tab">
          <v-window-item v-if="casts" value="Casts">
            <div
              class="d-flex flex-row pa-4 align-center"
              v-for="cast in casts"
              :key="cast.id"
              @click="getPerson(cast.id)"
              id="avatars"
            >
              <v-avatar
                :image="renderPoster(cast.profile_path)"
                size="100"
              ></v-avatar>
              <div class="ml-4">
                <p>{{ cast.character }}</p>
                <p class="text-grey">{{ cast.original_name }}</p>
              </div>
            </div>
          </v-window-item>

          <v-window-item v-if="movies" value="Recommendations">
            <v-row>
              <v-col
                v-for="movie in movies"
                :key="movie.id"
                :cols="transferToCol"
              >
                <v-card
                  class="mx-auto"
                  hover
                  v-ripple
                  max-width="344"
                  :loading="isLoading && movie.id == cardId"
                  @click="getSpecificMovie(movie.id)"
                >
                  <v-img
                    :lazy-src="cardImagePlaceholder"
                    :src="renderPoster(movie.poster_path)"
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
          </v-window-item>
        </v-window>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
export default {
  inject: [
    "transferToCol",
    "apiKey",
    "renderPoster",
    "movieImagePlaceholder",
    "cardImagePlaceholder",
  ],
  props: ["id"],
  data() {
    return {
      movieInfo: null,
      tab: "Casts",
      items: ["Casts", "Recommendations"],
      casts: null,
      movies: null,
    };
  },
  computed: {
    budget() {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(this.movieInfo.budget);
    },
    revenue() {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(this.movieInfo.revenue);
    },
    runtime() {
      var hours = Math.floor(this.movieInfo.runtime / 60);
      var minutes = this.movieInfo.runtime % 60;
      return hours + "h " + minutes + "m";
    },
  },
  methods: {
    /**
     *
     * * Get the primary information about a movie.
     * @param id int - movie id
     */
    getSpecificMovie: function (id) {
      this.isLoading = true;

      if (this.$route.params.id !== id) {
        this.$router.push({ name: "movies.show", params: { id: id } });
      }

      fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${this.apiKey}&language=en-US`
      )
        .then((response) => response.json())
        .then((result) => {
          // console.log(result);
          this.movieInfo = result;
          this.isLoading = false;
        })
        .catch((error) => {
          // console.error("Error:", error);
          this.isLoading = false;
        });
    },
    /**
     *
     * * Get the cast and crew for a movie.
     * @param id int - movie id
     */
    getCredits: function (id) {
      this.isLoading = true;
      fetch(
        `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${this.apiKey}&language=en-US`
      )
        .then((response) => response.json())
        .then((result) => {
          // console.log(result.cast);
          this.casts = result.cast;
          this.isLoading = false;
        })
        .catch((error) => {
          // console.error("Error:", error);
          this.isLoading = false;
        });
    },
    /**
     *
     * * Get a list of recommended movies for a movie.
     * @param id int - movie id
     */
    getRecommendations: function (id) {
      // console.log(id);
      this.isLoading = true;
      fetch(
        `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${this.apiKey}&language=en-US&page=1`
      )
        .then((response) => response.json())
        .then((result) => {
          // console.log(result);
          this.movies = result.results;
          this.isLoading = false;
        })
        .catch((error) => {
          // console.error("Error:", error);
          this.isLoading = false;
        });
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
  mounted: function () {
    this.getSpecificMovie(this.id);
    this.getCredits(this.id);
    this.getRecommendations(this.id);
  },
  updated() {
    this.tab = "Casts";
    this.getCredits(this.id);
    this.getRecommendations(this.id);
  },
};
</script>

<style scoped>
#avatars {
  cursor: pointer;
}

#avatars:hover {
  background: #424242;
}
</style>
