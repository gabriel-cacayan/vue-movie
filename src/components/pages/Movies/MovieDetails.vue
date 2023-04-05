<template>
  <v-container class="px-0" fluid>
    <v-progress-linear
      v-if="isLoading"
      indeterminate
      color="yellow-accent-4"
    ></v-progress-linear>

    <div
      v-if="movieInfo && !isLoading"
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
            :src="defaultCardImage"
          ></v-img>
        </div>
        <div class="pa-4">
          <h1>{{ movieInfo.original_title }}</h1>
          <p class="text-grey-lighten-1 mb-4">{{ movieInfo.tagline }}</p>
          <p class="text-grey-lighten-3 mb-4 pr-2">{{ movieInfo.overview }}</p>
          <p class="mb-4">
            Genres:
            <template v-for="genre in movieInfo.genres" :key="genre.id">
              <v-chip class="mr-2 text-yellow-accent-4">
                {{ genre.name }}
              </v-chip>
            </template>
          </p>
        </div>
      </div>
    </div>

    <!-- Open in mobile -->
    <div
      v-if="movieInfo && !isLoading"
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
        <v-img v-else height="300" width="300" :src="defaultCardImage"></v-img>
      </div>
      <div class="pa-4">
        <h1>{{ movieInfo.original_title }}</h1>
        <p class="text-grey-darken-1 mb-4">{{ movieInfo.tagline }}</p>
        <p class="text-grey-lighten-1 mb-4">{{ movieInfo.overview }}</p>
        <p class="mb-4">
          Genres:
          <template v-for="genre in movieInfo.genres" :key="genre.id">
            <v-chip class="mr-2 text-yellow-accent-4">
              {{ genre.name }}
            </v-chip>
          </template>
        </p>
      </div>
    </div>

    <!-- Casts -->
    <v-container v-if="casts && !isLoading" class="my-10">
      <v-row no-gutters>
        <v-col md="9">
          <p class="text-h4">Casts</p>
        </v-col>
        <v-col md="3" align="end" justify="center">
          <router-link
            :to="{ name: 'movies.casts', params: { id: id } }"
            class="text-decoration-none"
          >
            <v-icon
              color="#FFD600"
              icon="mdi-chevron-right"
              size="x-large"
            ></v-icon>
          </router-link>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="cast in casts" :key="cast.id" cols="12" md="4">
          <v-row
            v-ripple
            class="border pointer"
            no-gutters
            @click="getPerson(cast.id)"
          >
            <v-col md="4">
              <v-img
                v-if="cast.profile_path"
                :height="200"
                :src="renderPoster(cast.profile_path)"
                :lazy-src="defaultCardImage"
                cover
              ></v-img>
              <v-img v-else :height="200" :src="defaultCardImage" cover></v-img>
            </v-col>
            <v-col md="8" class="pa-4">
              <div>
                <p class="text-h6 mb-2">{{ cast.original_name }}</p>
                <p class="text-subtitle-2 text-grey-darken-1 mb-4">
                  {{ cast.character }}
                </p>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <!-- Recommendations  -->
    <v-container v-if="recommendationMovies.length > 0 && !isLoading">
      <p class="text-h4">Recommendations</p>
      <v-sheet class="my-10 mx-auto">
        <v-slide-group v-model="model" class="pa-4" show-arrows>
          <v-slide-group-item
            v-for="movie in recommendationMovies"
            :key="movie.id"
          >
            <v-card
              class="border mx-4 fill-height"
              hover
              v-ripple
              height="350"
              width="175"
              @click="getSpecificMovie(movie.id)"
            >
              <v-img
                :src="renderPoster(movie.poster_path)"
                :lazy-src="defaultCardImage"
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
                    movie.release_date ? parseInt(movie.release_date) : "N/A"
                  }}
                </p>
              </v-card-subtitle>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-sheet>
    </v-container>

    <!-- <v-container v-if="movieInfo">
      <pre>{{ movieInfo }}</pre>
    </v-container> -->

    <!-- More Details -->
    <v-container v-if="movieInfo" class="my-10">
      <v-row no-gutters>
        <v-col md="12" class="py-4">
          <p class="text-h4">Details</p>
        </v-col>
        <v-divider></v-divider>
        <v-col md="12" class="py-4">
          <p class="text-grey-darken-1">
            <span class="text-grey-lighten-4 font-weight-medium mr-4"
              >Homepage</span
            >
            <a
              :href="movieInfo.homepage"
              target="_blank"
              class="text-decoration-none"
              >{{ movieInfo.homepage }}</a
            >
          </p>
        </v-col>
        <v-divider></v-divider>
        <v-col md="12" class="py-4">
          <p class="text-grey-darken-1">
            <span class="text-grey-lighten-4 font-weight-medium mr-4"
              >Release Date</span
            >
            {{ movieInfo.release_date }}
          </p>
        </v-col>
        <v-divider></v-divider>
        <v-col md="12" class="py-4">
          <p class="text-grey-darken-1">
            <span class="text-grey-lighten-4 font-weight-medium mr-4"
              >Runtime</span
            >
            {{ runtime }}
          </p>
        </v-col>
        <v-divider></v-divider>
        <v-col md="12" class="py-4">
          <ul class="text-grey-darken-1">
            <span class="text-grey-lighten-4 font-weight-medium mr-4"
              >Language</span
            >
            <li
              v-for="(language, i) in movieInfo.spoken_languages"
              :key="language.iso_639_1"
              class="d-inline-flex mr-2"
            >
              {{ addDash(movieInfo.spoken_languages, language, i) }}
            </li>
          </ul>
        </v-col>
        <v-divider></v-divider>
        <v-col md="12" class="py-4">
          <p class="text-grey-darken-1">
            <span class="text-grey-lighten-4 font-weight-medium mr-4"
              >Status</span
            >
            {{ movieInfo.status }}
          </p>
        </v-col>
        <v-divider></v-divider>
        <v-col md="12" class="py-4">
          <ul class="text-grey-darken-1">
            <span class="text-grey-lighten-4 font-weight-medium mr-4"
              >Production Companies</span
            >
            <li
              v-for="(production, i) in movieInfo.production_companies"
              :key="production.id"
              class="d-inline-flex mr-2"
            >
              {{ addDash(movieInfo.production_companies, production, i) }}
            </li>
          </ul>
        </v-col>
        <v-divider></v-divider>
        <v-col md="12" class="py-4">
          <p class="text-grey-darken-1">
            <span class="text-grey-lighten-4 font-weight-medium mr-4"
              >Budget</span
            >
            {{ budget }}
          </p>
        </v-col>
        <v-divider></v-divider>
        <v-col md="12" class="py-4">
          <p class="text-grey-darken-1">
            <span class="text-grey-lighten-4 font-weight-medium mr-4"
              >Revenue</span
            >
            {{ revenue }}
          </p>
        </v-col>
      </v-row>
    </v-container>

    <br />
  </v-container>
