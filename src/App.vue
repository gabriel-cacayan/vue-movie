<template>
  <!-- Main -->
  <v-app theme="dark">
    <the-header :breakpoints="getBreakPoints"></the-header>

    <v-main>
      <router-view></router-view>
    </v-main>

    <the-footer></the-footer>
  </v-app>
</template>

<script>
import { useDisplay } from "vuetify";
import TheHeader from "@/components/UI/TheHeader.vue";
import TheFooter from "./components/UI/TheFooter.vue";
import defaultCardImage from "./assets/default-card.png";
import defaultProfilePicture from "./assets/default-profile.png";

export default {
  name: "App",
  components: {
    TheHeader,
    TheFooter,
  },
  data() {
    return {
      apiKey: "fd920f7d47c80b3bf8615aec1773db04",
      defaultCardImage: defaultCardImage,
      defaultProfilePicture: defaultProfilePicture,
    };
  },
  computed: {
    getBreakPoints: function () {
      return useDisplay().name.value;
    },
    transferToCol: function () {
      if (this.getBreakPoints == "xs" || this.getBreakPoints == "sm") {
        return 6;
      } else if (this.getBreakPoints == "md" || this.getBreakPoints == "lg") {
        return 2;
      } else {
        return 1;
      }
    },
  },
  methods: {
    /**
     * Render image from api.
     */
    renderPoster: function (image) {
      return "https://image.tmdb.org/t/p/original" + image;
    },
    /**
     * Get the primary information about a movie.
     * @param id int - movie id
     */
    getSpecificMovie: function (id) {
      this.isLoading = true;
      fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${this.apiKey}&language=en-US`
      )
        .then((response) => response.json())
        .then((result) => {
          this.$router.push({ name: "movies.show", params: { id: id } });
          this.isLoading = false;
          this.cardId = id;
        })
        .catch((error) => {
          console.error("Error:", error);
          this.isLoading = false;
        });
    },
  },
  provide() {
    return {
      getBreakPoints: this.getBreakPoints,
      transferToCol: this.transferToCol,
      apiKey: this.apiKey,
      renderPoster: this.renderPoster,
      movieImagePlaceholder: this.movieImagePlaceholder,
      cardImagePlaceholder: this.cardImagePlaceholder,
      getSpecificMovie: this.getSpecificMovie,
      defaultCardImage: this.defaultCardImage,
      defaultProfilePicture: this.defaultProfilePicture,
    };
  },
};
</script>
