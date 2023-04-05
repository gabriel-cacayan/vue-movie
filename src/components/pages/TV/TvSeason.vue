<template>
  <v-container class="px-0" fluid>
    <v-progress-linear
      v-if="isLoading"
      indeterminate
      color="yellow-accent-4"
    ></v-progress-linear>

    <v-container v-if="seasonInfo && !isLoading" class="my-10">
      <v-row no-gutters>
        <v-col md="9">
          <p class="text-h4">Episodes</p>
        </v-col>
        <v-col md="3" align="end">
          <v-btn class="bg-yellow-accent-4" @click="goBack">Go Back</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          v-for="episode in seasonInfo.episodes"
          :key="episode.id"
          cols="12"
          md="6"
        >
          <v-row
            v-ripple
            class="border pointer"
            no-gutters
            @click="goToEpisode(episode.episode_number)"
          >
            <v-col cols="12" md="3">
              <v-img
                v-if="episode.still_path"
                :height="200"
                :src="renderPoster(episode.still_path)"
                :lazy-src="defaultCardImage"
                cover
              ></v-img>
              <v-img v-else :height="200" :src="defaultCardImage" cover></v-img>
            </v-col>
            <v-col cols="12" md="9" class="pa-4">
              <div>
                <p class="text-h6 mb-2">
                  {{ episode.episode_number + "." }} {{ episode.name }}
                </p>
                <p class="text-subtitle-2 text-grey-darken-1 mb-4">
                  {{ runtime(episode.runtime) }} |
                  {{ episode.air_date ? parseInt(episode.air_date) : "N/A" }}
                </p>
                <p class="text-caption">
                  {{ episode.overview }}
                </p>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <!-- <v-container v-if="seasonInfo">
      <pre>{{ seasonInfo }}</pre>
    </v-container> -->
  </v-container>
</template>

<script>
export default {
  inject: ["apiKey", "renderPoster", "defaultCardImage"],
  props: ["id", "seasonNumber"],
  data() {
    return {
      isLoading: false,
      seasonInfo: null,
    };
  },
  methods: {
    /**
     * Get the TV season details by id.
     */
    getTvSeason() {
      this.isLoading = true;

      fetch(
        `https://api.themoviedb.org/3/tv/${this.id}/season/${this.seasonNumber}?api_key=${this.apiKey}&append_to_response=videos,images`
      )
        .then((response) => response.json())
        .then((result) => {
          this.seasonInfo = result;
          //   console.log(result);
          this.isLoading = false;
        })
        .catch((error) => {});
    },
    goBack() {
      this.$router.go(-1);
    },
    goToEpisode(episodeNumber) {
      this.$router.push({
        name: "tv.episode",
        params: {
          id: this.id,
          seasonNumber: this.seasonNumber,
          episodeNumber: episodeNumber,
        },
      });
    },
    runtime(runtime) {
      let hours = Math.floor(runtime / 60);
      let minutes = runtime % 60;
      if (hours > 0) {
        return hours + "h " + minutes + "m";
      } else {
        return minutes + "m";
      }
    },
  },
  mounted() {
    this.getTvSeason();
  },
};
</script>

<style></style>
