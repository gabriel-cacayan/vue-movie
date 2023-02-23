<template>
  <section
    class="h-100 bg-grey-lighten-5 d-flex flex-column align-center justify-center"
    id="section-find-movie"
  >
    <v-container>
      <div class="d-flex flex-row">
        <v-select
          label="Filter"
          :items="['Movie', 'People', 'Tv']"
          variant="underlined"
          class="w-25"
          v-model="filter"
        ></v-select>
        <v-text-field
          clearable
          :label="`Search ${filter}`"
          variant="underlined"
          class="w-75 mx-auto"
          v-model="search"
          @keyup.enter="searchMovie"
        ></v-text-field>
      </div>
    </v-container>
  </section>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      filter: "Movie",
    };
  },
  methods: {
    /**
     * Search a movie from api.
     */
    searchMovie: function () {
      this.$router.push({
        name: "search",
        query: { search: this.search, criteria: this.filter },
      });
    },
  },
};
</script>

<style scoped>
#section-find-movie {
  min-height: 100vh;
}
</style>
