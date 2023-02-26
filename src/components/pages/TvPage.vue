<template>
  <v-container class="px-0" fluid>
    <v-progress-linear
      indeterminate
      v-if="isLoading"
      color="yellow-accent-4"
    ></v-progress-linear>

    <!-- Search Result For Tvs  -->
    <v-container
      v-if="
        criteria == 'Popular' && popularTvShows.length != 0 && isLoading != true
      "
      class="pa-4 my-10"
    >
      <v-select label="Select" :items="items" v-model="criteria"></v-select>
      <v-row>
        <v-col v-for="tv in popularTvShows" :key="tv.id" cols="6" md="3">
          <v-card class="mx-auto" hover v-ripple>
            <v-img
              v-if="tv.poster_path"
              :src="renderPoster(tv.poster_path)"
              :lazy-src="defaultCardImage"
              cover
              @click="routeToTvDetails(tv.id)"
            ></v-img>
            <v-img
              v-else
              :src="defaultCardImage"
              cover
              @click="routeToTvDetails(tv.id)"
            ></v-img>

            <v-card-title>{{ tv.original_name }}</v-card-title>

            <v-card-subtitle class="d-flex mb-4">
              <div>
                <v-icon icon="mdi-star" color="#FFFF00"></v-icon>
                {{ Math.round(tv.vote_average) }}
              </div>
              <v-spacer></v-spacer>
              <p>
                {{
                  tv.first_air_date ? parseInt(tv.first_air_date) : "Unknown"
                }}
              </p>
            </v-card-subtitle>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-pagination :length="totalPages" v-model="page"></v-pagination>
        </v-col>
      </v-row>
    </v-container>

    <!-- Search Result For Tvs  -->
    <div
      v-if="
        criteria == 'Top Rated' &&
        TopRatedTvShows.length != 0 &&
        isLoading != true
      "
      class="pa-4 my-10"
    >
      <v-select label="Select" :items="items" v-model="criteria"></v-select>
      <v-row>
        <v-col v-for="tv in TopRatedTvShows" :key="tv.id" cols="6" md="3">
          <v-card class="mx-auto" hover v-ripple>
            <v-img
              v-if="tv.poster_path"
              :src="renderPoster(tv.poster_path)"
              :lazy-src="defaultCardImage"
              cover
              @click="routeToTvDetails(tv.id)"
            ></v-img>
            <v-img
              v-else
              :src="defaultCardImage"
              cover
              @click="routeToTvDetails(tv.id)"
            ></v-img>

            <v-card-title>{{ tv.original_name }}</v-card-title>

            <v-card-subtitle class="d-flex mb-4">
              <div>
                <v-icon icon="mdi-star" color="#FFFF00"></v-icon>
                {{ Math.round(tv.vote_average) }}
              </div>
              <v-spacer></v-spacer>
              <p>
                {{
                  tv.first_air_date ? parseInt(tv.first_air_date) : "Unknown"
                }}
              </p>
            </v-card-subtitle>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-pagination :length="totalPages" v-model="page"></v-pagination>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
export default {
  inject: ["apiKey", "renderPoster", "defaultCardImage"],
  data() {
    return {
      popularTvShows: [],
      TopRatedTvShows: [],
      page: parseInt(this.$route.query.page),
      totalPages: 0,
      isLoading: false,
      items: ["Popular", "Top Rated"],
      criteria: "Popular",
    };
  },
  watch: {
    page(newValue, oldValue) {
      this.$router.push({ name: "tv.index", query: { page: this.page } });
      this.popularTvShows = [];
      this.TopRatedTvShows = [];
    },
  },
  methods: {
    /**
     * This is a release type query that looks for all movies that have a release type of 2 or 3 within the specified date range.
     */
    getPopularTvShows: function () {
      this.isLoading = true;

      fetch(
        `https://api.themoviedb.org/3/tv/popular?api_key=${this.apiKey}&language=en-US&page=${this.page}`
      )
        .then((response) => response.json())
        .then((result) => {
          this.totalPages = result.total_pages;

          let onlyEn = result.results.filter(
            (result) => result.original_language == "en"
          );

          onlyEn.forEach((element) => {
            this.popularTvShows.push(element);
          });

          this.isLoading = false;
        })
        .catch((error) => {});
    },
    getTopRated: function () {
      this.isLoading = true;

      fetch(
        `
https://api.themoviedb.org/3/tv/top_rated?api_key=${this.apiKey}&language=en-US&page=${this.page}`
      )
        .then((response) => response.json())
        .then((result) => {
          this.totalPages = result.total_pages;

          let onlyEn = result.results.filter(
            (result) => result.original_language == "en"
          );

          onlyEn.forEach((element) => {
            this.TopRatedTvShows.push(element);
          });

          this.isLoading = false;
        })
        .catch((error) => {});
    },
    /**
     * Route to details of tv.
     * @param id int - tv id
     */
    routeToTvDetails: function (id) {
      this.$router.push({
        name: "tv",
        params: { id: id },
      });
    },
  },
  mounted() {
    this.getPopularTvShows();
    this.getTopRated();
  },
  updated() {
    this.getPopularTvShows();
    this.getTopRated();
  },
};
</script>

<style></style>
