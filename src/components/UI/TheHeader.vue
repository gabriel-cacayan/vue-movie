<template>
  <v-navigation-drawer theme="dark" permanent v-model="drawer">
    <v-list color="transparent">
      <v-list-item
        prepend-icon="mdi-home"
        title="Home"
        :to="{ name: 'home' }"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-magnify"
        title="Search"
        :to="{ name: 'find' }"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-app-bar :absolute="true" class="pa-2 bg-grey-darken-4">
    <v-app-bar-nav-icon
      @click="drawer = !drawer"
      v-show="breakpoints == 'xs' || breakpoints == 'sm'"
    ></v-app-bar-nav-icon>

    <div class="d-none d-md-flex align-center">
      <router-link
        :to="{ name: 'home' }"
        class="font-weight-bold text-h5 text-red-darken-2 text-decoration-none mx-5"
      >
        Vue Movie
      </router-link>

      <router-link
        :to="{ name: 'home' }"
        class="text-white text-decoration-none mr-5"
        >Home</router-link
      >

      <router-link
        :to="{ name: 'find' }"
        class="text-white text-decoration-none mr-5"
        >Search</router-link
      >
    </div>
    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<script>
export default {
  props: ["breakpoints"],
  data() {
    return {
      drawer: false,
    };
  },
};
</script>
