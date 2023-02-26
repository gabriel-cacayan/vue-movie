<template>
  <v-container class="px-0" fluid>
    <v-progress-linear
      v-if="isLoading"
      indeterminate
      color="yellow-accent-4"
    ></v-progress-linear>

    <v-container v-if="tvCasts" class="my-10">
      <v-row no-gutters>
        <v-col md="12">
          <p class="text-h4">Casts</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="cast in tvCasts" :key="cast.id" cols="12" md="4">
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
                  {{ cast.roles[0].character }}
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
      tvCasts: [],
    };
  },
  methods: {
    /**
     *  Get the aggregate credits (cast and crew) that have been added to a TV show.
     * @param id int - tv id
     */
    getTvCredits: function (id) {
      this.isLoading = true;

      fetch(
        `https://api.themoviedb.org/3/tv/${id}/aggregate_credits?api_key=${this.apiKey}&language=en-US`
      )
        .then((response) => response.json())
        .then((result) => {
          result.cast.forEach((element, i) => {
            this.tvCasts.push(element);
          });

          this.isLoading = false;
        })
        .catch((error) => {});
    },
  },
  mounted() {
    this.getTvCredits(this.id);
  },
};
</script>

<style></style>
