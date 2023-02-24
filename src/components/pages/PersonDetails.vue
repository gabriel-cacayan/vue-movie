<template>
  <v-container
    class="my-10 pa-0"
    v-if="personInfo"
    id="personal-details-container"
  >
    <div class="d-flex flex-column flex-md-row">
      <div class="d-flex flex-column align-start justify-start pa-4">
        <img
          v-if="personInfo.profile_path"
          class="rounded-lg"
          height="400"
          :src="renderPoster(personInfo.profile_path)"
          :lazy-src="defaultCardImage"
        />

        <img v-else class="rounded-lg" height="400" :src="defaultCardImage" />

        <h3 class="mt-4">Personal Info</h3>
        <div class="mt-4">
          <p class="font-weight-medium">Known for</p>
          <p class="text-grey">
            {{ personInfo.known_for_department }}
          </p>
        </div>

        <div class="mt-4">
          <p class="font-weight-medium">Gender</p>
          <p class="text-grey">
            {{ personInfo.gender == 1 ? "Female" : "Male" }}
          </p>
        </div>

        <div class="mt-4">
          <p class="font-weight-medium">Birthday</p>
          <p class="text-grey">
            {{ personInfo.birthday ? personInfo.birthday : "No data" }}
          </p>
        </div>

        <div class="mt-4">
          <p class="font-weight-medium">Place of birth</p>
          <p class="text-grey">
            {{
              personInfo.place_of_birth ? personInfo.place_of_birth : "No data"
            }}
          </p>
        </div>

        <div class="mt-4" v-if="personInfo.deathday">
          <p class="font-weight-medium">Deathday</p>
          <p class="text-grey">
            {{ personInfo.deathday }}
          </p>
        </div>

        <div class="mt-4">
          <p
            class="font-weight-medium"
            v-if="personInfo.also_known_as.length >= 1"
          >
            Also known as
            <template
              v-for="(value, i) in personInfo.also_known_as"
              :key="value"
            >
              <p class="text-grey">
                {{ addComma(value, i) }}
              </p>
            </template>
          </p>
        </div>
      </div>
      <div class="mt-4 mt-md-0 px-md-4 w-100">
        <div class="pa-4">
          <h1>{{ personInfo.name }}</h1>
          <p class="font-weight-medium mt-8">Biography</p>
          <p class="mt-4 text-grey-lighten-1">
            {{
              personInfo.biography
                ? personInfo.biography
                : "No data is available to this person."
            }}
          </p>
        </div>

        <v-row no-gutters class="mt-10 px-4">
          <v-col md="9">
            <p class="font-weight-medium">Known For</p>
          </v-col>
          <v-col md="3" align="end">
            <router-link
              :to="{ name: 'persons.movie', params: { id: id } }"
              class="text-decoration-none"
            >
              <v-icon
                color="#D32F2F"
                icon="mdi-chevron-right"
                size="x-large"
              ></v-icon>
            </router-link>
          </v-col>
        </v-row>
        <v-row v-if="personCasts">
          <v-col v-for="cast in personCasts" :key="cast.id" cols="12" md="6">
            <v-row
              v-ripple
              class="border pointer"
              no-gutters
              @click="getSpecificMovie(cast.id)"
            >
              <v-col md="3">
                <v-img
                  v-if="cast.poster_path"
                  :height="200"
                  :src="renderPoster(cast.poster_path)"
                  :lazy-src="defaultCardImage"
                  cover
                ></v-img>
                <v-img
                  v-else
                  :height="200"
                  :src="defaultCardImage"
                  cover
                ></v-img>
              </v-col>
              <v-col md="9" class="pa-4">
                <div>
                  <p class="text-h6 mb-2">{{ cast.original_title }}</p>
                  <p class="text-subtitle-2 text-grey-darken-1 mb-4">
                    {{ cast.character }}
                  </p>
                  <p class="text-grey-darken-1 mb-2">
                    <v-icon
                      color="#FFEB3B"
                      icon="mdi-star"
                      size="x-small"
                    ></v-icon>
                    {{ Math.round(cast.vote_average) }}
                  </p>
                  <p class="text-grey-darken-1 mb-2">
                    {{ parseInt(cast.release_date) }}
                  </p>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <!-- Photos -->
        <div
          class="mt-10 px-4"
          v-if="personImages.length !== 0 && !imagesIsLoading"
        >
          <p class="font-weight-medium mb-4">Photos</p>

          <lightgallery
            :settings="{
              speed: 500,
              plugins: plugins,
              mobileSettings: mobileSettings,
              closeOnTap: true,
            }"
          >
            <a
              v-for="(image, i) in personImages"
              :key="i"
              :href="renderPoster(image.file_path)"
              :onBeforeOpen="onBeforeOpen"
              :onBeforeClose="onBeforeClose"
              :data-lg-size="`${image.width}-${image.height}`"
            >
              <img
                v-show="i == 0 || openImageGallery == true"
                :src="renderPoster(image.file_path)"
                height="300"
              />
            </a>
          </lightgallery>
        </div>
      </div>
    </div>
    <br />
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
  inject: [
    "apiKey",
    "renderPoster",
    "getSpecificMovie",
    "transferToCol",
    "defaultProfilePicture",
    "defaultCardImage",
  ],
  props: ["id"],
  data() {
    return {
      personInfo: null,
      personImages: [],
      model: 0,
      personCasts: [],
      knownForCarousel: 0,
      imagesIsLoading: false,
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
    onBeforeOpen: function () {
      this.openImageGallery = true;
    },
    onBeforeClose: function () {
      this.openImageGallery = false;
    },
    addComma: function (value, i) {
      return this.personInfo.also_known_as.length == i + 1
        ? value
        : value + ",";
    },
    /**
     * Get the primary person details by id.
     */
    getPerson: function () {
      fetch(
        `https://api.themoviedb.org/3/person/${this.id}?api_key=${this.apiKey}&language=en-US`
      )
        .then((response) => response.json())
        .then((result) => {
          this.personInfo = result;
        })
        .catch((error) => {});
    },
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
            if (i < 4) {
              this.personCasts.push(element);
            }
          });
        })
        .catch((error) => {});
    },
    /**
     * Get the images for a person.
     */
    getPersonImages: function () {
      this.imagesIsLoading = true;
      fetch(
        `https://api.themoviedb.org/3/person/${this.id}/images?api_key=${this.apiKey}`
      )
        .then((response) => response.json())
        .then((result) => {
          // console.log(result);
          result.profiles.forEach((element) => {
            this.personImages.push(element);
          });
          this.imagesIsLoading = false;
        })
        .catch((error) => {});
    },
    /**
     * Get tagged images for a person.
     */
    getPersonTaggedImages: function () {
      fetch(
        `https://api.themoviedb.org/3/person/6384/tagged_images?api_key=fd920f7d47c80b3bf8615aec1773db04&language=en-US&page=1`
      )
        .then((response) => response.json())
        .then((result) => {
          // console.log(result);
          // result.profiles.forEach((element) => {
          //   this.personImages.push(element);
          // });
        })
        .catch((error) => {});
    },
  },
  mounted() {
    this.getPerson();
    this.getPersonMovieCredits();
    this.getPersonImages();
    // this.getPersonTaggedImages();
  },
  updated() {
    this.getPersonImages();
    // this.getPersonTaggedImages();
  },
};
</script>

<style scoped>
.pointer {
  cursor: pointer;
}

#personal-details-container {
  min-height: 100vh;
}
</style>
