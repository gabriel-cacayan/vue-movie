<template>
  <v-container class="my-10">
    <div class="d-flex justify-end mb-8">
      <v-btn class="bg-yellow-accent-4" @click="goBack">Go Back</v-btn>
    </div>
    <v-row v-if="credits">
      <v-col v-for="credit in credits" :key="credit.id" cols="12" md="4">
        <v-row
          v-ripple
          class="border pointer"
          no-gutters
          @click="getMovieDetails(credit.id)"
        >
          <v-col md="3">
            <v-img
              v-if="credit.poster_path"
              :height="200"
              :src="renderPoster(credit.poster_path)"
              :lazy-src="defaultCardImage"
              cover
            ></v-img>
            <v-img v-else :height="200" :src="defaultCardImage" cover></v-img>
          </v-col>
          <v-col md="9" class="pa-4">
            <div>
              <p class="text-h6 mb-2">{{ credit.original_title }}</p>
              <p class="text-subtitle-2 text-grey-darken-1 mb-4">
                {{ credit.character }}
              </p>
              <p class="text-grey-darken-1 mb-2">
                <v-icon color="#FFEB3B" icon="mdi-star" size="x-small"></v-icon>
                {{ Math.round(credit.vote_average) }}
              </p>
              <p class="text-grey-darken-1 mb-2">
                {{ parseInt(credit.release_date) }}
              </p>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  inject: ["apiKey", "renderPoster", "defaultCardImage", "getMovieDetails"],
  props: ["id"],
  data() {
    return {
      credits: [],
    };
  },
  methods: {
    /**
     * Get the movie credits for a person.
     */
    getPersonMovieCredits: function () {
      fetch(
        `https://api.themoviedb.org/3/person/${this.id}/movie_credits?api_key=${this.apiKey}&language=en-US`
      )
        .then((response) => response.json())
        .then((result) => {
          let sortedByPopularity = result.cast.sort(function (a, b) {
            return b.popularity - a.popularity;
          });

          sortedByPopularity.forEach((element, i) => {
            this.credits.push(element);
          });
        })
        .catch((error) => {});
    },
    goBack() {
      this.$router.go(-1);
    },
  },
  mounted() {
    this.getPersonMovieCredits();
  },
};
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
