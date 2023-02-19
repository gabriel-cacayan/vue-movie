<template>
  <v-main>
    <v-container fluid>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium nam
        quam eveniet voluptas hic. Magnam, corrupti. Repellendus eligendi
        excepturi sed officiis, maiores pariatur veritatis porro incidunt vel,
        commodi molestias labore.
      </p>
      <pre v-if="movies">
        {{ movies }}
      </pre>
      {{ search }}
    </v-container>
  </v-main>
</template>

<script>
export default {
  props: ["search"],
  inject: ["searchMovies"],
  data() {
    return {
      movies: this.searchMovies,
    };
  },
  methods: {
    //
  },
  mounted() {
    console.log(this.searchMovies);
  },
};
</script>

<style></style>
