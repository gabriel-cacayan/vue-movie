<template>
  <section>
    <div
      v-if="movieInfo"
      id="main"
      :style="{
        backgroundImage: `url('${renderPoster(movieInfo.backdrop_path)}')`,
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
            v-if="movieInfo.poster_path"
            class="rounded-lg"
            height="500"
            width="300"
            aspect-ratio="16/9"
            eager
            :src="renderPoster(movieInfo.poster_path)"
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
          <p class="text-grey-lighten-1 mb-4">{{ movieInfo.tagline }}</p>
          <p class="text-grey-lighten-3 mb-4 pr-2">{{ movieInfo.overview }}</p>
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
    </div>

    <!-- Open in mobile -->
    <div
      v-if="movieInfo"
      class="d-flex d-md-none flex-column flex-md-row align-center overflow-hidden"
    >
      <div>
        <v-img
          v-if="movieInfo.backdrop_path"
          :src="renderPoster(movieInfo.backdrop_path)"
          cover
          height="500"
          width="500"
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
    <v-container class="bg-black-4 my-10 pa-0">
      <h1 class="text-h5 ma-4">More Details</h1>
      <v-card>
        <v-tabs v-model="tab" color="red-accent-4" align-tabs="title">
          <v-tab v-for="item in items" :key="item" :value="item">{{
            item
          }}</v-tab>
        </v-tabs>
        <v-window v-model="tab">
          <!-- Casts -->
          <v-window-item v-if="casts" value="Casts">
            <v-row>
              <v-col
                v-for="cast in casts"
                :key="cast.id"
                id="avatars"
                class="d-flex flex-row align-center mt-4"
                @click="getPerson(cast.id)"
                cols="12"
                md="4"
              >
                <v-avatar
                  :image="renderPoster(cast.profile_path)"
                  size="100"
                ></v-avatar>
                <div class="ml-4">
                  <p>{{ cast.character }}</p>
                  <p class="text-grey">{{ cast.original_name }}</p>
                </div>
              </v-col>
            </v-row>
          </v-window-item>

          <!-- Recommendations -->
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
                  :loading="isLoading"
                  @click="getSpecificMovie(movie.id)"
                >
                  <v-img
                    :lazy-src="cardImagePlaceholder"
                    :src="renderPoster(movie.poster_path)"
                    :alt="movie.poster"
                    height="250"
                    cover
                    eager
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
              </v-col>
            </v-row>
          </v-window-item>

          <!-- Production Companies -->
          <v-window-item v-if="movieInfo" value="Production Companies">
            <v-row>
              <v-col
                v-for="production in movieInfo.production_companies"
                :key="production.id"
                sm="12"
                md="4"
              >
                <v-card class="mx-auto" hover v-ripple max-width="344" border>
                  <v-img
                    :lazy-src="cardImagePlaceholder"
                    :src="renderPoster(production.logo_path)"
                    height="250"
                    cover
                    eager
                  ></v-img>

                  <v-card-title>{{ production.name }}</v-card-title>

                  <v-card-subtitle class="d-flex mb-4">
                    {{ production.origin_country }}</v-card-subtitle
                  >
                </v-card>
              </v-col>
            </v-row>
          </v-window-item>

          <!-- Other Details -->
          <v-window-item v-if="movieInfo" value="Other Details" class="pa-4">
            <div class="my-4">
              <h3>Production Countries</h3>
              <v-chip-group mandatory selected-class="text-primary">
                <v-chip
                  v-for="production in movieInfo.production_countries"
                  :key="production.iso_3166_1"
                >
                  {{ production.name }}
                </v-chip>
              </v-chip-group>
            </div>

            <div class="my-4">
              <h3>Status</h3>
              <v-chip class="mt-2">{{ movieInfo.status }}</v-chip>
            </div>

            <div class="my-4">
              <h3>Release Date</h3>
              <v-chip class="mt-2">{{ movieInfo.release_date }}</v-chip>
            </div>

            <div class="my-4">
              <h3>Vote Average</h3>
              <v-chip class="mt-2">{{
                Math.round(movieInfo.vote_average)
              }}</v-chip>
            </div>

            <div class="my-4">
              <h3>Vote Count</h3>
              <v-chip class="mt-2">{{ movieInfo.vote_count }}</v-chip>
            </div>
          </v-window-item>
        </v-window>
      </v-card>
    </v-container>
    <br />
  </section>
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
      items: [
        "Casts",
        "Recommendations",
        "Production Companies",
        "Other Details",
      ],
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
#main {
  /* background: url("https://www.pixelstalk.net/wp-content/uploads/2015/12/Avengers-marvel-comics-wallpaper-background.jpg"); */
  background-repeat: no-repeat;
  background-size: cover;
  /* background: url("https://www.pixelstalk.net/wp-content/uploads/2015/12/Avengers-marvel-comics-wallpaper-background.jpg")
    center no-repeat; */
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

#avatars {
  cursor: pointer;
}

#avatars:hover {
  background: #424242;
}
</style>