</template>

<script>
export default {
  inject: [
    "transferToCol",
    "apiKey",
    "renderPoster",
    "defaultCardImage",
    "defaultProfilePicture",
  ],
  props: ["id"],
  data() {
    return {
      movieInfo: null,
      model: 0,
      casts: [],
      recommendationMovies: [],
      isLoading: false,
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
      let hours = Math.floor(this.movieInfo.runtime / 60);
      let minutes = this.movieInfo.runtime % 60;
      return hours + "h " + minutes + "m";
    },
  },
  methods: {
    /**
     * Add dash to companies
     */
    addDash: function (lists, production, i) {
      if (lists.length == i + 1) {
        return production.name;
      } else {
        return production.name + " - ";
      }
    },
    /**
     * Get the primary information about a movie.
     * @param id int - movie id
     */
    getSpecificMovie: function (id) {
      this.isLoading = true;
      if (this.$route.params.id !== id) {
        this.$router.push({ name: "movies.show", params: { id: id } });
      }

      fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${this.apiKey}&language=en-US&append_to_response=videos,images`
      )
        .then((response) => response.json())
        .then((result) => {
          this.movieInfo = result;
          this.isLoading = false;
        })
        .catch((error) => {});
    },
    /**
     * Get the cast and crew for a movie.
     * @param id int - movie id
     */
    getCredits: function (id) {
      fetch(
        `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${this.apiKey}&language=en-US`
      )
        .then((response) => response.json())
        .then((result) => {
          // Removed the current array's items.
          this.casts = [];

          result.cast.forEach((element, i) => {
            if (i < 6) {
              this.casts.push(element);
            }
          });
        })
        .catch((error) => {});
    },
    /**
     * Get a list of recommended movies for a movie.
     * @param id int - movie id
     */
    getRecommendations: function (id) {
      fetch(
        `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${this.apiKey}&language=en-US&page=1`
      )
        .then((response) => response.json())
        .then((result) => {
          result.results.forEach((element) => {
            this.recommendationMovies.push(element);
          });
        })
        .catch((error) => {});
    },
    /**
     * Get the primary person details by id.
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
    console.log("Updated");
  },
};
</script>

<style scoped>
@import "lightgallery/css/lightgallery.css";
@import "lightgallery/css/lg-thumbnail.css";
@import "lightgallery/css/lg-zoom.css";

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

#avatars {
  cursor: pointer;
}

#avatars:hover {
  background: #424242;
}
</style>
