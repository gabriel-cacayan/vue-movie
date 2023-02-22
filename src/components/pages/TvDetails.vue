<template>
  <div
    v-if="tvInfo"
    id="main"
    :style="{
      backgroundImage: `url('${renderPoster(tvInfo.backdrop_path)}')`,
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
          v-if="tvInfo.poster_path"
          class="rounded-lg"
          height="500"
          width="300"
          aspect-ratio="16/9"
          eager
          :src="renderPoster(tvInfo.poster_path)"
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
        <h1>{{ tvInfo.original_name }}</h1>
        <p class="text-grey-lighten-1 mb-4">{{ tvInfo.tagline }}</p>
        <p class="text-grey-lighten-3 mb-4 pr-2">{{ tvInfo.overview }}</p>
        <p class="mb-4">
          Genres:
          <template v-for="genre in tvInfo.genres" :key="genre.id">
            <v-chip class="mr-2">
              {{ genre.name }}
            </v-chip>
          </template>
        </p>
        <p class="my-4 d-flex flex-row">
          <template
            v-for="created_by in tvInfo.created_by"
            :key="created_by.id"
          >
            <div class="mr-10">
              <h3 class="">{{ created_by.name }}</h3>
              <p>Creator</p>
            </div>
          </template>
        </p>
      </div>
    </div>
  </div>

  <!-- Open in mobile -->
  <div
    v-if="tvInfo"
    class="d-flex d-md-none flex-column flex-md-row align-center overflow-hidden"
  >
    <div>
      <v-img
        v-if="tvInfo.backdrop_path"
        :src="renderPoster(tvInfo.backdrop_path)"
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
      <h1>{{ tvInfo.original_name }}</h1>
      <p class="text-grey-lighten-1 mb-4">{{ tvInfo.tagline }}</p>
      <p class="text-grey-lighten-3 mb-4 pr-2">{{ tvInfo.overview }}</p>
      <p class="mb-4">
        Genres:
        <template v-for="genre in tvInfo.genres" :key="genre.id">
          <v-chip class="mr-2">
            {{ genre.name }}
          </v-chip>
        </template>
      </p>
      <p class="my-4 d-flex flex-row">
        <template v-for="created_by in tvInfo.created_by" :key="created_by.id">
          <div class="mr-10">
            <h3 class="">{{ created_by.name }}</h3>
            <p>Creator</p>
          </div>
        </template>
      </p>
    </div>
  </div>

  <v-container v-if="tvInfo">
    <v-card
      border
      class="my-10"
      v-for="season in tvInfo.seasons"
      :key="season.id"
    >
      <v-row align="center">
        <v-col cols="3" md="2" class="pa-0">
          <v-img
            v-if="season.poster_path"
            width="1000"
            aspect-ratio="16/9"
            eager
            :src="renderPoster(season.poster_path)"
            cover
          ></v-img>
          <v-img
            v-else
            width="1000"
            aspect-ratio="16/9"
            eager
            :src="cardImagePlaceholder"
            cover
          ></v-img>
        </v-col>
        <v-col cols="9" md="10">
          <div class="ml-4">
            <h1>{{ season.name }}</h1>
            <p class="font-weight-bold">
              {{ season.air_date ? parseInt(season.air_date) : "Unknown" }} |
              {{ pluralizeTheEpisode(season.episode_count) }}
            </p>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
  <!-- <pre>
        {{ tvInfo }}
    </pre
  > -->
</template>

<script>
export default {
  inject: ["apiKey", "renderPoster", "cardImagePlaceholder"],
  props: ["id"],
  data() {
    return {
      tvInfo: null,
    };
  },
  methods: {
    /**
     *
     * * Get the primary TV show details by id.
     * @param id int - tv id
     */
    getTvDetails: function (id) {
      fetch(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${this.apiKey}&language=en-US`
      )
        .then((response) => response.json())
        .then((result) => {
          //   console.log(result);
          this.tvInfo = result;
        })
        .catch((error) => {});
    },
    /**
     * Pluralize the word episode based on count
     * @param episode int - episode count
     */
    pluralizeTheEpisode: function (episode) {
      return episode > 1 ? episode + " Episodes" : episode + " Episode";
    },
  },
  mounted() {
    this.getTvDetails(this.id);
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

#overlay-main {
  position: absolute;
  top: 50%;
  bottom: 50%;
  left: 5%;
  right: 5%;
  z-index: 3;
}
</style>
