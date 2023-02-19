<template>
  <!-- Main -->
  <v-app theme="dark">
    <the-header :breakpoints="getBreakPoints"></the-header>

    <router-view></router-view>

    <the-footer></the-footer>
  </v-app>
</template>

<script>
import { useDisplay } from "vuetify";
import TheHeader from "@/components/UI/TheHeader.vue";
import TheFooter from "./components/UI/TheFooter.vue";

export default {
  name: "App",
  components: {
    TheHeader,
    TheFooter,
  },
  data() {
    return {
      apiKey: "fd920f7d47c80b3bf8615aec1773db04",
      movieImagePlaceholder:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fthecai.ie%2Fwp-content%2Fthemes%2Fsalient-child%2Fimages%2Fplaceholder.png&f=1&nofb=1&ipt=1c3d09d014c6f2e5c74c445b1453ac228e28d7aaf261f0cb37973a705ad12045&ipo=images",
      cardImagePlaceholder:
        "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fbooks.tsl.org.au%2Fwp-content%2Fuploads%2Fsites%2F3%2F2015%2F01%2FNO-Image-placeholder.png&f=1&nofb=1&ipt=d5d828af708f14e0ab212c0013560c8f72e96f4cda9c6e831c1aca421bc9530e&ipo=images",
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
     *
     * * Render image from api.
     *
     */
    renderPoster: function (image) {
      return "https://image.tmdb.org/t/p/original" + image;
    },
    /**
     *
     * * Get the primary information about a movie.
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
    };
  },
  mounted() {
    // console.log(this.$route.path);
  },
};
</script>
