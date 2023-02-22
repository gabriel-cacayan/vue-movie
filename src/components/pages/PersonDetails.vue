<template>
  <v-container class="mt-4 pa-0" v-if="personInfo">
    <div class="d-flex flex-column flex-md-row">
      <div class="d-flex flex-column align-start justify-start pa-4">
        <img
          v-if="personInfo.profile_path"
          class="rounded-lg"
          height="400"
          :src="renderPoster(personInfo.profile_path)"
          :lazy-src="movieImagePlaceholder"
        />

        <img
          v-else
          class="rounded-lg"
          height="400"
          :src="cardImagePlaceholder"
        />

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
            {{ personInfo.birthday }}
          </p>
        </div>

        <div class="mt-4">
          <p class="font-weight-medium">Place of birth</p>
          <p class="text-grey">
            {{ personInfo.place_of_birth }}
          </p>
        </div>

        <div class="mt-4" v-if="personInfo.deathday">
          <p class="font-weight-medium">Deathday</p>
          <p class="text-grey">
            {{ personInfo.deathday }}
          </p>
        </div>

        <div class="mt-4">
          <p class="font-weight-medium">
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
      <div class="mt-4 mt-md-0 px-md-4">
        <div class="pa-4">
          <h1>{{ personInfo.name }}</h1>
          <v-chip color="#D32F2F" class="font-weight-medium mt-8">
            Biography
          </v-chip>
          <p class="mt-4">
            {{
              personInfo.biography
                ? personInfo.biography
                : "No data is available to this person."
            }}
          </p>
        </div>

        <!-- Known For -->
        <div class="mt-10" v-if="personCasts">
          <v-chip color="#D32F2F" class="font-weight-medium ma-4">
            Known For
          </v-chip>
          <!-- List -->
          <v-list lines="two">
            <v-list-item
              v-for="cast in personCasts"
              :key="cast.id"
              :subtitle="cast.original_title"
              :title="cast.character"
              :prepend-avatar="renderPoster(cast.backdrop_path)"
              @click="getSpecificMovie(cast.id)"
            ></v-list-item>
          </v-list>
        </div>

        <!-- Images -->
        <div class="mt-10" v-if="personImages.length !== 0">
          <v-chip color="#D32F2F" class="font-weight-medium ma-4">
            Photos
          </v-chip>
          <v-carousel hide-delimiters show-arrows="hover" v-model="model">
            <v-carousel-item
              v-for="(image, i) in personImages"
              :key="i"
              :src="renderPoster(image.file_path)"
              :lazy-src="movieImagePlaceholder"
              :value="i"
              width="auto"
              class="mx-auto"
            >
            </v-carousel-item>
          </v-carousel>
        </div>
      </div>
    </div>
    <br />
  </v-container>
</template>

<script>
export default {
  inject: [
    "apiKey",
    "renderPoster",
    "cardImagePlaceholder",
    "movieImagePlaceholder",
    "getSpecificMovie",
    "transferToCol",
  ],
  props: ["id"],
  data() {
    return {
      personInfo: null,
      personImages: [],
      model: 0,
      personCasts: [],
      knownForCarousel: 0,
    };
  },
  methods: {
    addComma: function (value, i) {
      return this.personInfo.also_known_as.length == i + 1
        ? value
        : value + ",";
    },
    /**
     *
     * * Get the primary person details by id.
     *
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
     *
     * * Get the movie credits for a person.
     *
     */
    getPersonMovieCredits: function () {
      fetch(
        `https://api.themoviedb.org/3/person/${this.id}/movie_credits?api_key=${this.apiKey}&language=en-US`
      )
        .then((response) => response.json())
        .then((result) => {
          // console.log(result);
          result.cast.forEach((element) => {
            this.personCasts.push(element);
          });
        })
        .catch((error) => {});
    },
    /**
     *
     * * Get the images for a person.
     *
     */
    getPersonImages: function () {
      fetch(
        `https://api.themoviedb.org/3/person/${this.id}/images?api_key=${this.apiKey}`
      )
        .then((response) => response.json())
        .then((result) => {
          result.profiles.forEach((element) => {
            this.personImages.push(element);
          });
        })
        .catch((error) => {});
    },
  },
  mounted() {
    this.getPerson();
    this.getPersonMovieCredits();
    this.getPersonImages();
  },
  updated() {
    this.getPersonImages();
  },
};
</script>

<style scoped></style>
