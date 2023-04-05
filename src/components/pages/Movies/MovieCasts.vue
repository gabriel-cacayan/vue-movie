<template>
  <v-container class="px-0" fluid>
    <v-progress-linear
      v-if="isLoading"
      indeterminate
      color="yellow-accent-4"
    ></v-progress-linear>

    <v-container v-if="movieCasts && !isLoading" class="my-10">
      <v-row no-gutters>
        <v-col md="9">
          <p class="text-h4">Casts</p>
        </v-col>
        <v-col md="3" align="end">
          <v-btn class="bg-yellow-accent-4" @click="goBack">Go Back</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="cast in movieCasts" :key="cast.id" cols="12" md="4">
          <v-row
            v-ripple
            class="border pointer"
            no-gutters
            @click="getPersonDetails(cast.id)"
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
  </v-container>
</template>

<script>
export default {
  inject: ["apiKey", "renderPoster", "defaultCardImage", "getPersonDetails"],
  props: ["id"],
  data() {
    return {
      isLoading: true,
      movieCasts: [],
    };
  },
  methods: {
    /**
     *  Get the aggregate credits (cast and crew) that have been added to a TV show.
     * @param id int - tv id
     */
    getMovieCredits(id) {
      this.isLoading = true;

      fetch(
        `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${this.apiKey}&language=en-US`
      )
        .then((response) => response.json())
        .then((result) => {
          result.cast.forEach((element, i) => {
            this.movieCasts.push(element);
          });

          this.isLoading = false;
        })
        .catch((error) => {});
    },
    goBack() {
      this.$router.go(-1);
    },
  },
  mounted() {
    this.getMovieCredits(this.id);
  },
};
</script>

<style></style>
