<template>
  <v-main
    class="h-100 bg-grey-lighten-5 d-flex flex-column align-center justify-center"
  >
    <v-container>
      <div>
        <v-text-field
          clearable
          label="Enter your keywords"
          variant="outlined"
          class="w-75 mx-auto"
          v-model="search"
          @keyup.enter="searchMovie"
        ></v-text-field>
      </div>
    </v-container>
  </v-main>
</template>

<script>
export default {
  methods: {
    /**
     * * Search a movie from api.
     *
     *
     */
    searchMovie: function () {
      this.$router.push({ name: "search", query: { search: this.search } });
    },
  },
};
</script>

<style></style>
