<template>
  <v-container class="px-0" fluid>
    <v-progress-linear
      v-if="isLoading"
      indeterminate
      color="yellow-accent-4"
    ></v-progress-linear>

    <div
      v-if="episodeInfo && !isLoading"
      id="main"
      :style="{
        backgroundImage: `url('${renderPoster(episodeInfo.still_path)}')`,
      }"
      class="d-none d-md-flex"
    >
      <div id="overlay"></div>
    </div>

    <v-container>
      <v-row v-if="episodeInfo && !isLoading" class="d-none d-md-flex">
        <v-col>
          <h1>{{ episodeInfo.name }}</h1>
          <p class="text-grey-lighten-1 mb-4">{{ episodeInfo.air_date }}</p>
          <p class="text-grey-lighten-3 mb-4 pr-2">
            {{ episodeInfo.overview }}
          </p>
        </v-col>
      </v-row>
    </v-container>

    <!-- Open in mobile -->
    <div
      v-if="episodeInfo && !isLoading"
      class="d-flex d-md-none flex-column flex-md-row align-center overflow-hidden"
    >
      <div>
        <v-img
          v-if="episodeInfo.still_path"
          :src="renderPoster(episodeInfo.still_path)"
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
        <h1>{{ episodeInfo.name }}</h1>
        <p class="text-grey-lighten-1 mb-4">{{ episodeInfo.air_date }}</p>
        <p class="text-grey-lighten-3 mb-4 pr-2">{{ episodeInfo.overview }}</p>
      </div>
    </div>

    <!-- Photos -->
    <v-container class="my-10" v-if="episodeInfo && !isLoading">
      <p class="text-h4 mb-4">Photos</p>

      <lightgallery
        :settings="{
          speed: 500,
          plugins: plugins,
          mobileSettings: mobileSettings,
          closeOnTap: true,
        }"
      >
        <a
          v-for="(image, i) in episodeInfo.images.stills"
          :key="i"
          :href="renderPoster(image.file_path)"
          :data-lg-size="`${image.width}-${image.height}`"
        >
          <img
            v-show="i == 0 || openImageGallery == true"
            :src="renderPoster(image.file_path)"
            height="200"
            class="border"
          />
        </a>
      </lightgallery>
    </v-container>
  </v-container>
</template>

<script>
import Lightgallery from "lightgallery/vue";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

export default {
  components: {
    Lightgallery,
  },
  inject: ["apiKey", "renderPoster", "defaultCardImage"],
  props: ["id", "seasonNumber", "episodeNumber"],
  data() {
    return {
      isLoading: false,
      episodeInfo: null,
      plugins: [lgThumbnail, lgZoom],
      openImageGallery: false,
      mobileSettings: {
        controls: true,
        showCloseIcon: true,
        download: true,
      },
    };
  },
  methods: {
    /**
     * Get the TV episode details by id.
     */
    getTvEpisode() {
      this.isLoading = true;

      fetch(
        `
https://api.themoviedb.org/3/tv/${this.id}/season/${this.seasonNumber}/episode/${this.episodeNumber}?api_key=${this.apiKey}&append_to_response=videos,images`
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          this.episodeInfo = result;
          this.isLoading = false;
        })
        .catch((error) => {});
    },
  },
  mounted() {
    this.getTvEpisode();
  },
};
</script>

<style scoped>
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
</style>
