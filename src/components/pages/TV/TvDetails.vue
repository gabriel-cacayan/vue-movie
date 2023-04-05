<template>
  <v-container class="px-0" fluid>
    <v-progress-linear
      v-if="isLoading"
      indeterminate
      color="yellow-accent-4"
    ></v-progress-linear>

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
              <v-chip class="mr-2 text-yellow-accent-4">
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
            <v-chip class="mr-2 text-yellow-accent-4">
              {{ genre.name }}
            </v-chip>
          </template>
        </p>
        <v-col
          v-for="created_by in tvInfo.created_by"
          :key="created_by.id"
          cols="12"
        >
          <h3>{{ created_by.name }}</h3>
          <p>Creator</p>
        </v-col>
      </div>
    </div>

    <v-container v-if="tvInfo">
      <v-row no-gutters class="mt-10">
        <v-col md="12">
          <p class="text-h4">Seasons</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          v-for="season in tvInfo.seasons"
          :key="season.id"
          cols="12"
          md="6"
        >
          <v-row
            v-ripple
            class="border pointer"
            no-gutters
            @click="goToSeason(season.season_number)"
          >
            <v-col md="3">
              <v-img
                v-if="season.poster_path"
                :height="200"
                :src="renderPoster(season.poster_path)"
                :lazy-src="defaultCardImage"
                cover
              ></v-img>
              <v-img v-else :height="200" :src="defaultCardImage" cover></v-img>
            </v-col>
            <v-col md="9" class="pa-4">
              <div>
                <p class="text-h6 mb-2">{{ season.name }}</p>
                <p class="text-subtitle-2 text-grey-darken-1 mb-4">
                  {{ pluralizeTheEpisode(season.episode_count) }} |
                  {{ season.air_date ? parseInt(season.air_date) : "N/A" }}
                </p>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <!-- Photos -->
    <v-container
      class="my-10"
      v-if="
        backdropImages.length !== 0 &&
        posterImages.length !== 0 &&
        !imagesIsLoading
      "
    >
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
          v-for="(image, i) in backdropImages"
          :key="i"
          :href="renderPoster(image.file_path)"
          :onBeforeOpen="onBeforeOpen"
          :onBeforeClose="onBeforeClose"
          :data-lg-size="`${image.width}-${image.height}`"
        >
          <img
            v-show="i == 0 || openImageGallery == true"
            :src="renderPoster(image.file_path)"
            height="200"
            class="border"
          />
        </a>
        <a
          v-for="(image, i) in posterImages"
          :key="i"
          :href="renderPoster(image.file_path)"
          :onBeforeOpen="onBeforeOpen"
          :onBeforeClose="onBeforeClose"
          :data-lg-size="`${image.width}-${image.height}`"
        >
          <img
            v-show="i == 0 || openImageGallery == true"
            :src="renderPoster(image.file_path)"
            height="200"
            class="border ml-0 ml-md-4"
          />
        </a>
      </lightgallery>
    </v-container>

    <v-container v-if="tvCasts" class="my-10">
      <v-row no-gutters>
        <v-col md="9">
          <p class="text-h4">Casts</p>
        </v-col>
        <v-col md="3" align="end" justify="center">
          <router-link
            :to="{ name: 'tv.casts', params: { id: id } }"
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

    <v-container v-if="tvInfo" class="my-10">
      <v-row no-gutters>
        <v-col md="12" class="py-4">
          <p class="text-h4">Details</p>
        </v-col>
        <v-divider></v-divider>
        <v-col md="12" class="py-4">
          <p class="text-grey-darken-1">
            <span class="text-grey-lighten-4 font-weight-medium mr-4"
              >Release Date</span
            >
            {{ tvInfo.first_air_date }}
          </p>
        </v-col>
        <v-divider></v-divider>
        <v-col md="12" class="py-4">
          <p class="text-grey-darken-1">
            <span class="text-grey-lighten-4 font-weight-medium mr-4"
              >Episode runtime</span
            >
            {{ runtime }}
          </p>
        </v-col>
        <v-divider></v-divider>
        <v-col md="12" class="py-4">
          <p class="text-grey-darken-1">
            <span class="text-grey-lighten-4 font-weight-medium mr-4"
              >Language</span
            >
            {{ tvInfo.spoken_languages[0].english_name }}
          </p>
        </v-col>
        <v-divider></v-divider>
        <v-col md="12" class="py-4">
          <p class="text-grey-darken-1">
            <span class="text-grey-lighten-4 font-weight-medium mr-4"
              >Status</span
            >
            {{ tvInfo.status }}
          </p>
        </v-col>
        <v-divider></v-divider>
        <v-col md="12" class="py-4">
          <ul class="text-grey-darken-1">
            <span class="text-grey-lighten-4 font-weight-medium mr-4"
              >Production Companies</span
            >
            <li
              v-for="(production, i) in tvInfo.production_companies"
              :key="production.id"
              class="d-inline-flex mr-2"
            >
              {{ addDash(tvInfo.production_companies, production, i) }}
            </li>
          </ul>
        </v-col>
        <v-divider></v-divider>
        <v-col md="12" class="py-4">
          <ul class="text-grey-darken-1">
            <span class="text-grey-lighten-4 font-weight-medium mr-4"
              >Networks</span
            >
            <li
              v-for="(network, i) in tvInfo.networks"
              :key="network.id"
              class="d-inline-flex mr-2"
            >
              {{ addDash(tvInfo.networks, network, i) }}
            </li>
          </ul>
        </v-col>
      </v-row>
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
  inject: ["apiKey", "renderPoster", "defaultCardImage", "getPersonDetails"],
  props: ["id"],
  data() {
    return {
      tvInfo: null,
      backdropImages: [],
      posterImages: [],
      imagesIsLoading: false,
      plugins: [lgThumbnail, lgZoom],
      openImageGallery: false,
      mobileSettings: {
        controls: true,
        showCloseIcon: true,
        download: true,
      },
      isLoading: false,
      tvCasts: [],
    };
  },
  computed: {
    runtime() {
      var hours = Math.floor(this.tvInfo.episode_run_time / 60);
      var minutes = this.tvInfo.episode_run_time % 60;
      if (hours > 0) {
        return hours + "h " + minutes + "m";
      } else {
        return minutes + "m";
      }
    },
  },
  methods: {
    onBeforeOpen() {
      this.openImageGallery = true;
    },
    onBeforeClose() {
      this.openImageGallery = false;
    },
    /**
     * Get a companies details by id.
     * @param id int - company id
     */
    getCompanyHomepage(id) {
      this.companyIsLoading = true;
      fetch(`https://api.themoviedb.org/3/company/${id}?api_key=${this.apiKey}`)
        .then((response) => response.json())
        .then((result) => {})
        .catch((error) => {});
    },
    /**
     * Add dash to companies
     */
    addDash(lists, production, i) {
      if (lists.length == i + 1) {
        return production.name;
      } else {
        return production.name + " - ";
      }
    },
    /**
     * Pluralize the word episode based on count
     * @param episode int - episode count
     */
    pluralizeTheEpisode(episode) {
      return episode > 1 ? episode + " Episodes" : episode + " Episode";
    },
    /**
     * Get the primary TV show details by id.
     * @param id int - tv id
     */
    getTvDetails(id) {
      this.isLoading = true;
      this.imagesIsLoading = true;
      // &append_to_response=videos,images
      fetch(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${this.apiKey}&append_to_response=videos,images`
      )
        .then((response) => response.json())
        .then((result) => {
          result.images.backdrops.forEach((element) => {
            this.backdropImages.push(element);
          });

          result.images.posters.forEach((element) => {
            this.posterImages.push(element);
          });

          this.tvInfo = result;
          this.imagesIsLoading = false;
          this.isLoading = false;
        })
        .catch((error) => {});
    },
    /**
     *  Get the aggregate credits (cast and crew) that have been added to a TV show.
     * @param id int - tv id
     */
    getTvCredits(id) {
      this.isLoading = true;

      fetch(
        `https://api.themoviedb.org/3/tv/${id}/aggregate_credits?api_key=${this.apiKey}&language=en-US`
      )
        .then((response) => response.json())
        .then((result) => {
          result.cast.forEach((element, i) => {
            if (i < 6) {
              // console.log(element);
              this.tvCasts.push(element);
            }
          });

          this.isLoading = false;
        })
        .catch((error) => {});
    },
    /**
     * @param id int - season id
     */
    goToSeason(seasonNumber) {
      this.$router.push({
        name: "tv.season",
        params: { id: this.id, seasonNumber: seasonNumber },
      });
    },
  },
  mounted() {
    this.getTvDetails(this.id);
    this.getTvCredits(this.id);
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
